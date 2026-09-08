import { existsSync } from "node:fs";
import { join } from "node:path";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A figure: image, border, and caption.
 *
 * Deliberately uses a plain `<img>` rather than `next/image`: the files are
 * added by hand after the fact, and `next/image` would fail the build or render
 * a broken frame for a path that isn't on disk yet. The existence check runs at
 * render time, so a missing figure degrades to a labelled placeholder and the
 * page still builds and reads correctly.
 *
 * `width`/`height` are the intrinsic pixel sizes and are not optional in
 * practice — they let the browser reserve the right aspect ratio before the
 * bytes arrive. Without them each image shifts the page as it loads.
 */
export function Screenshot({
  src,
  alt,
  caption,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /** For tall figures, e.g. `mx-auto max-w-sm`, so they don't own the column. */
  className?: string;
}) {
  // Guarded, not just `existsSync(join(...))`: a typo'd key in
  // `tutorialData.screenshots` makes `src` undefined, and `path.join` throws
  // ERR_INVALID_ARG_TYPE — which 500s the whole page rather than degrading one
  // figure. The entire point of this component is to fail soft.
  const usable = typeof src === "string" && src.length > 0;
  const available = usable && existsSync(join(process.cwd(), "public", src));

  return (
    <figure className={cn("my-8", className)}>
      <div className="bg-muted overflow-hidden rounded-xl border border-border">
        {available ? (
          // eslint-disable-next-line @next/next/no-img-element -- see the note above; next/image can't tolerate absent files.
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center"
            style={{
              aspectRatio: width && height ? `${width} / ${height}` : undefined,
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 9px, color-mix(in oklab, var(--border) 55%, transparent) 9px, color-mix(in oklab, var(--border) 55%, transparent) 10px)",
            }}
          >
            <ImageIcon className="text-faint size-6" aria-hidden="true" strokeWidth={1.5} />
            <p className="text-muted-foreground m-0 text-[0.85rem] font-medium">
              {usable ? "Figure not found on disk" : "Figure has no src — check tutorialData.screenshots"}
            </p>
            <p className="text-faint m-0 font-mono text-[0.72rem] break-all">
              {usable ? src : String(src)}
            </p>
          </div>
        )}
      </div>

      {caption ? (
        <figcaption className="text-muted-foreground mt-2.5 text-[0.85rem] leading-relaxed">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
