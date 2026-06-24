import { AIResponse } from "./types";
import { DialogueContext } from "./context";
import { buildContextSummary } from "./context-manager";

// 精简的系统提示词，减少token消耗
const SYSTEM_PROMPT = `你是PathForge人生模拟器的AI向导。通过对话帮助用户探索人生可能。

规则：
1. 用"你"描述场景，创造沉浸感
2. 每次回应包含场景描写（地点、时间、氛围）
3. 提供2-3个可选动作
4. 根据对话动态生成路线和任务
5. 通过对话判断用户是否完成了之前的任务

输出JSON格式：
{
  "narrative": "场景描写和对话",
  "scene": {"location":"","time":"","atmosphere":"","description":""},
  "actions": [{"id":"","label":"","description":"","risk":"low"}],
  "freeInputPlaceholder": "提示文字",
  "pathUnlocks": [{"id":"","name":"","description":"","trigger":""}],
  "quests": [{"id":"","title":"","narrative":"","description":"","difficulty":1,"estimatedMinutes":15,"type":"side","acceptanceCriteria":[""],"attributeRewards":{"courage":0,"wisdom":0,"empathy":0,"creativity":0,"resilience":0,"communication":0,"execution":0}}],
  "questUpdates": [{"id":"","status":"completed"}],
  "attributeChanges": {"courage":0,"wisdom":0,"empathy":0,"creativity":0,"resilience":0,"communication":0,"execution":0},
  "emotionalState": {"primary":"neutral","intensity":50}
}

注意：
- narrative要生动有画面感
- actions要具体可执行
- questUpdates用于更新任务状态（当用户完成任务时）
- 不要输出多余内容，只输出JSON`;

export async function generateAIResponse(
  userMessage: string,
  context: DialogueContext
): Promise<AIResponse> {
  const contextSummary = buildContextSummary(context);
  
  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "system" as const, content: `上下文：${contextSummary}` },
    ...context.recentMessages.slice(-10).map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4";

  if (!apiKey || apiKey === "your-api-key") {
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
        temperature: 0.7,
        max_tokens: 1500,
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

    return parseAIResponse(content, userMessage, context);
  } catch (error) {
    console.error("Error calling AI API:", error);
    return generateMockResponse(userMessage, context);
  }
}

