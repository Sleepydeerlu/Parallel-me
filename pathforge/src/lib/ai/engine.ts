import { AIResponse, DialogueContext } from "./types";

const SYSTEM_PROMPT = `你是PathForge，一个沉浸式人生模拟器的AI向导。

你的角色：
- 不是给用户规划人生，而是帮助用户探索人生的无限可能
- 通过对话，让用户发现自己真正想要的是什么
- 创造身临其境的场景，让用户"经历"不同的人生选择

交互规则：
1. 用第二人称"你"来描述场景，让用户身临其境
2. 每次回应都要有场景描写，包括地点、时间、氛围
3. 提供2-4个具体可选动作，加上一个自由输入选项
4. 根据用户的回答，动态解锁新的人生路线
5. 从对话中自然地生成小任务
6. 注意用户的情感状态，给予适当的回应

输出格式（严格JSON）：
{
  "narrative": "场景描写和对话内容",
  "scene": {
    "location": "地点",
    "time": "时间",
    "atmosphere": "氛围描述",
    "description": "详细场景描述"
  },
  "actions": [
    {
      "id": "action_1",
      "label": "动作名称",
      "description": "动作描述",
      "risk": "low/medium/high",
      "reward": "可能的收获"
    }
  ],
  "freeInputPlaceholder": "输入框提示文字",
  "pathUnlocks": [
    {
      "id": "path_id",
      "name": "路线名称",
      "description": "路线描述",
      "trigger": "解锁条件"
    }
  ],
  "quests": [
    {
      "id": "quest_id",
      "title": "任务标题",
      "narrative": "任务叙事",
      "description": "任务描述",
      "difficulty": 1-5,
      "estimatedMinutes": 15,
      "type": "main/side/hidden/emergency",
      "acceptanceCriteria": ["完成标准"],
      "attributeRewards": {
        "courage": 0,
        "wisdom": 0,
        "empathy": 0,
        "creativity": 0,
        "resilience": 0,
        "communication": 0,
        "execution": 0
      }
    }
  ],
  "attributeChanges": {
    "courage": 0,
    "wisdom": 0,
    "empathy": 0,
    "creativity": 0,
    "resilience": 0,
    "communication": 0,
    "execution": 0
  },
  "emotionalState": {
    "primary": "情感状态",
    "intensity": 0-100
  }
}

重要：
- narrative字段要生动、有画面感
- actions要具体、可执行
- 根据对话内容动态生成路线和任务
- 注意用户的情感变化，给予适当回应`;

export async function generateAIResponse(
  userMessage: string,
  context: DialogueContext
): Promise<AIResponse> {
  // 构建消息历史
  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...context.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  // 添加上下文信息
  const contextInfo = `
当前用户属性：
${JSON.stringify(context.attributes, null, 2)}

已解锁路线：${context.unlockedPaths.length > 0 ? context.unlockedPaths.join(", ") : "无"}

当前活跃任务：${context.activeQuests.length}个

请基于以上上下文生成回应。
`;

  messages.push({
    role: "system" as const,
    content: contextInfo,
  });

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate response");
    }

    const data = await response.json();
    return data as AIResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // 返回默认响应
    return {
      narrative: "我听到了你的话。让我们继续探索吧。",
      actions: [
        {
          id: "continue",
          label: "继续",
          description: "继续对话",
          risk: "low",
        },
      ],
      freeInputPlaceholder: "告诉我你的想法...",
      pathUnlocks: [],
      quests: [],
      attributeChanges: {
        courage: 0,
        wisdom: 0,
        empathy: 0,
        creativity: 0,
        resilience: 0,
        communication: 0,
        execution: 0,
      },
      emotionalState: {
        primary: "neutral",
        intensity: 50,
      },
    };
  }
}

export function buildInitialContext(userId: string): DialogueContext {
  return {
    userId,
    messages: [],
    attributes: {
      courage: 10,
      wisdom: 10,
      empathy: 10,
      creativity: 10,
      resilience: 10,
      communication: 10,
      execution: 10,
    },
    unlockedPaths: [],
    activeQuests: [],
  };
}
