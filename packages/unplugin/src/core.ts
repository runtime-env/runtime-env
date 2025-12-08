import type { Bundler } from "./types";
import { ERROR_MESSAGES } from "./constants";

/**
 * List of bundlers that support HTML interpolation.
 * To add support for a new bundler, add its name here and implement
 * the corresponding bundler-specific hook.
 */
export const BUNDLERS_WITH_HTML_SUPPORT: Bundler[] = [
  "vite",
  "webpack",
  "rspack",
];

/**
 * Validates that the bundler supports HTML interpolation when the interpolate option is provided.
 * Throws an error if interpolation is requested for an unsupported bundler.
 *
 * @param bundler - The detected bundler name
 * @param hasInterpolate - Whether the interpolate option is provided
 * @throws Error if interpolation is not supported for the detected bundler
 */
export function validateInterpolateSupport(
  bundler: Bundler,
  hasInterpolate: boolean,
): void {
  if (hasInterpolate && !BUNDLERS_WITH_HTML_SUPPORT.includes(bundler)) {
    const supported = BUNDLERS_WITH_HTML_SUPPORT.join(", ");
    throw new Error(
      ERROR_MESSAGES.HTML_INTERPOLATION_NOT_SUPPORTED(bundler, supported),
    );
  }
}


