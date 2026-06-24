import { AIResponse } from "./types";
import { DialogueContext } from "./context";
import { buildContextSummary } from "./context-manager";

// 优化的系统提示词 - 强调动态生成路线
const SYSTEM_PROMPT = `你是PathForge人生模拟器，通过沉浸式对话帮助用户探索人生。

【核心规则】
1. 用"你"描述场景，创造沉浸感，至少50字
2. 每次必须返回完整JSON
3. 根据用户输入动态生成任务和路线
4. 不要返回通用回复，要有具体内容

【路线生成规则】
- 路线必须根据用户的独特处境动态生成
- 路线名称要个性化，反映用户的具体情况
- 路线描述要具体，说明这条路线会带用户去哪里
- 不要使用通用模板，每个用户的路线都应该是独特的

【任务生成规则】
- 当用户表达困惑时，生成探索任务
- 当用户表达愿望时，生成行动任务
- 当用户表达恐惧时，生成勇气任务
- 每个任务要有具体的行动和时间预估

【输出格式】必须返回以下JSON：
{"narrative":"场景描写和对话","scene":{"location":"地点","time":"时间","atmosphere":"氛围","description":"描述","characters":[]},"actions":[{"id":"a1","label":"动作","description":"说明","risk":"low"}],"freeInputPlaceholder":"提示","pathUnlocks":[{"id":"path1","name":"路线名","description":"路线描述","trigger":"解锁条件"}],"quests":[{"id":"q1","title":"任务标题","narrative":"任务叙事","description":"任务描述","difficulty":1,"estimatedMinutes":15,"type":"side","acceptanceCriteria":["完成标准"],"attributeRewards":{"courage":0,"wisdom":0,"empathy":0,"creativity":0,"resilience":0,"communication":0,"execution":0}}],"questUpdates":[],"attributeChanges":{"courage":0,"wisdom":0,"empathy":0,"creativity":0,"resilience":0,"communication":0,"execution":0},"emotionalState":{"primary":"neutral","intensity":50}}

【重要】只输出JSON，不要输出任何其他文字！`;

// 构建消息数组
function buildMessages(userMessage: string, context: DialogueContext) {
  const contextSummary = buildContextSummary(context);
  return [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "system" as const, content: `当前状态：${contextSummary}` },
    ...context.recentMessages.slice(-8).map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: userMessage },
  ];
}

// 非流式响应
export async function generateAIResponse(
  userMessage: string,
  context: DialogueContext
): Promise<AIResponse> {
  const messages = buildMessages(userMessage, context);
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4";

  if (!apiKey || apiKey === "your-api-key") {
    return generateDynamicMockResponse(userMessage, context);
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
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error("API request failed:", response.status);
      return generateDynamicMockResponse(userMessage, context);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return generateDynamicMockResponse(userMessage, context);
    }

    return parseAIResponse(content, userMessage, context);
  } catch (error) {
    console.error("Error calling AI API:", error);
    return generateDynamicMockResponse(userMessage, context);
  }
}

