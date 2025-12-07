import { useTheme, type UserTheme } from "@/utils/theme-provider";
import { Button } from "@mizu-hr/ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@mizu-hr/ui/menu";
import { Check, Laptop, Moon, Sun } from "lucide-react";
import type React from "react";

const themeConfig: Record<
  UserTheme,
  { icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  system: { icon: Laptop, label: "System" },
};

export const ThemeToggle = () => {
  const { userTheme, setTheme } = useTheme();
  const CurrentIcon = themeConfig[userTheme].icon;

  return (
    <Menu>
      <MenuTrigger>
        <Button variant="outline" size="sm" className="gap-2">
          <CurrentIcon className="size-4" />
          <span className="hidden sm:inline">
            {themeConfig[userTheme].label}
          </span>
        </Button>
      </MenuTrigger>
      <MenuPopup>
        {(Object.keys(themeConfig) as UserTheme[]).map((theme) => {
          const Icon = themeConfig[theme].icon;
          const isActive = userTheme === theme;

          return (
            <MenuItem key={theme} onClick={() => setTheme(theme)}>
              <Icon className="size-4" />
              <span className="flex-1">{themeConfig[theme].label}</span>
              {isActive && <Check className="size-4" />}
            </MenuItem>
          );
        })}
      </MenuPopup>
    </Menu>
  );
};
