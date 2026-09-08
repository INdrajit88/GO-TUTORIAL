"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Stable reference — `useSyncExternalStore` requires one. */
const neverSubscribe = () => () => {};

/**
 * True only after hydration.
 *
 * `useSyncExternalStore` rather than the usual `useState` + `useEffect` flip:
 * it is the documented way to branch on server-vs-client, it never notifies (so
 * the value settles once and stays put), and it doesn't set state in an effect.
 */
function useMounted() {
  return useSyncExternalStore(
    neverSubscribe,
    () => true,
    () => false
  );
}

/**
 * Light/dark toggle.
 *
 * The two icons are always in the DOM and swapped by the `dark:` variant rather
 * than by JS state, so the correct one paints immediately from the class
 * next-themes sets pre-hydration — no icon flash.
 *
 * The accessible label is gated on `mounted`. next-themes resolves
 * `resolvedTheme` on the client's first render, not after an effect, so deriving
 * the label from it directly makes the server render "Switch to dark theme"
 * while the client renders "Switch to light theme" — a hydration attribute
 * mismatch React reports against the tooltip trigger. Both sides now render
 * "Toggle theme" first, and the specific label lands after hydration.
 */
export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = resolvedTheme === "dark";
  const label = mounted
    ? isDark
      ? "Switch to light theme"
      : "Switch to dark theme"
    : "Toggle theme";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="text-muted-foreground hover:bg-accent hover:text-foreground relative size-9"
        >
          <SunIcon className="dark:scale-0 dark:-rotate-90 size-[1.15rem] scale-100 rotate-0 transition-all duration-200" />
          <MoonIcon className="dark:scale-100 dark:rotate-0 absolute size-[1.15rem] scale-0 rotate-90 transition-all duration-200" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
