import { z } from "zod";

// 对话消息
export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.string().datetime(),
  metadata: z.object({
    scene: z.string().optional(),
    emotion: z.string().optional(),
    pathImpact: z.string().optional(),
    questGenerated: z.boolean().optional(),
  }).optional(),
});

export type Message = z.infer<typeof MessageSchema>;

// 对话摘要（用于压缩）
export const SummarySchema = z.object({
  id: z.string(),
  messageRange: z.object({
    start: z.string(),
    end: z.string(),
  }),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  emotionalArc: z.string(),
  decisions: z.array(z.string()),
  createdAt: z.string().datetime(),
});

export type Summary = z.infer<typeof SummarySchema>;

// 用户画像（从对话中提取）
export const UserProfileSchema = z.object({
  identity: z.object({
    age: z.number().optional(),
    occupation: z.string().optional(),
    location: z.string().optional(),
    lifeStage: z.string().optional(),
  }).default({}),
  goals: z.array(z.string()).default([]),
  fears: z.array(z.string()).default([]),
  desires: z.array(z.string()).default([]),
  values: z.array(z.string()).default([]),
  relationships: z.array(z.object({
    person: z.string(),
    role: z.string(),
    sentiment: z.string(),
  })).default([]),
  personality: z.object({
    traits: z.array(z.string()).default([]),
    communicationStyle: z.string().optional(),
    decisionStyle: z.string().optional(),
  }).default({
    traits: [],
  }),
  updatedAt: z.string().datetime().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// 路线状态
export const PathStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["locked", "unlocked", "active", "completed", "abandoned"]),
  progress: z.number().min(0).max(100).default(0),
  origin: z.object({
    dialogueId: z.string(),
    trigger: z.string(),
  }),
  milestones: z.array(z.object({
    id: z.string(),
    name: z.string(),
    completed: z.boolean().default(false),
    completedAt: z.string().datetime().optional(),
  })).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type PathState = z.infer<typeof PathStateSchema>;

// 任务状态
export const QuestStateSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  narrative: z.string(),
  type: z.enum(["main", "side", "hidden", "emergency"]),
  status: z.enum(["active", "completed", "failed", "abandoned"]),
  difficulty: z.number().min(1).max(5),
  estimatedMinutes: z.number(),
  acceptanceCriteria: z.array(z.string()),
  origin: z.object({
    dialogueId: z.string(),
    scene: z.string(),
  }),
  rewards: z.object({
    attributes: z.record(z.string(), z.number()).default({}),
    unlocks: z.array(z.string()).default([]),
  }).default({
    attributes: {},
    unlocks: [],
  }),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export type QuestState = z.infer<typeof QuestStateSchema>;

// 属性状态
export const AttributesSchema = z.object({
  courage: z.number().default(10),
  wisdom: z.number().default(10),
  empathy: z.number().default(10),
  creativity: z.number().default(10),
  resilience: z.number().default(10),
  communication: z.number().default(10),
  execution: z.number().default(10),
});

export type Attributes = z.infer<typeof AttributesSchema>;

// 完整的对话上下文
export const DialogueContextSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  
  // 消息历史（最近N条）
  recentMessages: z.array(MessageSchema).default([]),
  
  // 历史摘要
  summaries: z.array(SummarySchema).default([]),
  
  // 用户画像
  userProfile: UserProfileSchema.default({
    identity: {},
    goals: [],
    fears: [],
    desires: [],
    values: [],
    relationships: [],
    personality: {
      traits: [],
    },
  }),
  
  // 路线状态
  paths: z.array(PathStateSchema).default([]),
  activePathId: z.string().optional(),
  
  // 任务状态
  quests: z.array(QuestStateSchema).default([]),
  
  // 属性
  attributes: AttributesSchema.default({
    courage: 10,
    wisdom: 10,
    empathy: 10,
    creativity: 10,
    resilience: 10,
    communication: 10,
    execution: 10,
  }),
  
  // 当前场景
  currentScene: z.object({
    location: z.string(),
    time: z.string(),
    atmosphere: z.string(),
    description: z.string(),
  }).optional(),
  
  // 情感状态
  emotionalState: z.object({
    primary: z.string().default("neutral"),
    intensity: z.number().min(0).max(100).default(50),
    history: z.array(z.object({
      emotion: z.string(),
      intensity: z.number(),
      timestamp: z.string(),
    })).default([]),
  }).default({
    primary: "neutral",
    intensity: 50,
    history: [],
  }),
  
  // 元数据
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    messageCount: z.number().default(0),
    summaryCount: z.number().default(0),
    tokenEstimate: z.number().default(0),
  }),
});

export type DialogueContext = z.infer<typeof DialogueContextSchema>;
