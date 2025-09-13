import { Link } from "@tanstack/react-router";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/todos", label: "Todos" },
  ];

  return (
    <div className="border-border border-b bg-card">
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <nav className="flex gap-6 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link
                className="text-card-foreground transition-colors hover:text-primary"
                key={to}
                to={to}
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
