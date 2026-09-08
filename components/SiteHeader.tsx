import Image from "next/image";
import Link from "next/link";
import { ExternalLink, BookOpen } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function GithubIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header
      id="top"
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors"
    >
      <div className="container-page flex h-(--header-h) items-center justify-between gap-4">
        {/* Brand: Keploy × Go */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="relative flex size-8 items-center justify-center rounded-lg bg-orange-500/10 p-1 ring-1 ring-orange-500/25 transition-transform group-hover:scale-105">
            <Image
              src="/keploy-logo.png"
              alt="Keploy Logo"
              width={26}
              height={26}
              priority
              className="size-6 object-contain"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 text-[1.05rem] font-bold tracking-tight text-foreground">
              <span className="text-[#f97316] dark:text-orange-400">Keploy</span>
              <span className="font-mono text-xs text-muted-foreground/50">×</span>
              <span>Go</span>
            </span>
            <span className="hidden rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-orange-600 dark:text-orange-400 sm:inline-block">
              Guide
            </span>
          </div>
        </Link>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Quick Links" className="flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <a
                href="https://keploy.io/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <BookOpen className="size-3.5 opacity-70" />
                <span className="hidden sm:inline">Docs</span>
                <ExternalLink className="size-3 opacity-50" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-border bg-card px-2.5 text-xs font-medium text-foreground hover:bg-accent"
            >
              <a
                href="https://github.com/INdrajit88/GO-TUTORIAL"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="size-3.5" />
                <span>GitHub</span>
              </a>
            </Button>
          </nav>

          <Separator orientation="vertical" className="h-4 bg-border" />

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
