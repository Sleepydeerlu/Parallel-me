import { z } from "zod";

export const AttributeProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  focus: z.number().default(0),
  execution: z.number().default(0),
  creativity: z.number().default(0),
  learning: z.number().default(0),
  communication: z.number().default(0),
  resilience: z.number().default(0),
  influence: z.number().default(0),
  updatedAt: z.string().datetime(),
});

export type AttributeProfile = z.infer<typeof AttributeProfileSchema>;

export const AttributeChangeSchema = z.object({
  focus: z.number().default(0),
  execution: z.number().default(0),
  creativity: z.number().default(0),
  learning: z.number().default(0),
  communication: z.number().default(0),
  resilience: z.number().default(0),
  influence: z.number().default(0),
});

export type AttributeChange = z.infer<typeof AttributeChangeSchema>;
