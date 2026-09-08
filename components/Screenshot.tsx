import { existsSync } from "node:fs";
import { join } from "node:path";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Image figure component with caption and missing asset fallback.
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
  className?: string;
}) {
  const usable = typeof src === "string" && src.length > 0;
  const available = usable && existsSync(join(process.cwd(), "public", src));

  return (
    <figure className={cn("my-8", className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-[#0e0e0e] shadow-xs">
        {available ? (
          // eslint-disable-next-line @next/next/no-img-element
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
              {usable ? "Image not found" : "Missing image source"}
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
