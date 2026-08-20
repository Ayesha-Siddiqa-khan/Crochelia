import { z } from "zod";

export const WEIGHT_CLASSES = [
  "lace",
  "fingering",
  "sport",
  "dk",
  "worsted",
  "bulky",
  "super-bulky",
] as const;

export const yarnStashSchema = z.object({
  name: z.string().trim().min(1, "Give this yarn a name").max(120),
  brand: z.string().trim().max(120).optional().or(z.literal("")),
  colorName: z.string().trim().min(1, "Colour name is required").max(80),
  colorSwatchHex: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6})$/, "Use a hex colour like #E85D8A")
    .optional()
    .or(z.literal("")),
  weightClass: z.enum(WEIGHT_CLASSES),
  fiber: z.string().trim().max(120).optional().or(z.literal("")),
  totalGrams: z.coerce.number().min(0).max(100_000),
  remainingGrams: z.coerce.number().min(0).max(100_000),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type YarnStashInput = z.infer<typeof yarnStashSchema>;
