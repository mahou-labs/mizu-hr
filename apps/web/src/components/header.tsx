import { Link } from "@tanstack/react-router";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/todos", label: "Todos" },
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <nav className="flex gap-6 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link 
                key={to} 
                to={to}
                className="text-card-foreground hover:text-primary transition-colors"
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2" />
      </div>
    </div>
  );
}
