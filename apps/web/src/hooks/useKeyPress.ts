/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: input fields */
import { useEffect, useRef } from "react";

type UseKeyPressOptions = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  ignoreInputFields?: boolean;
};

export function useKeyPress(
  key: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {}
) {
  const {
    preventDefault = false,
    stopPropagation = false,
    ignoreInputFields = true,
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

      if (keysRef.current.has(event.key)) {
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
  }, [preventDefault, stopPropagation, ignoreInputFields]);
}
