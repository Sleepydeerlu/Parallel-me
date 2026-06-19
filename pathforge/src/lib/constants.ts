import { Attributes, Action, Scene } from "./types";

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

// 属性配置
export const ATTRIBUTE_CONFIG: Record<keyof Attributes, { label: string; icon: string; color: string }> = {
  courage: { label: "勇气", icon: "⚔️", color: "bg-red-500" },
  wisdom: { label: "智慧", icon: "📚", color: "bg-blue-500" },
  empathy: { label: "共情", icon: "❤️", color: "bg-pink-500" },
  creativity: { label: "创造力", icon: "🎨", color: "bg-purple-500" },
  resilience: { label: "韧性", icon: "🛡️", color: "bg-yellow-500" },
  communication: { label: "沟通力", icon: "💬", color: "bg-green-500" },
  execution: { label: "执行力", icon: "⚡", color: "bg-orange-500" },
};

// 欢迎消息
export const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant" as const,
  content: `欢迎来到PathForge。\n\n在这里，你不是在规划人生，而是在探索人生的无限可能。\n\n告诉我，你是谁？你最近在思考什么？`,
  timestamp: new Date(),
};

// 初始场景
export const INITIAL_SCENE: Scene = {
  location: "起点",
  time: "现在",
  atmosphere: "充满期待",
  description: "你站在一段新旅程的起点，周围是无限的可能。",
};

// 初始动作
export const INITIAL_ACTIONS: Action[] = [
  {
    id: "introduce",
    label: "自我介绍",
    description: "告诉我你是谁，你的现状",
    risk: "low",
  },
  {
    id: "confused",
    label: "我很迷茫",
    description: "说出你的困惑",
    risk: "low",
  },
  {
    id: "explore",
    label: "我想探索",
    description: "直接开始探索不同的人生路线",
    risk: "low",
  },
];

// 任务类型配置
export const QUEST_TYPE_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  main: { color: "bg-purple-900/50 border-purple-700", label: "主线", icon: "🎯" },
  side: { color: "bg-blue-900/50 border-blue-700", label: "支线", icon: "📌" },
  hidden: { color: "bg-yellow-900/50 border-yellow-700", label: "隐藏", icon: "🔮" },
  emergency: { color: "bg-red-900/50 border-red-700", label: "紧急", icon: "🚨" },
};

// 路线状态配置
export const PATH_STATUS_CONFIG: Record<string, { color: string; textColor: string; label: string }> = {
  locked: { color: "bg-gray-600", textColor: "text-gray-400", label: "🔒 锁定" },
  unlocked: { color: "bg-blue-600", textColor: "text-blue-300", label: "🔓 已解锁" },
  active: { color: "bg-indigo-600", textColor: "text-indigo-300", label: "✨ 当前" },
  completed: { color: "bg-green-600", textColor: "text-green-300", label: "✅ 完成" },
  abandoned: { color: "bg-gray-600", textColor: "text-gray-400", label: "❌ 放弃" },
};

// 任务状态配置
export const QUEST_STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active: { color: "text-green-400", label: "进行中" },
  completed: { color: "text-gray-400", label: "已完成" },
  failed: { color: "text-red-400", label: "失败" },
  abandoned: { color: "text-gray-500", label: "已放弃" },
};
