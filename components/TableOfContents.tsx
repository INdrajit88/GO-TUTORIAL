"use client";

import { useEffect, useRef, useState } from "react";
import type { ContentsEntry } from "@/content/tutorialData";

const HEADER_OFFSET = 128;

/**
 * Two presentations of the same list:
 *  - `sidebar` — sticky rail on lg+, with scroll-spy highlighting.
 *  - `inline`  — a collapsed <details> block on small screens, where a sticky
 *                rail would just push the tutorial off the fold.
 */
export function TableOfContents({
  items,
  variant = "sidebar",
}: {
  items: ContentsEntry[];
  variant?: "sidebar" | "inline";
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (variant !== "sidebar") return;

    let frame = 0;

    const update = () => {
      frame = 0;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= HEADER_OFFSET) {
          current = item.id;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items, variant]);

  const links = (
    <ul role="list" className="m-0 list-none p-0">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="toc-link"
            data-active={variant === "sidebar" && active === item.id}
            aria-current={variant === "sidebar" && active === item.id ? "location" : undefined}
            onClick={() => details.current?.removeAttribute("open")}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === "inline") {
    return (
      <details
        ref={details}
        className="mb-8 rounded-xl border border-border bg-muted px-4 py-3 lg:hidden"
      >
        <summary className="flex cursor-pointer select-none items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="toc-chevron h-3.5 w-3.5"
          >
            <path d="m9 5 7 7-7 7" />
          </svg>
          On this page
        </summary>
        <div className="mt-3 border-t border-border pt-3">{links}</div>
      </details>
    );
  }

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-[calc(var(--header-h)+2rem)] hidden max-h-[calc(100vh-var(--header-h)-4rem)] overflow-y-auto lg:block"
    >
      <p className="mb-3 pl-[0.9rem] text-[0.72rem] font-semibold uppercase tracking-[0.11em] text-faint">
        On this page
      </p>
      {links}
    </nav>
  );
}
