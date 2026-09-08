"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * next-themes drives `.dark` on <html>.
 *
 * `defaultTheme="system"` means a first-time visitor gets their OS preference;
 * once they use the toggle, next-themes persists the choice to localStorage and
 * it wins on every later visit. Its injected blocking script applies the class
 * before first paint, so there is no flash of the wrong theme.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
