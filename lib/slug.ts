import { isValidElement, type ReactNode } from "react";

/**
 * Heading text -> URL-safe fragment.
 *
 * Used by three places that must agree exactly: the markdown heading renderer
 * in `mdx-components.tsx`, the `Step` component, and the table of contents in
 * `content/tutorialData.ts`. Keep this pure and dependency-free.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** `Step` renders `<h2 id={stepId(1, "Get the Go application")}>`. */
export function stepId(number: number, title: string): string {
  return slugify(`${number}. ${title}`);
}

/** Flattens React children down to the plain text a heading renders as. */
export function childrenToText(children: ReactNode): string {
  if (children === null || children === undefined || typeof children === "boolean") {
    return "";
  }
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(childrenToText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return childrenToText(children.props.children);
  }
  return "";
}
