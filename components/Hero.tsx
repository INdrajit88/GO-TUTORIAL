import { hero } from "@/content/tutorialData";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="bg-muted/50 border-b border-border">
      <div className="container-page py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-brand-fg m-0 flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.14em] uppercase">
            <span
              aria-hidden="true"
              className="bg-brand inline-block size-1.5 rounded-full"
            />
            {hero.label}
          </p>

          <h1 className="text-foreground mt-4 mb-0 text-balance text-[2rem] leading-[1.12] font-semibold tracking-[-0.03em] sm:text-[2.6rem] lg:text-[2.9rem]">
            {hero.title}
          </h1>

          <p className="text-muted-foreground mt-4 mb-0 max-w-2xl text-pretty text-[1.05rem] leading-relaxed sm:text-[1.14rem]">
            {hero.subtitle}
          </p>

          <ul
            role="list"
            aria-label="Technologies used in this tutorial"
            className="m-0 mt-7 flex list-none flex-wrap gap-2 p-0"
          >
            {hero.tags.map((tag) => (
              <li key={tag}>
                <Badge
                  variant="outline"
                  className="border-border bg-card text-muted-foreground rounded-md border px-2.5 py-1 font-mono text-[0.74rem] font-normal"
                >
                  {tag}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
