import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  UndoRedo,
  BlockTypeSelect,
  ListsToggle,
  Separator,
  linkPlugin,
  linkDialogPlugin,
  CreateLink,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import { useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

type JobDescriptionEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function JobDescriptionEditor({
  value,
  onChange,
  disabled = false,
    placeholder = "Write a compelling job description...",
}: JobDescriptionEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  // Sync external value changes to editor
  useEffect(() => {
    if (editorRef.current) {
      const currentMarkdown = editorRef.current.getMarkdown();
      if (currentMarkdown !== value) {
        editorRef.current.setMarkdown(value);
      }
    }
  }, [value]);

  return (
    <div
      className={cn(
        "mdx-editor-wrapper w-full min-h-100 relative overflow-hidden rounded-lg border border-input bg-background bg-clip-padding text-base/5 shadow-xs ring-ring/24 transition-shadow",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)]",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:shadow-none focus-within:before:shadow-none",
        "dark:bg-input/32 dark:before:shadow-[0_-1px_--theme(--color-white/8%)]",
        disabled && "pointer-events-none opacity-64 shadow-none before:shadow-none",
      )}
    >
      <MDXEditor
        ref={editorRef}
        className="mdx-editor-themed"
        markdown={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={disabled}
        contentEditableClassName={cn(
          "min-h-[200px] max-w-none px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] focus:outline-none",
          "placeholder:text-muted-foreground/72",
          "prose prose-zinc prose-sm dark:prose-invert",
          "[&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2",
          "[&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold",
          "[&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold",
          "[&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-semibold",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
          "[&_strong]:font-semibold",
          "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-4 [&_ol]:pl-4",
          "[&_li]:my-0.5",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
          "[&_hr]:my-4 [&_hr]:border-border",
        )}
        plugins={[
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarClassName: cn(
              "!flex !flex-wrap !items-center !gap-1 !border-b !border-input !bg-background !px-[calc(--spacing(3)-1px)] !py-[calc(--spacing(1.5)-1px)]",
              "!rounded-none dark:!bg-input/32",
              "dark:[&_button]:text-foreground dark:[&_button:hover]:bg-muted dark:[&_[data-state=on]]:bg-muted dark:[&_select]:text-foreground dark:[&_svg]:text-foreground",
            ),
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <ListsToggle />
                <Separator />
                <CreateLink />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
