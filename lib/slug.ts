import { isValidElement, type ReactNode } from "react";

/**
 * Converts heading text into a URL-safe anchor slug.
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

/** Formats a step number and title into a slugified anchor id. */
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
