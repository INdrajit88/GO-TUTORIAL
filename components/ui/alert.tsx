import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
        /* Semantic variants below read their colors from tokens defined in
           globals.css, so each one has a measured light and dark value. */
        info: "border-[color-mix(in_oklab,var(--info)_32%,var(--border))] bg-[var(--info-soft)] text-[var(--info-fg)] [&>svg]:text-[var(--info)]",
        tip: "border-[color-mix(in_oklab,var(--tip)_32%,var(--border))] bg-[var(--tip-soft)] text-[var(--tip-fg)] [&>svg]:text-[var(--tip)]",
        warning:
          "border-[color-mix(in_oklab,var(--warning)_34%,var(--border))] bg-[var(--warning-soft)] text-[var(--warning-fg)] [&>svg]:text-[var(--warning)]",
        success:
          "border-[color-mix(in_oklab,var(--success)_32%,var(--border))] bg-[var(--success-soft)] text-[var(--success-fg)] [&>svg]:text-[var(--success)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
