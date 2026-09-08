import { Fragment, type ReactNode } from "react";

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`)/g;

/**
 * Renders a plain string from `tutorialData` with two bits of inline
 * formatting: `**bold**` and `` `code` ``.
 *
 * Output is built from React text nodes only — nothing here ever goes through
 * `dangerouslySetInnerHTML`, so data strings can't inject markup.
 */
export function RichText({ text }: { text: string }): ReactNode {
  return (
    <>
      {text.split(INLINE).map((part, index) => {
        if (!part) return null;

        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }

        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return <code key={index}>{part.slice(1, -1)}</code>;
        }

        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
