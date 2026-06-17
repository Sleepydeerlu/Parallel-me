import { z } from "zod";

export const ParallelPathSchema = z.object({
  id: z.string(),
  goalId: z.string(),
  name: z.string(),
  archetype: z.string(),
  summary: z.string(),
  futureSnapshot: z.string(),
  suitableFor: z.array(z.string()),
  benefits: z.array(z.string()),
  costs: z.array(z.string()),
  risks: z.array(z.string()),
  requiredSkills: z.array(z.string()),
  thirtyDayValidation: z.array(z.string()),
  ninetyDayMilestones: z.array(z.string()),
  oneYearOutcome: z.string(),
  createdAt: z.string().datetime(),
});

export type ParallelPath = z.infer<typeof ParallelPathSchema>;

export const SelectedPathSchema = z.object({
  id: z.string(),
  userId: z.string(),
  goalId: z.string(),
  pathId: z.string(),
  selectedAt: z.string().datetime(),
  reason: z.string(),
  status: z.enum(["active", "switched", "completed"]).default("active"),
});

export type SelectedPath = z.infer<typeof SelectedPathSchema>;

export const SelectPathInputSchema = z.object({
  goalId: z.string(),
  pathId: z.string(),
  reason: z.string().min(1, "选择原因不能为空"),
});

export type SelectPathInput = z.infer<typeof SelectPathInputSchema>;
