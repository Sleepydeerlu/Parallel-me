import { AIResponse } from "./types";
import { DialogueContext } from "./context";
import { buildContextSummary } from "./context-manager";

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
7. 保持对话的连贯性，记住之前讨论的内容
8. 适当引导用户深入思考，但不要说教

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
  },
  "userProfileUpdates": {
    "goals": ["新增的目标"],
    "fears": ["新增的担忧"],
    "desires": ["新增的渴望"],
    "values": ["新增的价值观"]
  }
}

重要：
- narrative字段要生动、有画面感，像小说一样引人入胜
- actions要具体、可执行，让用户有明确的选择
- 根据对话内容动态生成路线和任务
- 注意用户的情感变化，给予适当回应
- 保持对话的连贯性，不要重复之前的内容`;

export async function generateAIResponse(
  userMessage: string,
  context: DialogueContext
): Promise<AIResponse> {
  // 构建上下文摘要
  const contextSummary = buildContextSummary(context);
  
  // 构建消息历史
  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "system" as const, content: `当前对话上下文：\n${contextSummary}` },
    ...context.recentMessages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  // 调用API
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4";

  if (!apiKey || apiKey === "your-api-key") {
    // 返回模拟响应
    return generateMockResponse(userMessage, context);
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error("API request failed:", response.status, response.statusText);
      return generateMockResponse(userMessage, context);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return generateMockResponse(userMessage, context);
    }

    try {
      // 尝试解析JSON响应
      let jsonContent = content;
      
      // 处理markdown格式的JSON
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
      }
      
      const parsed = JSON.parse(jsonContent);
      return validateAndNormalizeResponse(parsed);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // 如果解析失败，尝试提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return validateAndNormalizeResponse(parsed);
        } catch {
          // 返回带有AI原始叙述的响应
          return {
            narrative: content.replace(/```json\n?|\n?```/g, "").trim(),
            actions: [
              { id: "continue", label: "继续对话", description: "告诉我更多", risk: "low" },
            ],
            freeInputPlaceholder: "告诉我你的想法...",
            pathUnlocks: [],
            quests: [],
            attributeChanges: { courage: 0, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
            emotionalState: { primary: "neutral", intensity: 50 },
          };
        }
      }
      return generateMockResponse(userMessage, context);
    }
  } catch (error) {
    console.error("Error calling AI API:", error);
    return generateMockResponse(userMessage, context);
  }
}

// 验证和标准化响应
function validateAndNormalizeResponse(response: unknown): AIResponse {
  const res = response as Record<string, unknown>;
  return {
    narrative: typeof res.narrative === "string" ? res.narrative : "让我们继续探索吧。",
    scene: res.scene as AIResponse["scene"],
    actions: Array.isArray(res.actions) ? res.actions : [],
    freeInputPlaceholder: typeof res.freeInputPlaceholder === "string" ? res.freeInputPlaceholder : "告诉我你的想法...",
    pathUnlocks: Array.isArray(res.pathUnlocks) ? res.pathUnlocks : [],
    quests: Array.isArray(res.quests) ? res.quests : [],
    attributeChanges: (res.attributeChanges as AIResponse["attributeChanges"]) || {
      courage: 0, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0,
    },
    emotionalState: (res.emotionalState as AIResponse["emotionalState"]) || { primary: "neutral", intensity: 50 },
    userProfileUpdates: res.userProfileUpdates as AIResponse["userProfileUpdates"],
  };
}

// 生成模拟响应
function generateMockResponse(
  userMessage: string,
  context: DialogueContext
): AIResponse {
  const lowerMessage = userMessage.toLowerCase();
  
  // 根据上下文生成更智能的响应
  const activePath = context.paths.find((p) => p.status === "active");
  const activeQuests = context.quests.filter((q) => q.status === "active");
  const recentEmotion = context.emotionalState.primary;

  // 基于关键词的响应
  if (lowerMessage.includes("考研") || lowerMessage.includes("学业")) {
    return {
      narrative: `你的话让我看到了你内心的挣扎。\n\n想象一下：五年后的你，站在人生的另一个节点上。\n\n如果你选择考研，你可能会在学术的殿堂里深造，结识志同道合的伙伴，但也要面对漫长的备考和可能的失败。\n\n如果你选择直接工作，你可能会更早地接触社会，积累经验，但也可能错过深入学习的机会。\n\n> 你觉得，哪个选择更接近你理想中的自己？`,
      scene: {
        location: "图书馆窗边",
        time: "下午三点",
        atmosphere: "阳光温暖，但内心有些迷茫",
        description: "窗外是校园的梧桐树，落叶在风中飘舞。桌上摊开着考研资料和一封实习offer。",
        characters: [],
      },
      actions: [
        { id: "study", label: "翻开考研资料", description: "开始认真复习，为考研做准备", risk: "low", reward: "学术能力提升" },
        { id: "work", label: "打开实习offer", description: "仔细看看这份工作机会", risk: "low", reward: "职场经验" },
        { id: "talk", label: "找人聊聊", description: "和信任的人讨论这个决定", risk: "low", reward: "新的视角" },
      ],
      freeInputPlaceholder: "告诉我你内心真实的想法...",
      pathUnlocks: [
        { id: "academic", name: "学术之路", description: "深入研究，追求知识的边界", trigger: "选择考研或表达对学术的兴趣" },
        { id: "career", name: "职场之路", description: "直接进入职场，积累实战经验", trigger: "选择工作或表达对职场的向往" },
      ],
      quests: [],
      attributeChanges: { courage: 0, wisdom: 1, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "contemplative", intensity: 60 },
    };
  }

  if (lowerMessage.includes("工作") || lowerMessage.includes("职业")) {
    return {
      narrative: `工作，是人生中很重要的一部分。\n\n你现在的状态是什么样的？是刚毕业正在找工作，还是已经工作了一段时间感到迷茫？\n\n告诉我更多关于你的情况，我会帮你探索不同的可能性。\n\n记住，没有标准答案，只有最适合你的选择。`,
      scene: {
        location: "咖啡馆",
        time: "傍晚",
        atmosphere: "温暖而安静",
        description: "咖啡的香气弥漫在空气中，窗外是匆匆的行人。",
        characters: [],
      },
      actions: [
        { id: "current", label: "聊聊现状", description: "描述你目前的工作状态", risk: "low" },
        { id: "dream", label: "谈谈梦想", description: "说说你理想中的工作是什么样的", risk: "low" },
        { id: "confused", label: "表达迷茫", description: "承认自己现在很迷茫", risk: "low" },
      ],
      freeInputPlaceholder: "你现在的状态是...",
      pathUnlocks: [],
      quests: [],
      attributeChanges: { courage: 0, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "neutral", intensity: 50 },
    };
  }

  if (lowerMessage.includes("迷茫") || lowerMessage.includes("不知道")) {
    return {
      narrative: `迷茫，其实是一种很珍贵的状态。\n\n它意味着你在思考，在探索，在寻找真正属于自己的道路。\n\n很多人一辈子都不曾迷茫过，他们只是随波逐流，从未真正问过自己：我到底想要什么？\n\n所以，恭喜你，你正在经历一次重要的觉醒。\n\n让我们从一个小问题开始：如果没有任何限制，你最想做的事情是什么？`,
      scene: {
        location: "安静的公园",
        time: "清晨",
        atmosphere: "宁静而充满希望",
        description: "露珠在草叶上闪烁，远处传来鸟鸣。这里没有评判，只有倾听。",
        characters: [],
      },
      actions: [
        { id: "dream", label: "畅想未来", description: "描述你理想中的生活", risk: "low", reward: "明确方向" },
        { id: "fear", label: "说出恐惧", description: "说出你最担心的事情", risk: "low", reward: "释放压力" },
        { id: "small", label: "从小事开始", description: "聊聊你最近在做的事情", risk: "low" },
      ],
      freeInputPlaceholder: "如果没有任何限制，我最想...",
      pathUnlocks: [],
      quests: [
        {
          id: "quest_dream",
          title: "写下你的梦想",
          narrative: "在这个安静的时刻，拿起笔，写下你内心深处真正渴望的东西。",
          description: "花10分钟，写下你理想中的生活是什么样的。不需要完美，只需要真实。",
          difficulty: 1,
          estimatedMinutes: 10,
          type: "side",
          acceptanceCriteria: ["写下至少3个你想要的东西", "不需要逻辑清晰，想到什么写什么"],
          attributeRewards: { courage: 1, wisdom: 2, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
        },
      ],
      attributeChanges: { courage: 0, wisdom: 1, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "reflective", intensity: 70 },
    };
  }

  // 默认响应
  return {
    narrative: `我听到了你的话。\n\n让我们继续探索吧。告诉我更多关于你的故事，我会帮你找到属于你的道路。\n\n记住，人生的每一步都是有意义的，即使你现在还不确定方向。`,
    scene: {
      location: "当前位置",
      time: "现在",
      atmosphere: "平静而充满可能",
      description: "你站在人生的十字路口，每一条路都通向不同的未来。",
        characters: [],
    },
    actions: [
      { id: "continue", label: "继续对话", description: "告诉我更多关于你的事情", risk: "low" },
      { id: "explore", label: "探索选项", description: "看看有哪些可能的方向", risk: "low" },
    ],
    freeInputPlaceholder: "告诉我更多...",
    pathUnlocks: [],
    quests: [],
    attributeChanges: { courage: 0, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
    emotionalState: { primary: "neutral", intensity: 50 },
  };
}
