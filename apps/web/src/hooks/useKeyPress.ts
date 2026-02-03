import { useEffect, useRef } from "react";

type UseKeyPressOptions = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  ignoreInputFields?: boolean;
  mod?: boolean;
  shift?: boolean;
  alt?: boolean;
};

export function useKeyPress(
  key: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {},
) {
  const {
    preventDefault = false,
    stopPropagation = false,
    ignoreInputFields = true,
    mod = false,
    shift = false,
    alt = false,
  } = options;

  const callbackRef = useRef(callback);
  const keysRef = useRef<Set<string>>(new Set());

  callbackRef.current = callback;

  useEffect(() => {
    const keys = Array.isArray(key) ? key : [key];
    keysRef.current = new Set(keys);
  }, [key]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (ignoreInputFields) {
        const target = event.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        const isContentEditable = target.contentEditable === "true";

        if (
          tagName === "input" ||
          tagName === "textarea" ||
          tagName === "select" ||
          isContentEditable
        ) {
          return;
        }
      }

      // Check modifier keys (mod = Ctrl or Cmd, cross-platform)
      const modPressed = event.ctrlKey || event.metaKey;
      if (mod && !modPressed) return;
      if (shift && !event.shiftKey) return;
      if (alt && !event.altKey) return;

      // If no modifiers required but one is pressed, skip
      if (!mod && !shift && !alt) {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
      }

      if (keysRef.current.has(event.key.toLowerCase())) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }

        callbackRef.current(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [preventDefault, stopPropagation, ignoreInputFields, mod, shift, alt]);
}
