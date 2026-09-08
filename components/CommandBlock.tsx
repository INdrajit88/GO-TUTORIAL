import type { ReactNode } from "react";

import { TerminalBlock } from "@/components/TerminalBlock";

/**
 * A command the reader is meant to type.
 *
 * Thin wrapper over `TerminalBlock` with `variant="command"` — it exists so MDX
 * reads as `<CommandBlock>` for runnable commands and `<TerminalBlock>` for
 * output, JSON, file trees and diagrams. That distinction is the point: the two
 * should never look alike on the page.
 */
export function CommandBlock({
  language = "bash",
  title,
  caption,
  className,
  children,
}: {
  language?: string;
  title?: string;
  caption?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <TerminalBlock
      language={language}
      title={title}
      caption={caption}
      variant="command"
      className={className}
    >
      {children}
    </TerminalBlock>
  );
}
