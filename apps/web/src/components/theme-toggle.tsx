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
    // Get initial theme from HTML class
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Update HTML class
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Store preference in localStorage
    localStorage.setItem("theme", newTheme);
  };

  // Initialize theme from localStorage or system preference on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme = stored || (systemPrefersDark ? "dark" : "light");

    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <Button
      className={`transition-all duration-200 ${
        isCollapsed ? "h-8 w-8 p-0" : "h-8 w-full justify-start gap-3 px-3"
      } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
      onClick={toggleTheme}
      size={isCollapsed ? "icon" : "default"}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      variant="ghost"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      {!isCollapsed && (
        <span className="font-medium text-sm">
          {theme === "light" ? "Dark mode" : "Light mode"}
        </span>
      )}
    </Button>
  );
}
