import { Button } from "@mizu-hr/ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@mizu-hr/ui/menu";
import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "better-themes";
import { useHydrated } from "@tanstack/react-router";

type ThemeOption = "light" | "dark" | "system";

const themeConfig: Record<ThemeOption, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  system: { icon: Laptop, label: "System" },
};

const themeOptions: ThemeOption[] = ["light", "dark", "system"];

function isValidTheme(theme: string | undefined): theme is ThemeOption {
  return theme !== undefined && theme in themeConfig;
}

export const ThemeToggle = () => {
  const hydrated = useHydrated();
  const { theme, setTheme } = useTheme();

  if (!isValidTheme(theme)) return null;
  const CurrentIcon = themeConfig[theme].icon;

  return (
    <Menu disabled={!hydrated}>
      <MenuTrigger>
        <Button variant="outline" size="sm" className="gap-2">
          <CurrentIcon className="size-4" />
          <span className="hidden sm:inline">{themeConfig[theme].label}</span>
        </Button>
      </MenuTrigger>
      <MenuPopup>
        {themeOptions.map((themeOption) => {
          const Icon = themeConfig[themeOption].icon;
          const isActive = themeOption === theme;

          return (
            <MenuItem key={themeOption} onClick={() => setTheme(themeOption)}>
              <Icon className="size-4" />
              <span className="flex-1">{themeConfig[themeOption].label}</span>
              {isActive && <Check className="size-4" />}
            </MenuItem>
          );
        })}
      </MenuPopup>
    </Menu>
  );
};
