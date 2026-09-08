import type { ReactNode } from "react";
import { Heading } from "@/components/Heading";
import { stepId } from "@/lib/slug";

/**
 * A numbered tutorial section. The `id` lives on the `<h2>` so the table of
 * contents can link to it and `scroll-margin-top` can clear the sticky header.
 *
 * Content is wrapped in `.prose` — when using this from MDX, leave a blank line
 * after the opening tag so the body is parsed as markdown rather than JSX text.
 */
export function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children?: ReactNode;
}) {
  const id = stepId(number, title);

  return (
    <section aria-labelledby={id} className="mt-16 sm:mt-20">
      <div className="mb-6 flex items-start gap-3.5">
        <span
          aria-hidden="true"
          className="bg-brand-soft text-brand-fg mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-transparent font-mono text-[0.8rem] font-semibold tabular-nums"
        >
          {number}
        </span>

        <Heading level={2} id={id} className="flex-1 pt-1">
          <span className="sr-only">Step {number}: </span>
          {title}
        </Heading>
      </div>

      <div className="prose">{children}</div>
    </section>
  );
}
