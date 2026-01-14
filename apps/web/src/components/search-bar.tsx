import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon, Search } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { Button } from "@mizu-hr/ui/button";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "@mizu-hr/ui/command";
import { Kbd, KbdGroup } from "@mizu-hr/ui/kbd";
import { cn } from "@/utils/cn";
import { useKeyPress } from "@/hooks/useKeyPress";

type Item = {
  value: string;
  label: string;
  shortcut?: string;
};

type Group = {
  value: string;
  items: Item[];
};

const suggestions: Item[] = [
  { label: "Linear", shortcut: "⌘L", value: "linear" },
  { label: "Figma", shortcut: "⌘F", value: "figma" },
  { label: "Slack", shortcut: "⌘S", value: "slack" },
  { label: "YouTube", shortcut: "⌘Y", value: "youtube" },
  { label: "Raycast", shortcut: "⌘R", value: "raycast" },
];

const commands: Item[] = [
  { label: "Clipboard History", shortcut: "⌘⇧C", value: "clipboard-history" },
  { label: "Import Extension", shortcut: "⌘I", value: "import-extension" },
  { label: "Create Snippet", shortcut: "⌘N", value: "create-snippet" },
  { label: "System Preferences", shortcut: "⌘,", value: "system-preferences" },
  { label: "Window Management", shortcut: "⌘⇧W", value: "window-management" },
];

const groupedItems: Group[] = [
  { items: suggestions, value: "Suggestions" },
  { items: commands, value: "Commands" },
];

function useModifierKey() {
  return useMemo(() => {
    if (typeof navigator === "undefined") return "⌘";
    return navigator.platform.toLowerCase().includes("mac") ? "⌘" : "Ctrl";
  }, []);
}

type SearchBarProps = {
  isCollapsed?: boolean;
};

export function SearchBar({ isCollapsed = false }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const modifierKey = useModifierKey();
  useKeyPress("k", (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  });

  function handleItemClick(_item: Item) {
    setOpen(false);
  }

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandDialogTrigger
        render={
          <Button
            variant="ghost"
            className="mb-2 justify-start border border-border px-2 max-h-4 aspect-square py-0 hover:bg-transparent text-muted-foreground"
          />
        }
      >
        <Search className="size-4 shrink-0" />
        <div
          className={cn(
            "flex flex-1 items-center justify-between transition-opacity duration-200",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
          )}
        >
          <span>Search...</span>
          <KbdGroup>
            <Kbd>{modifierKey}</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>
      </CommandDialogTrigger>
      <CommandDialogPopup>
        <Command items={groupedItems}>
          <CommandInput placeholder="Search for apps and commands..." />
          <CommandPanel>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList>
              {(group: Group, _index: number) => (
                <Fragment key={group.value}>
                  <CommandGroup items={group.items}>
                    <CommandGroupLabel>{group.value}</CommandGroupLabel>
                    <CommandCollection>
                      {(item: Item) => (
                        <CommandItem
                          key={item.value}
                          onClick={() => handleItemClick(item)}
                          value={item.value}
                        >
                          <span className="flex-1">{item.label}</span>
                          {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                        </CommandItem>
                      )}
                    </CommandCollection>
                  </CommandGroup>
                  <CommandSeparator />
                </Fragment>
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>
                    <ArrowUpIcon />
                  </Kbd>
                  <Kbd>
                    <ArrowDownIcon />
                  </Kbd>
                </KbdGroup>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <Kbd>
                  <CornerDownLeftIcon />
                </Kbd>
                <span>Open</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Kbd>Esc</Kbd>
              <span>Close</span>
            </div>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