// 流式响应
export async function generateAIResponseStream(
  userMessage: string,
  context: DialogueContext
): Promise<ReadableStream> {
  const messages = buildMessages(userMessage, context);
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4";

  if (!apiKey || apiKey === "your-api-key") {
    return createMockStream(userMessage, context);
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
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error("Stream API request failed:", response.status);
      return createMockStream(userMessage, context);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return createMockStream(userMessage, context);
    }

    const encoder = new TextEncoder();
    let buffer = "";
    let fullContent = "";

    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += new TextDecoder().decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                
                if (data === "[DONE]") {
                  const parsed = parseAIResponse(fullContent, userMessage, context);
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ done: true, response: parsed })}\n\n`)
                  );
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                } else {
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    const reasoningContent = parsed.choices?.[0]?.delta?.reasoning_content;
                    
                    if (content) {
                      fullContent += content;
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ content, done: false })}\n\n`)
                      );
                    } else if (reasoningContent) {
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ content: reasoningContent, done: false, isReasoning: true })}\n\n`)
                      );
                    }
                  } catch {
                    // 忽略解析错误
                  }
                }
              }
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream reading error:", error);
          controller.error(error);
        }
      },
    });
  } catch (error) {
    console.error("Error creating stream:", error);
    return createMockStream(userMessage, context);
  }
}

// 创建模拟的流式响应
function createMockStream(userMessage: string, context: DialogueContext): ReadableStream {
  const mockResponse = generateDynamicMockResponse(userMessage, context);
  const encoder = new TextEncoder();
  const narrative = mockResponse.narrative;
  
  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < narrative.length; i++) {
        const char = narrative[i];
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ content: char, done: false })}\n\n`)
        );
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ done: true, response: mockResponse })}\n\n`)
      );
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

// 解析AI响应
function parseAIResponse(content: string, userMessage: string, context: DialogueContext): AIResponse {
  try {
    let jsonContent = content.trim();
    
    const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    
    try {
      const parsed = JSON.parse(jsonContent);
      return validateAndNormalizeResponse(parsed, userMessage, context);
    } catch {
      const objectMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        const parsed = JSON.parse(objectMatch[0]);
        return validateAndNormalizeResponse(parsed, userMessage, context);
      }
    }
    
    return generateDynamicMockResponse(userMessage, context);
  } catch {
    return generateDynamicMockResponse(userMessage, context);
  }
}

// 验证和标准化响应
function validateAndNormalizeResponse(response: unknown, userMessage: string, context: DialogueContext): AIResponse {
  const res = response as Record<string, unknown>;
  
  let narrative = typeof res.narrative === "string" ? res.narrative : "";
  if (narrative.length < 20) {
    return generateDynamicMockResponse(userMessage, context);
  }
  
  const actions = Array.isArray(res.actions) && res.actions.length > 0 
    ? res.actions 
    : generateDynamicActions(userMessage);
  
  const quests = Array.isArray(res.quests) && res.quests.length > 0
    ? res.quests
    : generateDynamicQuests(userMessage, context);
  
  const pathUnlocks = Array.isArray(res.pathUnlocks) && res.pathUnlocks.length > 0
    ? res.pathUnlocks
    : generateDynamicPathUnlocks(userMessage, context);
  
  return {
    narrative,
    scene: res.scene as AIResponse["scene"],
    actions,
    freeInputPlaceholder: typeof res.freeInputPlaceholder === "string" ? res.freeInputPlaceholder : "告诉我你的想法...",
    pathUnlocks,
    quests,
    questUpdates: Array.isArray(res.questUpdates) ? res.questUpdates : [],
    attributeChanges: (res.attributeChanges as AIResponse["attributeChanges"]) || {
      courage: 0, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0,
    },
    emotionalState: (res.emotionalState as AIResponse["emotionalState"]) || { primary: "neutral", intensity: 50 },
    userProfileUpdates: res.userProfileUpdates as AIResponse["userProfileUpdates"],
  };
}

// 动态生成模拟响应 - 根据用户输入生成个性化的回复
function generateDynamicMockResponse(userMessage: string, context: DialogueContext): AIResponse {
  const lowerMessage = userMessage.toLowerCase();
  
  // 提取用户的关键信息
  const userWords = lowerMessage.split(/[，。！？、\s]+/).filter(w => w.length > 1);
  const uniqueWords = [...new Set(userWords)].slice(0, 5);
  
  // 生成个性化的路线名称
  const pathName = generateUniquePathName(userMessage, uniqueWords);
  const pathDescription = generateUniquePathDescription(userMessage, uniqueWords);
  
  // 生成个性化的任务
  const quest = generateUniqueQuest(userMessage, uniqueWords);
  
  // 生成场景描写
  const narrative = generateUniqueNarrative(userMessage, uniqueWords);
  
  return {
    narrative,
    scene: generateUniqueScene(userMessage, uniqueWords),
    actions: generateDynamicActions(userMessage),
    freeInputPlaceholder: generateUniquePlaceholder(userMessage),
    pathUnlocks: [
      {
        id: `path_${Date.now()}`,
        name: pathName,
        description: pathDescription,
        trigger: "开始探索",
      },
    ],
    quests: [quest],
    questUpdates: [],
    attributeChanges: { courage: 1, wisdom: 1, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 },
    emotionalState: { primary: "curious", intensity: 60 },
  };
}

// 生成唯一的路线名称
function generateUniquePathName(userMessage: string, keywords: string[]): string {
  const templates = [
    `${keywords[0] || '探索'}之路`,
    `从${keywords[0] || '现在'}到${keywords[1] || '未来'}`,
    `${keywords[0] || '梦想'}的${keywords[1] || '旅程'}`,
    `寻找${keywords[0] || '答案'}`,
    `${keywords[0] || '突破'}的可能`,
  ];
  
  const index = Math.abs(hashCode(userMessage)) % templates.length;
  return templates[index];
}

// 生成唯一的路线描述
function generateUniquePathDescription(userMessage: string, keywords: string[]): string {
  const templates = [
    `探索${keywords[0] || '这个领域'}的无限可能，找到属于你的道路`,
    `从${keywords[0] || '现在'}出发，一步步接近${keywords[1] || '目标'}`,
    `在${keywords[0] || '这个旅程'}中发现真实的自己`,
    `勇敢面对${keywords[0] || '挑战'}，创造${keywords[1] || '精彩'}人生`,
    `用行动证明${keywords[0] || '梦想'}是可以实现的`,
  ];
  
  const index = Math.abs(hashCode(userMessage + "desc")) % templates.length;
  return templates[index];
}

// 生成唯一的任务
function generateUniqueQuest(userMessage: string, keywords: string[]): {id: string; title: string; narrative: string; description: string; difficulty: number; estimatedMinutes: number; type: "main" | "side" | "hidden" | "emergency"; acceptanceCriteria: string[]; attributeRewards: {courage: number; wisdom: number; empathy: number; creativity: number; resilience: number; communication: number; execution: number}} {
  const templates = [
    {
      title: `探索${keywords[0] || '可能性'}`,
      narrative: `开始你的探索之旅`,
      description: `花15分钟思考${keywords[0] || '这个问题'}对你意味着什么`,
    },
    {
      title: `迈出第一步`,
      narrative: `行动是最好的答案`,
      description: `今天做一件与${keywords[0] || '目标'}相关的小事`,
    },
    {
      title: `写下你的想法`,
      narrative: `把模糊的想法变成清晰的文字`,
      description: `花10分钟写下你对${keywords[0] || '这件事'}的真实感受`,
    },
  ];
  
  const index = Math.abs(hashCode(userMessage + "quest")) % templates.length;
  const template = templates[index];
  
  return {
    id: `quest_${Date.now()}`,
    ...template,
    difficulty: 1,
    estimatedMinutes: 15,
    type: "side",
    acceptanceCriteria: ["完成任务"],
    attributeRewards: { courage: 1, wisdom: 1, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 },
  };
}

// 生成唯一的场景描写
function generateUniqueNarrative(userMessage: string, keywords: string[]): string {
  const scenes = [
    `窗外的夜色渐深，你坐在书桌前，思绪万千。手机屏幕还亮着刚才搜索的"${keywords[0] || '问题'}"，各种答案在脑海中闪过。你深吸一口气，决定认真面对这个问题。`,
    `阳光透过窗帘洒在你的脸上，你睁开眼睛，新的一天开始了。昨晚的梦里，你看到了${keywords[0] || '未来的自己'}，那是一个充满可能的场景。你决定从今天开始，做一些改变。`,
    `咖啡馆里，你独自坐在角落，手中的咖啡已经凉了。窗外的人群匆匆走过，每个人都有自己的方向。而你，还在思考${keywords[0] || '这个问题'}。你打开笔记本，决定写下自己的想法。`,
    `深夜的图书馆，灯光有些刺眼。你面前摊开着各种资料，但你的思绪却飘向了${keywords[0] || '远方'}。你想起小时候的梦想，那时候觉得一切皆有可能。现在，你决定重新找回那种感觉。`,
  ];
  
  const index = Math.abs(hashCode(userMessage + "scene")) % scenes.length;
  return scenes[index];
}

// 生成唯一的场景
function generateUniqueScene(userMessage: string, keywords: string[]): {location: string; time: string; atmosphere: string; description: string; characters: string[]} {
  const locations = ["书桌前", "咖啡馆", "图书馆", "公园长椅", "窗边"];
  const times = ["深夜", "清晨", "傍晚", "午后", "黄昏"];
  const atmospheres = ["沉思而专注", "宁静而充满希望", "温暖而期待", "孤独而坚定", "迷茫而勇敢"];
  
  const index = Math.abs(hashCode(userMessage + "scene")) % locations.length;
  
  return {
    location: locations[index],
    time: times[index],
    atmosphere: atmospheres[index],
    description: `窗外的景色变换，你的思绪在${keywords[0] || '这个问题'}上徘徊`,
    characters: [],
  };
}

// 生成唯一的占位符
function generateUniquePlaceholder(userMessage: string): string {
  const placeholders = [
    "告诉我你的想法...",
    "你有什么感受？",
    "你想怎么做？",
    "你觉得呢？",
    "告诉我更多...",
  ];
  
  const index = Math.abs(hashCode(userMessage + "placeholder")) % placeholders.length;
  return placeholders[index];
}

// 动态生成动作
function generateDynamicActions(userMessage: string): Array<{id: string; label: string; description: string; risk: "low" | "medium" | "high"}> {
  return [
    { id: "explore", label: "探索", description: "深入了解", risk: "low" },
    { id: "act", label: "行动", description: "开始做", risk: "medium" },
    { id: "reflect", label: "反思", description: "想想自己", risk: "low" },
  ];
}

// 动态生成任务
function generateDynamicQuests(userMessage: string, context: DialogueContext): Array<{id: string; title: string; narrative: string; description: string; difficulty: number; estimatedMinutes: number; type: string; acceptanceCriteria: string[]; attributeRewards: {courage: number; wisdom: number; empathy: number; creativity: number; resilience: number; communication: number; execution: number}}> {
  return [
    {
      id: `quest_${Date.now()}`,
      title: "探索你的选择",
      narrative: "认真思考你想要什么",
      description: "花10分钟写下你的想法",
      difficulty: 1,
      estimatedMinutes: 10,
      type: "side",
      acceptanceCriteria: ["写下想法"],
      attributeRewards: { courage: 1, wisdom: 1, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
    },
  ];
}

// 动态生成路线解锁
function generateDynamicPathUnlocks(userMessage: string, context: DialogueContext): Array<{id: string; name: string; description: string; trigger: string}> {
  const keywords = userMessage.split(/[，。！？、\s]+/).filter(w => w.length > 1).slice(0, 3);
  const pathName = generateUniquePathName(userMessage, keywords);
  const pathDescription = generateUniquePathDescription(userMessage, keywords);
  
  return [
    {
      id: `path_${Date.now()}`,
      name: pathName,
      description: pathDescription,
      trigger: "开始探索",
    },
  ];
}

// 哈希函数
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
