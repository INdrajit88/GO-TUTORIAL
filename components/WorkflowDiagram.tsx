import { workflow } from "@/content/tutorialData";

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5 text-line-strong"
    >
      <path d="M12 3.5v15" />
      <path d="m6.5 13.5 5.5 5.5 5.5-5.5" />
    </svg>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ml-auto h-4 w-4 shrink-0 text-[var(--node)]"
    >
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  );
}

/**
 * The record → replay loop as an ordered list of labelled nodes.
 *
 * Rendered as a real `<ol>` so the sequence is readable by a screen reader and
 * selectable as text; the arrows are decorative. This is a conceptual ordering
 * of what the tutorial does, not a diagram of Keploy internals.
 */
export function WorkflowDiagram() {
  const lastIndex = workflow.length - 1;

  return (
    <figure className="my-8 rounded-2xl border border-border bg-muted p-5 sm:p-7">
      <figcaption className="mb-6 text-[0.72rem] font-semibold uppercase tracking-[0.11em] text-faint">
        Conceptual workflow
      </figcaption>

      <ol
        role="list"
        className="m-0 mx-auto flex max-w-md list-none flex-col items-stretch p-0"
      >
        {workflow.map((node, index) => {
          const isFinal = index === lastIndex;
          const emphasis = node.label === "Keploy observes interaction" ? " node-brand" : "";
          const tone = isFinal ? "node-final" : `node-plain${emphasis}`;

          return (
            <li key={node.label} className="flex flex-col items-center">
              <div className={`node ${tone} flex w-full items-center gap-3 rounded-xl border px-4 py-3`}>
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-border bg-muted font-mono text-[0.68rem] font-semibold text-muted-foreground tabular-nums"
                >
                  {index + 1}
                </span>

                <span className="min-w-0">
                  <span className="block text-[0.93rem] font-semibold tracking-[-0.01em] text-foreground">
                    {node.label}
                  </span>
                  <span className="block font-mono text-[0.73rem] leading-relaxed text-muted-foreground">
                    {node.detail}
                  </span>
                </span>

                {isFinal ? <Check /> : null}
              </div>

              {index < lastIndex ? (
                <span className="py-1.5" aria-hidden="true">
                  <Arrow />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="m-0 mt-6 text-center text-[0.8rem] leading-relaxed text-faint">
        Conceptual only — this is the order things happen in, not Keploy&rsquo;s internal
        architecture.
      </p>
    </figure>
  );
}
