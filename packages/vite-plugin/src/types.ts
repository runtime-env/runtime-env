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
  genTs: z
    .object({
      outputFile: z.string().optional().default("src/runtime-env.d.ts"),
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
