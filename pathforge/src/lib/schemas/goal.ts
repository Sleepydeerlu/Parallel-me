import { z } from "zod";

export const LifeGoalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  timeHorizon: z.string(),
  weeklyHours: z.number().min(1).max(40),
  motivation: z.string(),
  constraints: z.array(z.string()).default([]),
  status: z.enum(["active", "completed", "abandoned"]).default("active"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type LifeGoal = z.infer<typeof LifeGoalSchema>;

export const CreateGoalInputSchema = z.object({
  title: z.string().min(1, "目标标题不能为空"),
  description: z.string().min(1, "目标描述不能为空"),
  timeHorizon: z.string().min(1, "时间周期不能为空"),
  weeklyHours: z.number().min(1).max(40),
  motivation: z.string().min(1, "动机不能为空"),
  constraints: z.array(z.string()).default([]),
});

export type CreateGoalInput = z.infer<typeof CreateGoalInputSchema>;
