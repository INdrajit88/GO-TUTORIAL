import { isValidElement, type AnchorHTMLAttributes, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/Callout";
import { CommandBlock } from "@/components/CommandBlock";
import { Heading } from "@/components/Heading";
import { Screenshot } from "@/components/Screenshot";
import { Step } from "@/components/Step";
import { TerminalBlock } from "@/components/TerminalBlock";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { childrenToText } from "@/lib/slug";

/**
 * MDX emits `<pre><code class="language-bash">…</code></pre>` for a fenced
 * block. Pull the language and the raw text back out so every fence in the
 * tutorial gets the same panel treatment as an explicit `<TerminalBlock>`.
 */
function readCodeElement(children: ReactNode): { language: string; code: string } | null {
  for (const child of Array.isArray(children) ? children : [children]) {
    if (!isValidElement(child)) continue;

    const props = child.props as { className?: string; children?: ReactNode };
    const code = childrenToText(props.children);
    if (!code.trim()) continue;

    const language = /language-(\S+)/.exec(props.className ?? "")?.[1] ?? "text";
    return { language, code };
  }

  return null;
}

/** Fence languages meaning "something the reader types", so a plain ```bash
 *  block gets the command treatment ($ badge + prompt gutter) automatically. */
const COMMAND_LANGS = new Set(["bash", "sh", "shell", "console", "zsh", "terminal"]);

function MarkdownPre({ children }: { children?: ReactNode }) {
  const parsed = readCodeElement(children);

  if (!parsed) {
    return (
      <pre className="code-scroll my-6 rounded-xl border border-border bg-muted p-4">
        {children}
      </pre>
    );
  }

  return (
    <TerminalBlock
      language={parsed.language}
      variant={COMMAND_LANGS.has(parsed.language) ? "command" : "output"}
    >
      {parsed.code}
    </TerminalBlock>
  );
}

function MarkdownLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = typeof href === "string" && /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    h1: ({ children }) => <Heading level={1}>{children}</Heading>,
    h2: ({ children }) => <Heading level={2}>{children}</Heading>,
    h3: ({ children }) => <Heading level={3}>{children}</Heading>,
    h4: ({ children }) => <Heading level={4}>{children}</Heading>,

    pre: MarkdownPre,
    a: MarkdownLink,
    img: ({ src, alt }) => (
      <Screenshot src={String(src ?? "")} alt={alt ?? ""} />
    ),

    // Also registered globally so MDX can use them without an import statement.
    // `app/page.mdx` imports them explicitly anyway, which keeps prop types checked.
    Callout,
    CommandBlock,
    Heading,
    Step,
    Screenshot,
    TerminalBlock,
    WorkflowDiagram,
  };
}
