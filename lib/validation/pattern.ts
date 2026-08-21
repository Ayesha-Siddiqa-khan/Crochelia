import { z } from "zod";
import { WEIGHT_CLASSES } from "@/lib/validation/yarn";
import { PROJECT_TYPES, DIFFICULTIES } from "@/lib/validation/project";

export const VISIBILITIES = ["private", "unlisted", "public"] as const;

export const patternSchema = z.object({
  name: z.string().trim().min(1, "Give your pattern a name").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  projectType: z.enum(PROJECT_TYPES).optional().or(z.literal("")),
  difficulty: z.enum(DIFFICULTIES).optional().or(z.literal("")),
  technique: z.string().trim().max(120).optional().or(z.literal("")),
  yarnWeight: z.enum(WEIGHT_CLASSES).optional().or(z.literal("")),
  hookSizeMm: z.coerce.number().positive().max(30).optional(),
  gauge: z.string().trim().max(200).optional().or(z.literal("")),
  materials: z.string().trim().max(2000).optional().or(z.literal("")),
  abbreviations: z.string().trim().max(2000).optional().or(z.literal("")),
  instructions: z.string().trim().min(1, "Instructions are required").max(20000),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  visibility: z.enum(VISIBILITIES),
});

export type PatternInput = z.infer<typeof patternSchema>;
