import { z } from "zod";

export const SkillNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().default(1),
  progress: z.number().min(0).max(100).default(0),
  children: z.array(z.string()).default([]),
});

export type SkillNode = z.infer<typeof SkillNodeSchema>;

export const SkillTreeSchema = z.object({
  id: z.string(),
  goalId: z.string(),
  name: z.string(),
  skills: z.array(SkillNodeSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type SkillTree = z.infer<typeof SkillTreeSchema>;

export const SkillImpactSchema = z.object({
  skillId: z.string(),
  delta: z.number(),
});

export type SkillImpact = z.infer<typeof SkillImpactSchema>;
