import { z } from "zod";

export const QuestLogSchema = z.object({
  id: z.string(),
  questId: z.string(),
  userId: z.string(),
  status: z.enum(["completed", "skipped", "postponed"]),
  completedAt: z.string().datetime().optional(),
  reflection: z.string().optional(),
  actualMinutes: z.number().optional(),
  energyLevel: z.number().min(0).max(100).optional(),
  createdAt: z.string().datetime(),
});

export type QuestLog = z.infer<typeof QuestLogSchema>;

export const CreateQuestLogInputSchema = z.object({
  questId: z.string(),
  status: z.enum(["completed", "skipped", "postponed"]),
  reflection: z.string().optional(),
  actualMinutes: z.number().optional(),
  energyLevel: z.number().min(0).max(100).optional(),
});

export type CreateQuestLogInput = z.infer<typeof CreateQuestLogInputSchema>;
