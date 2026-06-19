// 共享类型定义
export interface Attributes {
  courage: number;
  wisdom: number;
  empathy: number;
  creativity: number;
  resilience: number;
  communication: number;
  execution: number;
}

export interface Quest {
  id: string;
  title: string;
  narrative: string;
  description: string;
  difficulty: number;
  estimatedMinutes: number;
  type: "main" | "side" | "hidden" | "emergency" | string;
  status: "active" | "completed" | "failed" | "abandoned";
  acceptanceCriteria: string[];
}

export interface Path {
  id: string;
  name: string;
  description: string;
  status: "locked" | "unlocked" | "active" | "completed" | "abandoned";
  progress: number;
}

export interface ContextStats {
  messageCount: number;
  summaryCount: number;
  pathCount: number;
  questCount: number;
}

export interface PathUnlock {
  id: string;
  name: string;
  description: string;
  trigger: string;
}

export interface Scene {
  location: string;
  time: string;
  atmosphere: string;
  description: string;
}

export interface Action {
  id: string;
  label: string;
  description: string;
  risk: "low" | "medium" | "high";
  reward?: string;
}

// 默认属性值
export const DEFAULT_ATTRIBUTES: Attributes = {
  courage: 10,
  wisdom: 10,
  empathy: 10,
  creativity: 10,
  resilience: 10,
  communication: 10,
  execution: 10,
};

// 属性键列表
export const ATTRIBUTE_KEYS: (keyof Attributes)[] = [
  "courage",
  "wisdom",
  "empathy",
  "creativity",
  "resilience",
  "communication",
  "execution",
];
