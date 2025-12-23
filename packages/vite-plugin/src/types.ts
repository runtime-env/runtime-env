import { z } from "zod";

export const optionSchema = z.object({
  genJs: z
    .object({
      envFile: z
        .array(z.string())
        .optional()
        .default(() => []),
    })
    .optional(),
  interpolateIndexHtml: z
    .object({
      envFile: z
        .array(z.string())
        .optional()
        .default(() => []),
    })
    .optional(),
});

export type Options = z.input<typeof optionSchema>;
