import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { site } from "@/content/tutorialData";

export function SiteHeader() {
  return (
    <header
      id="top"
      className="bg-background/85 sticky top-0 z-50 border-b border-border backdrop-blur-md"
    >
      <div className="container-page flex h-(--header-h) items-center justify-between gap-3">
        <a
          href="#top"
          className="-ml-1 rounded-lg py-1 pl-1 pr-1 transition-opacity hover:opacity-85"
        >
          {/* Navy chip in both themes with official Keploy logo */}
          <span className="bg-nav-chip inline-flex items-center gap-2 rounded-lg py-1.5 pr-3 pl-2.5">
            <Image
              src="/keploy-logo.png"
              alt="Keploy Logo"
              width={22}
              height={22}
              priority
              className="size-[1.25rem] shrink-0 object-contain"
            />
            <span className="whitespace-nowrap text-[0.95rem] font-semibold tracking-[-0.015em]">
              <span className="text-nav-keploy">Keploy</span>{" "}
              <span className="font-normal text-white/40">×</span>{" "}
              <span className="text-nav-go">Go</span>
            </span>
          </span>
        </a>

        <div className="flex items-center gap-0.5">
          <nav aria-label="Main">
            <ul role="list" className="m-0 flex list-none items-center gap-0.5 p-0">
              {site.nav.map((item) => (
                <li key={item.label} className={item.hideOnMobile ? "hidden sm:block" : undefined}>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground px-2.5 text-[0.86rem] font-medium"
                  >
                    <a
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {item.label}
                      {item.external ? <ExternalLink className="size-3.5 opacity-70" /> : null}
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <Separator orientation="vertical" className="bg-border mx-1 h-5" />

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
