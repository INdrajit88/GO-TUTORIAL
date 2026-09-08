import type { ReactNode } from "react";
import { childrenToText, slugify } from "@/lib/slug";

type Level = 1 | 2 | 3 | 4;

const SIZE: Record<Level, string> = {
  1: "text-[2rem] sm:text-[2.4rem]",
  2: "text-[1.5rem] sm:text-[1.65rem]",
  3: "text-[1.14rem]",
  4: "text-[1.02rem]",
};

/**
 * Shared heading for both markdown `##` (mapped in `mdx-components.tsx`) and
 * `Step` titles, so an `id` is generated the same way everywhere and the
 * table of contents can rely on it.
 */
export function Heading({
  level = 2,
  id,
  children,
  className = "",
}: {
  level?: Level;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  const text = childrenToText(children).trim();
  const anchor = id ?? slugify(text);
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";

  return (
    <Tag
      id={anchor}
      className={`group scroll-mt-[calc(var(--header-h)_+_1.25rem)] font-semibold tracking-[-0.021em] leading-snug text-balance ${SIZE[level]} ${className}`.trim()}
    >
      {children}
      <a
        href={`#${anchor}`}
        aria-label={`Link to this section: ${text}`}
        className="ml-2 align-middle text-[0.8em] font-normal text-faint opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 hover:text-brand-hover"
      >
        <span aria-hidden="true">#</span>
      </a>
    </Tag>
  );
}
