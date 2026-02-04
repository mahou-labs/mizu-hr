import { useCallback, useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });

  const createParticle = (x: number, y: number): Particle => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 2 + 1.5,
  });

  const updateParticles = useCallback((width: number, height: number) => {
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    for (const particle of particles) {
      // Mouse interaction - push particles away
      if (mouse.isActive) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = 120;

        if (distance < minDistance) {
          const force = (minDistance - distance) / minDistance;
          particle.vx += (dx / distance) * force * 2;
          particle.vy += (dy / distance) * force * 2;
        }
      }

      // Apply velocity with damping
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Gentle drift
      particle.vx += (Math.random() - 0.5) * 0.1;
      particle.vy += (Math.random() - 0.5) * 0.1;

      // Wrap around edges for seamless effect
      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;
    }
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;

    // Draw connections between nearby particles for fluid effect
    ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const opacity = (1 - distance / 100) * 0.3;
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles as smooth circles
    for (const particle of particles) {
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size,
      );
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateParticles(canvas.width, canvas.height);
    drawParticles(ctx);

    animationIdRef.current = requestAnimationFrame(animate);
  }, [updateParticles, drawParticles]);

  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;

    const width = canvas.width;
    const height = canvas.height;
    const particleCount = Math.floor((width * height) / 10000);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(Math.random() * width, Math.random() * height));
    }

    particlesRef.current = particles;
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeParticles();
  }, [initializeParticles]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY,
      isActive: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.isActive = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [resizeCanvas, animate, handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      className="pointer-events-none fixed inset-0 h-full w-full"
      ref={canvasRef}
      style={{
        zIndex: -1,
      }}
    />
  );
}
