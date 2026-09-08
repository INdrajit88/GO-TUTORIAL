"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export function TutorialProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setProgress(Math.min(Math.max(currentProgress, 0), 100));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Tutorial reading progress"
      className="sticky top-(--header-h) z-30 mb-8 flex items-center justify-between gap-4 rounded-xl border border-border bg-card/90 px-4 py-2.5 text-xs font-mono shadow-xs backdrop-blur-md"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Zap className="size-3.5 text-brand" />
        <span className="font-semibold text-foreground">Hands-on Guide:</span>
        <span className="hidden sm:inline">Echo + PostgreSQL + Keploy</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted sm:w-44">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FAD961] to-[#F76B1C] transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="min-w-[36px] text-right text-[11px] font-medium text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

export default TutorialProgressBar;
