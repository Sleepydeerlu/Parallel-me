import { z } from "zod";

export const UserProfileSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  identity: z.string(),
  currentStage: z.string(),
  goals: z.array(z.string()).default([]),
  constraints: z.array(z.string()).default([]),
  preferences: z.object({
    language: z.string().default("zh-CN"),
    tone: z.enum(["supportive", "direct", "motivational"]).default("supportive"),
    taskIntensity: z.enum(["low", "medium", "high"]).default("medium"),
  }).default({
    language: "zh-CN",
    tone: "supportive",
    taskIntensity: "medium",
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const CreateUserInputSchema = z.object({
  displayName: z.string().min(1, "显示名称不能为空"),
  identity: z.string().min(1, "当前身份不能为空"),
  currentStage: z.string().min(1, "当前阶段不能为空"),
  preferences: z.object({
    language: z.string().default("zh-CN"),
    tone: z.enum(["supportive", "direct", "motivational"]).default("supportive"),
    taskIntensity: z.enum(["low", "medium", "high"]).default("medium"),
  }).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
