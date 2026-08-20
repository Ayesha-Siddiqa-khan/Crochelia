import { z } from "zod";

export const PROJECT_TYPES = [
  "cardigan",
  "sweater",
  "blanket",
  "bag",
  "scarf",
  "top",
  "skirt",
  "accessory",
  "amigurumi",
  "granny_square",
  "custom",
] as const;

export const GARMENT_TYPES = ["cardigan", "sweater", "top", "skirt", "blanket", "scarf", "bag"] as const;

export const SIZES = ["xs", "s", "m", "l", "xl", "2xl", "custom"] as const;
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Give your project a name").max(120),
  type: z.enum(PROJECT_TYPES),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  size: z.enum(SIZES).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  squareSizeCm: z.coerce.number().positive().max(100).optional(),
  hookSizeMm: z.coerce.number().positive().max(30).optional(),
  totalSquares: z.coerce.number().int().min(0).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
