import type { ReactNode } from "react";
import { codeToHtml } from "shiki";

import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/utils";

const LANG_ALIAS: Record<string, string> = {
  sh: "bash",
  shell: "bash",
  console: "bash",
  terminal: "bash",
  zsh: "bash",
  plain: "text",
  plaintext: "text",
  txt: "text",
  none: "text",
  yml: "yaml",
};

/** Both themes are emitted at build time; CSS picks one per active theme. */
const THEMES = { light: "github-light", dark: "github-dark" } as const;

/** Children may arrive as a string, or as an array of strings and newlines. */
function toCode(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(toCode).join("");
  return "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Identifies 1-based line numbers where new shell commands start,
 * skipping indentation, line continuations, and multi-line quoted strings.
 */
function commandLines(code: string): Set<number> {
  const prompts = new Set<number>();
  let inSingle = false;
  let inDouble = false;
  let continued = false;

  code.split("\n").forEach((line, index) => {
    if (!/^\s/.test(line) && !inSingle && !inDouble && !continued) {
      prompts.add(index + 1);
    }

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === "\\" && !inSingle) {
        i++;
        continue;
      }
      if (char === "'" && !inDouble) inSingle = !inSingle;
      else if (char === '"' && !inSingle) inDouble = !inDouble;
    }

    continued = /\\\s*$/.test(line) || inSingle || inDouble;
  });

  return prompts;
}

/**
 * A code panel: language label, copy button, horizontal scroll on narrow
 * screens instead of wrapped commands, and dual-theme highlighting so it reads
 * correctly in both light and dark mode.
 *
 * `variant="command"` marks a block as something the reader types — it gets a
 * `$` badge in the header and a prompt gutter on command lines. Output, JSON,
 * file trees and diagrams stay unadorned, so the two never look alike.
 *
 * Highlighting runs at build time, so no syntax theme ships to the browser. If
 * shiki doesn't know the language the block still renders as escaped plain text
 * rather than failing the page.
 */
export async function TerminalBlock({
  language = "bash",
  title,
  caption,
  variant = "output",
  className,
  children,
}: {
  language?: string;
  title?: string;
  caption?: string;
  variant?: "command" | "output";
  className?: string;
  children?: ReactNode;
}) {
  const code = toCode(children).replace(/^\n+/, "").replace(/\s+$/, "");
  const lang = LANG_ALIAS[language] ?? language;
  const isCommand = variant === "command";
  const prompts = isCommand ? commandLines(code) : new Set<number>();

  let highlighted: string | null = null;
  try {
    highlighted = await codeToHtml(code, {
      lang,
      themes: THEMES,
      defaultColor: false,
      transformers: [
        {
          name: "command-prompt",
          line(node, line) {
            if (prompts.has(line)) {
              node.properties.class =
                `${String(node.properties.class ?? "")} with-prompt`.trim();
            }
          },
        },
      ],
    });
  } catch {
    highlighted = null;
  }

  return (
    <figure className={cn("my-6", className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/70 px-2 py-1.5 sm:px-3">
          <span className="flex min-w-0 items-center gap-2">
            {isCommand ? (
              <span
                aria-hidden="true"
                className="grid size-[1.15rem] shrink-0 place-items-center rounded border border-border bg-background font-mono text-[0.7rem] leading-none text-brand-fg"
              >
                $
              </span>
            ) : null}
            <span className="truncate font-mono text-[0.7rem] tracking-[0.06em] text-muted-foreground">
              {title ?? (isCommand ? "shell" : lang)}
            </span>
          </span>

          <CopyButton text={code} />
        </div>

        <div className="code-scroll py-3">
          {highlighted ? (
            <div dangerouslySetInnerHTML={{ __html: highlighted }} />
          ) : (
            <pre>
              <code
                dangerouslySetInnerHTML={{
                  __html: escapeHtml(code)
                    .split("\n")
                    .map(
                      (line, index) =>
                        `<span class="line${prompts.has(index + 1) ? " with-prompt" : ""}">${line || " "}</span>`
                    )
                    .join("\n"),
                }}
              />
            </pre>
          )}
        </div>
      </div>

      {caption ? (
        <figcaption className="mt-2.5 text-[0.85rem] leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
