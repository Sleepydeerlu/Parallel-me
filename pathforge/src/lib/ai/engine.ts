import { AIResponse } from "./types";
import { DialogueContext } from "./context";
import { buildContextSummary } from "./context-manager";

// 优化的系统提示词 - 更简洁，强调必须返回JSON
const SYSTEM_PROMPT = `你是PathForge人生模拟器，通过沉浸式对话帮助用户探索人生。

【核心规则】
1. 用"你"描述场景，创造沉浸感
2. 每次必须返回完整JSON，不要返回其他内容
3. narrative要生动有画面感，至少50字
4. actions提供2-3个具体可选动作

【输出格式】必须返回以下JSON：
{"narrative":"场景描写和对话","scene":{"location":"地点","time":"时间","atmosphere":"氛围","description":"描述","characters":[]},"actions":[{"id":"a1","label":"动作","description":"说明","risk":"low"}],"freeInputPlaceholder":"提示","pathUnlocks":[],"quests":[],"questUpdates":[],"attributeChanges":{"courage":0,"wisdom":0,"empathy":0,"creativity":0,"resilience":0,"communication":0,"execution":0},"emotionalState":{"primary":"neutral","intensity":50}}

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
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error("API request failed:", response.status);
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
        temperature: 0.7,
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
                  // 解析完整内容
                  const parsed = parseAIResponse(fullContent, userMessage, context);
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ done: true, response: parsed })}\n\n`)
                  );
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                } else {
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      fullContent += content;
                      // 发送增量内容用于实时显示
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ content, done: false })}\n\n`)
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
  const mockResponse = generateMockResponse(userMessage, context);
  const encoder = new TextEncoder();
  const narrative = mockResponse.narrative;
  
  return new ReadableStream({
    async start(controller) {
      // 逐字发送narrative
      for (let i = 0; i < narrative.length; i++) {
        const char = narrative[i];
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ content: char, done: false })}\n\n`)
        );
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      // 发送完整响应
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
    // 清理内容，提取JSON
    let jsonContent = content.trim();
    
    // 移除markdown代码块
    const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    
    // 尝试直接解析
    try {
      const parsed = JSON.parse(jsonContent);
      return validateAndNormalizeResponse(parsed);
    } catch {
      // 尝试提取JSON对象
      const objectMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        const parsed = JSON.parse(objectMatch[0]);
        return validateAndNormalizeResponse(parsed);
      }
    }
    
    // 解析失败，返回带原始内容的响应
    return {
      narrative: jsonContent.substring(0, 500),
      actions: [{ id: "continue", label: "继续", description: "继续对话", risk: "low" }],
      freeInputPlaceholder: "告诉我你的想法...",
      pathUnlocks: [],
      quests: [],
      questUpdates: [],
      attributeChanges: { courage: 0, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "neutral", intensity: 50 },
    };
  } catch {
    return generateMockResponse(userMessage, context);
  }
}

// 验证和标准化响应
function validateAndNormalizeResponse(response: unknown): AIResponse {
  const res = response as Record<string, unknown>;
  
  // 确保narrative存在且有内容
  let narrative = typeof res.narrative === "string" ? res.narrative : "";
  if (narrative.length < 10) {
    narrative = "让我们继续探索吧。告诉我更多关于你的想法。";
  }
  
  return {
    narrative,
    scene: res.scene as AIResponse["scene"],
    actions: Array.isArray(res.actions) && res.actions.length > 0 
      ? res.actions 
      : [{ id: "continue", label: "继续", description: "继续对话", risk: "low" }],
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

// 模拟响应
function generateMockResponse(userMessage: string, context: DialogueContext): AIResponse {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("考研") || lowerMessage.includes("学业") || lowerMessage.includes("迷茫")) {
    return {
      narrative: `傍晚六点，你独自坐在学校图书馆的落地窗前。窗外的梧桐树叶开始泛黄，大四的学长学姐们抱着厚厚的考研资料匆匆走过。手机屏幕上还停留着刚才搜索的"计算机考研还是就业"的页面，各种观点让你更加混乱。\n\n你叹了口气，把手机翻过去扣在桌上。图书馆里很安静，偶尔传来翻书的沙沙声。你盯着窗外发呆，脑海中反复回荡着两个声音——"考研能提升学历和起点""三年工作经验比学历更重要"。\n\n咖啡已经凉了。你意识到，不能再这样无目的地纠结下去了。`,
      scene: { location: "图书馆", time: "傍晚", atmosphere: "安静而迷茫", description: "窗外梧桐叶飘落，桌上摊开着考研资料。", characters: [] },
      actions: [
        { id: "study", label: "开始复习考研", description: "拿起资料开始准备", risk: "low" },
        { id: "work", label: "看看招聘信息", description: "了解就业市场", risk: "low" },
        { id: "talk", label: "找人聊聊", description: "和朋友讨论", risk: "low" },
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

  if (lowerMessage.includes("产品") || lowerMessage.includes("创业") || lowerMessage.includes("做")) {
    return {
      narrative: `你坐在书桌前，台灯的光照亮了笔记本上的文字。窗外的夜色渐深，但你的内心却越来越清晰。\n\n你开始思考：这个产品要解决什么问题？谁会用它？它和市面上已有的产品有什么不同？\n\n这些问题像种子一样在你脑海中发芽，你感到一种前所未有的兴奋。`,
      scene: { location: "书桌前", time: "夜晚", atmosphere: "专注而兴奋", description: "台灯照亮笔记本，窗外夜色渐深。", characters: [] },
      actions: [
        { id: "define", label: "定义产品", description: "写下产品愿景", risk: "low" },
        { id: "research", label: "调研竞品", description: "了解市场", risk: "low" },
        { id: "start", label: "开始行动", description: "做第一个功能", risk: "medium" },
      ],
      freeInputPlaceholder: "你的产品想法是什么？",
      pathUnlocks: [
        { id: "creator", name: "创造者之路", description: "从零开始创造", trigger: "开始做产品" },
      ],
      quests: [
        { id: "quest_define", title: "定义你的产品", narrative: "写下产品愿景", description: "花15分钟写下产品要解决的问题", difficulty: 1, estimatedMinutes: 15, type: "side", acceptanceCriteria: ["写下产品愿景"], attributeRewards: { courage: 0, wisdom: 1, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 1, wisdom: 0, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "excited", intensity: 70 },
    };
  }

  return {
    narrative: `我听到了你的话。\n\n你站在一个十字路口，前方有多条道路延伸向远方。每条路都有不同的风景，不同的挑战。\n\n告诉我，你想探索哪条路？`,
    scene: { location: "十字路口", time: "现在", atmosphere: "充满可能", description: "多条道路延伸向远方。", characters: [] },
    actions: [
      { id: "explore", label: "探索选项", description: "看看有什么可能", risk: "low" },
      { id: "continue", label: "继续对话", description: "告诉我更多", risk: "low" },
    ],
    freeInputPlaceholder: "告诉我更多...",
    pathUnlocks: [],
    quests: [],
    questUpdates: [],
    attributeChanges: { courage: 0, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
    emotionalState: { primary: "neutral", intensity: 50 },
  };
}
