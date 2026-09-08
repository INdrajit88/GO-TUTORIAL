import { sample, site } from "@/content/tutorialData";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-page flex flex-col gap-3 py-10 text-[0.85rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0">
          {site.brand} — a hands-on walkthrough of the{" "}
          <code className="font-mono text-[0.8rem] text-foreground">{sample.directory}</code> sample.
        </p>

        <a
          href={sample.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md text-brand-fg underline decoration-brand/35 underline-offset-4 transition-colors duration-150 hover:decoration-current"
        >
          Sample source on GitHub
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-3.5 w-3.5"
          >
            <path d="M14 4h6v6" />
            <path d="m20 4-8.5 8.5" />
            <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
