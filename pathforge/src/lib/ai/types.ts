import { z } from "zod";

// 场景配置
export const SceneSchema = z.object({
  location: z.string(),
  time: z.string(),
  atmosphere: z.string(),
  description: z.string(),
  characters: z.array(z.string()).default([]),
});

export type Scene = z.infer<typeof SceneSchema>;

// 可选动作
export const ActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  risk: z.enum(["low", "medium", "high"]).default("low"),
  reward: z.string().optional(),
});

export type Action = z.infer<typeof ActionSchema>;

// 路线解锁
export const PathUnlockSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  trigger: z.string(),
});

export type PathUnlock = z.infer<typeof PathUnlockSchema>;

// 动态任务
export const DynamicQuestSchema = z.object({
  id: z.string(),
  title: z.string(),
  narrative: z.string(),
  description: z.string(),
  difficulty: z.number().min(1).max(5).default(1),
  estimatedMinutes: z.number().default(15),
  type: z.enum(["main", "side", "hidden", "emergency"]).default("side"),
  acceptanceCriteria: z.array(z.string()),
  attributeRewards: z.object({
    courage: z.number().default(0),
    wisdom: z.number().default(0),
    empathy: z.number().default(0),
    creativity: z.number().default(0),
    resilience: z.number().default(0),
    communication: z.number().default(0),
    execution: z.number().default(0),
  }).default({
    courage: 0,
    wisdom: 0,
    empathy: 0,
    creativity: 0,
    resilience: 0,
    communication: 0,
    execution: 0,
  }),
});

export type DynamicQuest = z.infer<typeof DynamicQuestSchema>;

// AI响应
export const AIResponseSchema = z.object({
  narrative: z.string(),
  scene: SceneSchema.optional(),
  actions: z.array(ActionSchema).default([]),
  freeInputPlaceholder: z.string().default("告诉我你的想法..."),
  pathUnlocks: z.array(PathUnlockSchema).default([]),
  quests: z.array(DynamicQuestSchema).default([]),
  questUpdates: z.array(z.object({
    id: z.string(),
    status: z.enum(["completed", "failed", "abandoned"]),
  })).default([]),
  attributeChanges: z.object({
    courage: z.number().default(0),
    wisdom: z.number().default(0),
    empathy: z.number().default(0),
    creativity: z.number().default(0),
    resilience: z.number().default(0),
    communication: z.number().default(0),
    execution: z.number().default(0),
  }).default({
    courage: 0,
    wisdom: 0,
    empathy: 0,
    creativity: 0,
    resilience: 0,
    communication: 0,
    execution: 0,
  }),
  emotionalState: z.object({
    primary: z.string().default("neutral"),
    intensity: z.number().min(0).max(100).default(50),
  }).default({
    primary: "neutral",
    intensity: 50,
  }),
  userProfileUpdates: z.object({
    goals: z.array(z.string()).optional(),
    fears: z.array(z.string()).optional(),
    desires: z.array(z.string()).optional(),
    values: z.array(z.string()).optional(),
  }).optional(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;
