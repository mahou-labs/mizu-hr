import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

export function ThemeToggle({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button
      className={`transition-all duration-200 ${
        isCollapsed ? "h-8 w-8 p-0" : "h-8 w-full justify-start gap-3 px-3"
      } hover:bg-light`}
      onClick={toggleTheme}
      size={isCollapsed ? "icon" : "default"}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      variant="ghost"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-foreground-muted" />
      ) : (
        <Sun className="h-4 w-4 text-foreground-muted" />
      )}
      {!isCollapsed && (
        <span className="font-medium text-foreground text-sm">
          {theme === "light" ? "Dark mode" : "Light mode"}
        </span>
      )}
    </Button>
  );
}