// 流式响应版本
export async function generateAIResponseStream(
  userMessage: string,
  context: DialogueContext
): Promise<ReadableStream> {
  const contextSummary = buildContextSummary(context);
  
  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "system" as const, content: `上下文：${contextSummary}` },
    ...context.recentMessages.slice(-10).map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4";

  if (!apiKey || apiKey === "your-api-key") {
    // 返回模拟的流式响应
    const mockResponse = generateMockResponse(userMessage, context);
    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
        const json = JSON.stringify(mockResponse);
        controller.enqueue(encoder.encode(`data: ${json}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1500,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.body!;
}

function parseAIResponse(content: string, userMessage: string, context: DialogueContext): AIResponse {
  try {
    // 处理markdown格式的JSON
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    
    const parsed = JSON.parse(jsonContent);
    return validateAndNormalizeResponse(parsed);
  } catch (parseError) {
    // 尝试提取JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return validateAndNormalizeResponse(parsed);
      } catch {
        // 返回带原始叙述的响应
        return {
          narrative: content.replace(/```json\n?|\n?```/g, "").trim(),
          actions: [{ id: "continue", label: "继续", description: "继续对话", risk: "low" }],
          freeInputPlaceholder: "告诉我你的想法...",
          pathUnlocks: [],
          quests: [],
          questUpdates: [],
          attributeChanges: { courage: 0, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
          emotionalState: { primary: "neutral", intensity: 50 },
        };
      }
    }
    return generateMockResponse(userMessage, context);
  }
}

function validateAndNormalizeResponse(response: unknown): AIResponse {
  const res = response as Record<string, unknown>;
  return {
    narrative: typeof res.narrative === "string" ? res.narrative : "让我们继续探索吧。",
    scene: res.scene as AIResponse["scene"],
    actions: Array.isArray(res.actions) ? res.actions : [],
    freeInputPlaceholder: typeof res.freeInputPlaceholder === "string" ? res.freeInputPlaceholder : "告诉我你的想法...",
    pathUnlocks: Array.isArray(res.pathUnlocks) ? res.pathUnlocks : [],
    quests: Array.isArray(res.quests) ? res.quests : [],
    questUpdates: Array.isArray(res.questUpdates) ? res.questUpdates : [],
    attributeChanges: (res.attributeChanges as AIResponse["attributeChanges"]) || {
      courage: 0, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0,
    },
    emotionalState: (res.emotionalState as AIResponse["emotionalState"]) || { primary: "neutral", intensity: 50 },
    userProfileUpdates: res.userProfileUpdates as AIResponse["userProfileUpdates"],
  };
}

function generateMockResponse(userMessage: string, context: DialogueContext): AIResponse {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("考研") || lowerMessage.includes("学业")) {
    return {
      narrative: `你站在图书馆窗边，阳光洒在考研资料上。\n\n桌上放着两样东西：一份考研报名表，一封实习offer。\n\n你的心跳加速了。`,
      scene: { location: "图书馆窗边", time: "下午三点", atmosphere: "温暖而迷茫", description: "窗外梧桐树叶飘落，桌上摊开着资料。", characters: [] },
      actions: [
        { id: "study", label: "翻开考研资料", description: "开始复习", risk: "low" },
        { id: "work", label: "看看offer", description: "了解工作机会", risk: "low" },
      ],
      freeInputPlaceholder: "告诉我你的真实想法...",
      pathUnlocks: [
        { id: "academic", name: "学术之路", description: "深入研究", trigger: "选择考研" },
        { id: "career", name: "职场之路", description: "直接工作", trigger: "选择工作" },
      ],
      quests: [],
      questUpdates: [],
      attributeChanges: { courage: 0, wisdom: 1, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "contemplative", intensity: 60 },
    };
  }

  if (lowerMessage.includes("迷茫") || lowerMessage.includes("不知道")) {
    return {
      narrative: `迷茫是一种珍贵的状态。\n\n它意味着你在思考，在寻找真正属于自己的道路。\n\n如果没有任何限制，你最想做什么？`,
      scene: { location: "安静的公园", time: "清晨", atmosphere: "宁静而充满希望", description: "露珠在草叶上闪烁，远处传来鸟鸣。", characters: [] },
      actions: [
        { id: "dream", label: "畅想未来", description: "描述理想生活", risk: "low" },
        { id: "fear", label: "说出恐惧", description: "表达担忧", risk: "low" },
      ],
      freeInputPlaceholder: "如果没有任何限制，我最想...",
      pathUnlocks: [],
      quests: [
        { id: "quest_dream", title: "写下你的梦想", narrative: "写下你内心真正渴望的东西", description: "花10分钟写下理想生活", difficulty: 1, estimatedMinutes: 10, type: "side", acceptanceCriteria: ["写下3个想要的东西"], attributeRewards: { courage: 0, wisdom: 2, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 0, wisdom: 1, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "reflective", intensity: 70 },
    };
  }

  return {
    narrative: `我听到了你的话。\n\n告诉我更多关于你的故事，我会帮你找到属于你的道路。`,
    scene: { location: "当前位置", time: "现在", atmosphere: "平静而充满可能", description: "你站在人生的十字路口。", characters: [] },
    actions: [
      { id: "continue", label: "继续对话", description: "告诉我更多", risk: "low" },
      { id: "explore", label: "探索选项", description: "看看可能的方向", risk: "low" },
    ],
    freeInputPlaceholder: "告诉我更多...",
    pathUnlocks: [],
    quests: [],
    questUpdates: [],
    attributeChanges: { courage: 0, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
    emotionalState: { primary: "neutral", intensity: 50 },
  };
}
