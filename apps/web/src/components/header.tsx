import { SignedIn, SignedOut } from "@daveyplate/better-auth-ui";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/todos", label: "Todos" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} to={to}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <SignedIn>
            <Link to="/dashboard">Go to Dashboard</Link>
          </SignedIn>

          <SignedOut>
            <Link to="/login">Sign In</Link>
          </SignedOut>
        </div>
      </div>
      <hr />
    </div>
  );
}
