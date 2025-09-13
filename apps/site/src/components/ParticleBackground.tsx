import { useCallback, useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  size: number;
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });

  const createParticle = (x: number, targetY: number): Particle => ({
    x,
    y: targetY + (Math.random() - 0.5) * 20,
    vx: 0,
    vy: 0,
    targetY,
    size: Math.floor(Math.random() * 6 + 4), // Pixelated sizes: 4-9px
  });

  const updateParticles = useCallback((width: number, height: number) => {
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const fluidHeight = height * 0.33; // Bottom 1/3 of screen
    const surface = height - fluidHeight;

    for (const particle of particles) {
      // Mouse interaction - splash effect
      if (mouse.isActive) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;

        if (distance < maxDistance && mouse.y > surface) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 8;
          particle.vy += Math.sin(angle) * force * 8 - force * 3; // Add upward force
        }
      }

      // Apply physics
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Gravity and friction
      particle.vy += 0.2; // gravity
      particle.vx *= 0.98; // friction
      particle.vy *= 0.99;

      // Return to target position
      const targetForce = 0.02;
      particle.vx += (particle.x - particle.x) * targetForce; // Stay at original x
      particle.vy += (particle.targetY - particle.y) * targetForce;

      // Boundaries
      if (particle.x < 0) {
        particle.x = 0;
        particle.vx *= -0.5;
      }
      if (particle.x > width) {
        particle.x = width;
        particle.vx *= -0.5;
      }
      if (particle.y > height) {
        particle.y = height;
        particle.vy = 0;
      }
      if (particle.y < surface) {
        particle.y = surface;
        particle.vy = Math.max(0, particle.vy);
      }
    }
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;

    for (const particle of particles) {
      // Draw pixelated particles as squares instead of circles
      ctx.fillStyle = "rgba(59, 130, 246, 0.9)"; // Blue-500 with high opacity
      const size = Math.floor(particle.size); // Ensure pixel-perfect rendering
      ctx.fillRect(
        Math.floor(particle.x - size / 2),
        Math.floor(particle.y - size / 2),
        size,
        size
      );
    }

    console.log(`Drawing ${particles.length} particles`); // Debug log
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Enable crisp pixel rendering
    ctx.imageSmoothingEnabled = false;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Test: Draw a visible blue rectangle to verify canvas is working
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
    ctx.fillRect(0, canvas.height * 0.67, canvas.width, canvas.height * 0.33);

    // Test: Draw a few test squares to verify drawing works
    ctx.fillStyle = "rgba(59, 130, 246, 1)";
    ctx.fillRect(50, canvas.height - 100, 10, 10);
    ctx.fillRect(100, canvas.height - 80, 8, 8);
    ctx.fillRect(150, canvas.height - 120, 12, 12);

    updateParticles(canvas.width, canvas.height);
    drawParticles(ctx);

    animationIdRef.current = requestAnimationFrame(animate);
  }, [updateParticles, drawParticles]);

  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;

    const width = canvas.width;
    const height = canvas.height;
    const fluidHeight = height * 0.33;
    const surface = height - fluidHeight;

    // Create particles in a grid pattern for fluid-like appearance
    const particleSpacing = 12; // Increased spacing for better visibility
    const particles: Particle[] = [];

    for (let x = particleSpacing; x < width; x += particleSpacing) {
      for (
        let y = surface + particleSpacing;
        y < height;
        y += particleSpacing
      ) {
        particles.push(createParticle(x, y));
      }
    }

    particlesRef.current = particles;
    console.log(`Initialized ${particles.length} particles`); // Debug log
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`); // Debug log
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

    // Small delay to ensure canvas is properly mounted
    setTimeout(() => {
      resizeCanvas();
      animate();
    }, 100);

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
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
