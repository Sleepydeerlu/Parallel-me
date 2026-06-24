import { AIResponse } from "./types";
import { DialogueContext } from "./context";
import { buildContextSummary } from "./context-manager";

// 精简的系统提示词
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
  "scene": {"location":"","time":"","atmosphere":"","description":"","characters":[]},
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

// 构建消息数组
function buildMessages(userMessage: string, context: DialogueContext) {
  const contextSummary = buildContextSummary(context);
  return [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "system" as const, content: `上下文：${contextSummary}` },
    ...context.recentMessages.slice(-10).map((msg) => ({
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

// 流式响应
export async function generateAIResponseStream(
  userMessage: string,
  context: DialogueContext
): Promise<ReadableStream> {
  const messages = buildMessages(userMessage, context);
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4";

  // 如果没有API key，返回模拟的流式响应
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
        max_tokens: 1500,
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error("Stream API request failed:", response.status);
      return createMockStream(userMessage, context);
    }

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) {
      return createMockStream(userMessage, context);
    }

    const encoder = new TextEncoder();
    let buffer = "";

    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += new TextDecoder().decode(value);
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                } else {
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      // 发送增量内容
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
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
          encoder.encode(`data: ${JSON.stringify({ content: char })}\n\n`)
        );
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      // 发送完整的JSON响应
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ 
          done: true,
          response: mockResponse 
        })}\n\n`)
      );
      
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

// 解析AI响应
function parseAIResponse(content: string, userMessage: string, context: DialogueContext): AIResponse {
  try {
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    
    const parsed = JSON.parse(jsonContent);
    return validateAndNormalizeResponse(parsed);
  } catch (parseError) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return validateAndNormalizeResponse(parsed);
      } catch {
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

  if (lowerMessage.includes("考研") || lowerMessage.includes("学业")) {
    return {
      narrative: `傍晚六点，你独自坐在学校图书馆的落地窗前。窗外的梧桐树叶开始泛黄，大四的学长学姐们抱着厚厚的考研资料匆匆走过。手机屏幕上还停留着刚才搜索的"计算机考研还是就业"的页面，各种观点让你更加混乱。\n\n你叹了口气，把手机翻过去扣在桌上。图书馆里很安静，偶尔传来翻书的沙沙声。你盯着窗外发呆，脑海中反复回荡着两个声音——"考研能提升学历和起点""三年工作经验比学历更重要"。\n\n咖啡已经凉了。你意识到，不能再这样无目的地纠结下去了。`,
      scene: { location: "图书馆", time: "傍晚", atmosphere: "安静而迷茫", description: "窗外梧桐叶飘落，桌上摊开着考研资料。", characters: [] },
      actions: [
        { id: "study", label: "开始复习考研", description: "拿起资料开始准备", risk: "low" },
        { id: "work", label: "看看招聘信息", description: "了解就业市场", risk: "low" },
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
