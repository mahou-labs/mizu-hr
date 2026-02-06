import { createContext, useContext, useState, type ReactNode } from "react";
import { useKeyPress } from "@/hooks/use-key-press";

type SidebarContextValue = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  useKeyPress("b", () => setIsCollapsed((prev) => !prev), { mod: true, preventDefault: true });

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
