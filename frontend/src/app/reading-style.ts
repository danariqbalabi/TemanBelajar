import type { CSSProperties } from "react";
import type { Preferences } from "@/lib/types";

/** Used by onboarding, settings preview, and the actual reading surface. */
export function readingStyle(preferences: Preferences): CSSProperties {
  return {
    fontFamily:
      preferences.font_family === "nunito"
        ? '"Nunito", sans-serif'
        : preferences.font_family === "system"
          ? "system-ui, sans-serif"
          : '"Plus Jakarta Sans", sans-serif',
    fontSize: preferences.font_size,
    lineHeight: preferences.line_height,
    letterSpacing: `${preferences.letter_spacing}em`,
    maxWidth: `${preferences.reading_width}ch`,
  };
}
