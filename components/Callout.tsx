import type { ReactNode } from "react";
import { CircleCheckBig, Info, Lightbulb, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RichText } from "@/components/RichText";
import { cn } from "@/lib/utils";

export type CalloutType = "info" | "tip" | "warning" | "success";

/**
 * A visible word for the kind of note this is. The label plus a distinct icon
 * is what keeps the meaning intact for readers who can't distinguish the accent
 * colors — the type is never carried by color alone.
 */
const LABEL: Record<CalloutType, string> = {
  info: "Info",
  tip: "Tip",
  warning: "Warning",
  success: "Good to know",
};

const ICON: Record<CalloutType, typeof Info> = {
  info: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  success: CircleCheckBig,
};

/**
 * Built on shadcn's Alert. The tinted surface, border and title color come from
 * the semantic Alert variants, which read tokens with measured light and dark
 * values from globals.css.
 *
 * `role="note"` rather than Alert's default `role="alert"`: these are
 * supplementary asides in a document, not time-critical announcements, and
 * `alert` carries an assertive live-region semantic.
 */
export function Callout({
  type = "info",
  title,
  className,
  children,
}: {
  type?: CalloutType;
  title?: string;
  className?: string;
  children?: ReactNode;
}) {
  const Icon = ICON[type];

  return (
    <Alert variant={type} role="note" className={cn("callout my-7", className)}>
      <Icon />

      <AlertTitle className="line-clamp-none flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.09em] opacity-75">
          {LABEL[type]}
        </span>
        {title ? (
          <span className="text-[0.95rem] font-semibold normal-case tracking-[-0.01em]">
            <RichText text={title} />
          </span>
        ) : null}
      </AlertTitle>

      {children ? (
        <AlertDescription className="callout-body">
          <div className="text-[0.95rem] leading-[1.7]">{children}</div>
        </AlertDescription>
      ) : null}
    </Alert>
  );
}
