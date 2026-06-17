import { z } from "zod";

export const PathAlignmentSchema = z.object({
  pathId: z.string(),
  pathName: z.string(),
  score: z.number().min(0).max(100),
});

export type PathAlignment = z.infer<typeof PathAlignmentSchema>;

export const WeeklyReviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  goalId: z.string(),
  weekStart: z.string(),
  weekEnd: z.string(),
  completionRate: z.number().min(0).max(1),
  completedQuests: z.number(),
  skippedQuests: z.number(),
  summary: z.string(),
  attributeChanges: z.object({
    focus: z.number().default(0),
    execution: z.number().default(0),
    creativity: z.number().default(0),
    learning: z.number().default(0),
    communication: z.number().default(0),
    resilience: z.number().default(0),
    influence: z.number().default(0),
  }),
  pathAlignment: z.array(PathAlignmentSchema),
  recommendations: z.array(z.string()),
  createdAt: z.string().datetime(),
});

export type WeeklyReview = z.infer<typeof WeeklyReviewSchema>;

export const CreateReviewInputSchema = z.object({
  goalId: z.string(),
  weekStart: z.string(),
  weekEnd: z.string(),
});

export type CreateReviewInput = z.infer<typeof CreateReviewInputSchema>;
