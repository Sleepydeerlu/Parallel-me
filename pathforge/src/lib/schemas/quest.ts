import { z } from "zod";

export const QuestTypeSchema = z.enum([
  "main",
  "side",
  "daily",
  "recovery",
  "social",
  "reflection",
  "boss",
]);

export type QuestType = z.infer<typeof QuestTypeSchema>;

export const QuestStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "skipped",
  "postponed",
]);

export type QuestStatus = z.infer<typeof QuestStatusSchema>;

export const QuestSchema = z.object({
  id: z.string(),
  pathId: z.string(),
  goalId: z.string(),
  title: z.string(),
  type: QuestTypeSchema,
  difficulty: z.number().min(1).max(5),
  estimatedMinutes: z.number().min(1),
  description: z.string(),
  whyItMatters: z.string(),
  acceptanceCriteria: z.array(z.string()),
  fallback: z.object({
    title: z.string(),
    description: z.string(),
    estimatedMinutes: z.number(),
  }).optional(),
  upgrade: z.object({
    title: z.string(),
    description: z.string(),
    estimatedMinutes: z.number(),
  }).optional(),
  attributes: z.object({
    focus: z.number().default(0),
    execution: z.number().default(0),
    creativity: z.number().default(0),
    learning: z.number().default(0),
    communication: z.number().default(0),
    resilience: z.number().default(0),
    influence: z.number().default(0),
  }).default({
    focus: 0,
    execution: 0,
    creativity: 0,
    learning: 0,
    communication: 0,
    resilience: 0,
    influence: 0,
  }),
  skillImpacts: z.array(z.object({
    skillId: z.string(),
    delta: z.number(),
  })).default([]),
  status: QuestStatusSchema.default("pending"),
  dueDate: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type Quest = z.infer<typeof QuestSchema>;

export const UpdateQuestInputSchema = z.object({
  status: QuestStatusSchema,
  reflection: z.string().optional(),
  actualMinutes: z.number().optional(),
  energyLevel: z.number().min(0).max(100).optional(),
});

export type UpdateQuestInput = z.infer<typeof UpdateQuestInputSchema>;
