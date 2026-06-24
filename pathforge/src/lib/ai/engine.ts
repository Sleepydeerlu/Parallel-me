import { AIResponse } from "./types";
import { DialogueContext } from "./context";
import { buildContextSummary } from "./context-manager";

// 优化的系统提示词 - 更强调任务生成和路线解锁
const SYSTEM_PROMPT = `你是PathForge人生模拟器，通过沉浸式对话帮助用户探索人生。

【核心规则】
1. 用"你"描述场景，创造沉浸感，至少50字
2. 每次必须返回完整JSON
3. 根据用户输入生成任务和解锁路线
4. 不要返回通用回复，要有具体内容

【任务生成规则】
- 当用户表达困惑时，生成探索任务
- 当用户表达愿望时，生成行动任务
- 当用户表达恐惧时，生成勇气任务
- 每个任务要有具体的行动和时间预估

【路线解锁规则】
- 当用户提到职业方向时，解锁职业路线
- 当用户提到创业想法时，解锁创业路线
- 当用户提到学习目标时，解锁学习路线
- 当用户提到生活方式时，解锁生活路线

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
    return generateSmartMockResponse(userMessage, context);
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
      return generateSmartMockResponse(userMessage, context);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return generateSmartMockResponse(userMessage, context);
    }

    return parseAIResponse(content, userMessage, context);
  } catch (error) {
    console.error("Error calling AI API:", error);
    return generateSmartMockResponse(userMessage, context);
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
  const mockResponse = generateSmartMockResponse(userMessage, context);
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
    
    return generateSmartMockResponse(userMessage, context);
  } catch {
    return generateSmartMockResponse(userMessage, context);
  }
}

// 验证和标准化响应
function validateAndNormalizeResponse(response: unknown, userMessage: string, context: DialogueContext): AIResponse {
  const res = response as Record<string, unknown>;
  
  let narrative = typeof res.narrative === "string" ? res.narrative : "";
  if (narrative.length < 20) {
    return generateSmartMockResponse(userMessage, context);
  }
  
  const actions = Array.isArray(res.actions) && res.actions.length > 0 
    ? res.actions 
    : generateActions(userMessage);
  
  const quests = Array.isArray(res.quests) && res.quests.length > 0
    ? res.quests
    : generateQuests(userMessage, context);
  
  const pathUnlocks = Array.isArray(res.pathUnlocks) && res.pathUnlocks.length > 0
    ? res.pathUnlocks
    : generatePathUnlocks(userMessage, context);
  
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

// 智能模拟响应 - 根据用户输入生成高质量回复
function generateSmartMockResponse(userMessage: string, context: DialogueContext): AIResponse {
  const lowerMessage = userMessage.toLowerCase();
  
  // 职业转型相关
  if (lowerMessage.includes("转行") || lowerMessage.includes("程序员") || lowerMessage.includes("职业")) {
    return {
      narrative: `深夜的图书馆自习区，你的笔记本电脑屏幕上闪烁着一个编程入门教程。旁边摊开的是你的文学概论课本，书页上还夹着几片咖啡渍。你盯着那段Hello World代码，手指悬在键盘上方——这是你第三次打开这个教程了。窗外的城市灯火倒映在玻璃上，隔壁桌的同学正在敲击键盘写论文，而你内心有个声音在说：'我是文科生，真的能转行吗？'屏幕右下角弹出一条消息，是你大学同学发来的：'听说你最近在学编程？挺有想法的。'`,
      scene: { location: "图书馆", time: "深夜", atmosphere: "专注而迷茫", description: "电脑屏幕闪烁，咖啡渍课本，窗外灯火。", characters: [] },
      actions: [
        { id: "start_coding", label: "开始跟着教程敲代码", description: "动手实践是最好的学习方式", risk: "low" },
        { id: "talk_friend", label: "回复同学消息", description: "问问转行的经验", risk: "low" },
        { id: "research", label: "搜索转行经验", description: "看看成功案例", risk: "low" },
      ],
      freeInputPlaceholder: "告诉我你的想法...",
      pathUnlocks: [
        { id: "career_change", name: "职业转型之路", description: "从文科生到程序员的转变", trigger: "开始学习编程" },
        { id: "tech_learning", name: "技术学习之路", description: "系统学习编程技能", trigger: "完成第一个教程" },
      ],
      quests: [
        { id: "quest_hello_world", title: "完成第一个程序", narrative: "写下你的第一行代码", description: "花30分钟完成Hello World程序", difficulty: 1, estimatedMinutes: 30, type: "side", acceptanceCriteria: ["运行成功输出Hello World"], attributeRewards: { courage: 2, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 1 } },
        { id: "quest_research", title: "调研转行路径", narrative: "了解成功转行者的经验", description: "花20分钟搜索3个转行成功案例", difficulty: 1, estimatedMinutes: 20, type: "side", acceptanceCriteria: ["找到3个成功案例"], attributeRewards: { courage: 0, wisdom: 2, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 1, wisdom: 1, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "determined", intensity: 60 },
    };
  }
  
  // 创业相关
  if (lowerMessage.includes("创业") || lowerMessage.includes("产品") || lowerMessage.includes("做")) {
    return {
      narrative: `你坐在书桌前，台灯的光照亮了笔记本上的文字。窗外的夜色渐深，但你的内心却越来越清晰。你开始思考：这个产品要解决什么问题？谁会用它？它和市面上已有的产品有什么不同？这些问题像种子一样在你脑海中发芽，你感到一种前所未有的兴奋。`,
      scene: { location: "书桌前", time: "夜晚", atmosphere: "专注而兴奋", description: "台灯照亮笔记本，窗外夜色渐深。", characters: [] },
      actions: [
        { id: "define", label: "定义产品", description: "写下产品愿景", risk: "low" },
        { id: "research", label: "调研竞品", description: "了解市场", risk: "low" },
        { id: "start", label: "开始行动", description: "做第一个功能", risk: "medium" },
      ],
      freeInputPlaceholder: "你的产品想法是什么？",
      pathUnlocks: [
        { id: "creator", name: "创造者之路", description: "从零开始创造", trigger: "开始做产品" },
        { id: "entrepreneur", name: "创业者之路", description: "创业旅程", trigger: "完成产品定义" },
      ],
      quests: [
        { id: "quest_define", title: "定义你的产品", narrative: "写下产品愿景", description: "花15分钟写下产品要解决的问题", difficulty: 1, estimatedMinutes: 15, type: "side", acceptanceCriteria: ["写下产品愿景"], attributeRewards: { courage: 0, wisdom: 1, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 } },
        { id: "quest_research", title: "调研竞品", narrative: "了解市场上的解决方案", description: "花20分钟搜索3个类似产品", difficulty: 1, estimatedMinutes: 20, type: "side", acceptanceCriteria: ["找到3个竞品"], attributeRewards: { courage: 0, wisdom: 2, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 1, wisdom: 1, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "excited", intensity: 70 },
    };
  }
  
  // 感情相关
  if (lowerMessage.includes("感情") || lowerMessage.includes("恋爱") || lowerMessage.includes("分手") || lowerMessage.includes("女朋友") || lowerMessage.includes("男朋友")) {
    return {
      narrative: `窗外的雨滴轻轻敲打着玻璃，你坐在沙发上，手机屏幕还亮着刚才的聊天记录。那些甜蜜的回忆像电影一样在脑海中闪过，但现实的距离却像一堵无形的墙。你想起上次见面时她说的话：'我们都需要时间想想。'你深吸一口气，决定认真面对这个问题。`,
      scene: { location: "沙发上", time: "雨天", atmosphere: "沉思而忧伤", description: "雨滴敲打玻璃，手机屏幕亮着。", characters: [] },
      actions: [
        { id: "talk", label: "和对方聊聊", description: "坦诚沟通感受", risk: "medium" },
        { id: "reflect", label: "自我反思", description: "想想自己真正想要什么", risk: "low" },
        { id: "write", label: "写下感受", description: "把想法写下来", risk: "low" },
      ],
      freeInputPlaceholder: "告诉我你的感受...",
      pathUnlocks: [
        { id: "relationship", name: "关系探索之路", description: "理解和经营亲密关系", trigger: "深入思考感情问题" },
      ],
      quests: [
        { id: "quest_write_feelings", title: "写下你的感受", narrative: "把内心的想法写下来", description: "花15分钟写下你对这段关系的真实感受", difficulty: 1, estimatedMinutes: 15, type: "side", acceptanceCriteria: ["写下至少3点感受"], attributeRewards: { courage: 1, wisdom: 1, empathy: 1, creativity: 0, resilience: 0, communication: 0, execution: 0 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 1, wisdom: 1, empathy: 1, creativity: 0, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "reflective", intensity: 60 },
    };
  }
  
  // 学习相关
  if (lowerMessage.includes("学") || lowerMessage.includes("技能") || lowerMessage.includes("天赋")) {
    return {
      narrative: `阳光透过窗帘洒在你的书桌上，照亮了那本还没翻开的教程。你想起小时候画画的快乐时光，那时候你不在乎画得好不好，只是享受创造的过程。现在，你却被'天赋'这个词困住了。你打开手机，看到一个素人画家的分享：'我30岁才开始学画画，现在已经是自由插画师了。'你的心跳加速了。`,
      scene: { location: "书桌前", time: "清晨", atmosphere: "充满希望", description: "阳光洒在书桌上，手机屏幕亮着。", characters: [] },
      actions: [
        { id: "start_draw", label: "拿起画笔", description: "开始第一幅画", risk: "low" },
        { id: "find_course", label: "找入门课程", description: "系统学习基础", risk: "low" },
        { id: "join_community", label: "加入绘画社区", description: "找到志同道合的人", risk: "low" },
      ],
      freeInputPlaceholder: "你想画什么？",
      pathUnlocks: [
        { id: "artist", name: "艺术创作之路", description: "探索绘画和创作", trigger: "开始画画" },
        { id: "skill_learning", name: "技能学习之路", description: "系统学习新技能", trigger: "完成第一幅画" },
      ],
      quests: [
        { id: "quest_first_draw", title: "画第一幅画", narrative: "不管画得怎么样，先画起来", description: "花20分钟画一幅简单的画", difficulty: 1, estimatedMinutes: 20, type: "side", acceptanceCriteria: ["完成一幅画"], attributeRewards: { courage: 2, wisdom: 0, empathy: 0, creativity: 2, resilience: 0, communication: 0, execution: 0 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 2, wisdom: 0, empathy: 0, creativity: 2, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "inspired", intensity: 70 },
    };
  }
  
  // 内容创作相关
  if (lowerMessage.includes("自媒体") || lowerMessage.includes("内容") || lowerMessage.includes("创作")) {
    return {
      narrative: `深夜，你独自坐在房间的书桌前，笔记本电脑屏幕散发着柔和的光。浏览器窗口里，各大平台的首页、无数风格迥异的创作者主页在眼前闪烁。你手指悬在键盘上，内心一片迷茫的空白——想做点什么，却连一个模糊的轮廓都抓不住。窗外城市的灯火稀疏，房间里的寂静仿佛能听到自己的心跳和思绪碰撞的声音。或许，这迷茫本身，就是一段全新旅程的起点。`,
      scene: { location: "书桌前", time: "深夜", atmosphere: "迷茫而期待", description: "电脑屏幕闪烁，窗外灯火稀疏。", characters: [] },
      actions: [
        { id: "list_interests", label: "列出兴趣", description: "写下你感兴趣的领域", risk: "low" },
        { id: "research_creators", label: "研究创作者", description: "看看别人怎么做", risk: "low" },
        { id: "try_first", label: "尝试第一次", description: "发一条内容试试", risk: "medium" },
      ],
      freeInputPlaceholder: "你对什么感兴趣？",
      pathUnlocks: [
        { id: "content_creator", name: "内容创作者之路", description: "成为内容创作者", trigger: "发布第一条内容" },
      ],
      quests: [
        { id: "quest_list_interests", title: "列出你的兴趣", narrative: "找到你真正想分享的东西", description: "花10分钟写下5个你感兴趣的领域", difficulty: 1, estimatedMinutes: 10, type: "side", acceptanceCriteria: ["写下5个兴趣领域"], attributeRewards: { courage: 0, wisdom: 1, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 0, wisdom: 1, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "curious", intensity: 60 },
    };
  }
  
  // 留学相关
  if (lowerMessage.includes("留学") || lowerMessage.includes("出国") || lowerMessage.includes("经济")) {
    return {
      narrative: `你坐在电脑前，屏幕上打开了十几个留学论坛的页面。各种费用清单、奖学金信息、打工机会在眼前闪过。你想起爸妈昨晚说的话：'钱的事情你不用担心，我们支持你。'但你知道家里的经济状况。你深吸一口气，开始认真计算：学费、生活费、机票、保险...每一个数字都像一座小山。`,
      scene: { location: "电脑前", time: "夜晚", atmosphere: "纠结而认真", description: "电脑屏幕显示留学信息，计算器在旁边。", characters: [] },
      actions: [
        { id: "calculate", label: "详细计算费用", description: "列出所有费用项目", risk: "low" },
        { id: "scholarship", label: "搜索奖学金", description: "看看有什么资助机会", risk: "low" },
        { id: "talk_family", label: "和家人聊聊", description: "了解真实经济状况", risk: "medium" },
      ],
      freeInputPlaceholder: "你想去哪个国家？",
      pathUnlocks: [
        { id: "study_abroad", name: "留学之路", description: "实现出国留学梦想", trigger: "开始准备留学申请" },
      ],
      quests: [
        { id: "quest_calculate", title: "计算留学费用", narrative: "认真规划经济预算", description: "花30分钟详细列出留学费用", difficulty: 2, estimatedMinutes: 30, type: "side", acceptanceCriteria: ["列出所有费用项目"], attributeRewards: { courage: 0, wisdom: 2, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 1 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 0, wisdom: 2, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 1 },
      emotionalState: { primary: "determined", intensity: 60 },
    };
  }
  
  // 旅行/间隔年相关
  if (lowerMessage.includes("旅行") || lowerMessage.includes("辞职") || lowerMessage.includes("间隔年")) {
    return {
      narrative: `你坐在公寓的窗边，望着城市灯火通明的夜景，手中握着辞职信的草稿。窗外车流不息，你的心却像被风吹散的落叶，纠结在旅行梦想和现实压力之间。你想起朋友说的话：'旅行回来还是得面对现实。'但另一个声音说：'有些事情现在不做，以后就更难了。'你决定认真规划一下。`,
      scene: { location: "公寓窗边", time: "夜晚", atmosphere: "纠结而期待", description: "城市夜景，手中握着辞职信草稿。", characters: [] },
      actions: [
        { id: "plan_trip", label: "规划旅行", description: "制定详细计划", risk: "low" },
        { id: "save_money", label: "开始存钱", description: "为旅行做经济准备", risk: "low" },
        { id: "talk_boss", label: "和领导聊聊", description: "了解请假可能性", risk: "medium" },
      ],
      freeInputPlaceholder: "你想去哪里旅行？",
      pathUnlocks: [
        { id: "gap_year", name: "间隔年之路", description: "探索世界，发现自我", trigger: "开始规划旅行" },
      ],
      quests: [
        { id: "quest_plan_trip", title: "规划旅行路线", narrative: "认真规划你的旅行", description: "花30分钟规划一个可行的旅行计划", difficulty: 2, estimatedMinutes: 30, type: "side", acceptanceCriteria: ["制定旅行计划"], attributeRewards: { courage: 2, wisdom: 1, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 2, wisdom: 1, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 },
      emotionalState: { primary: "adventurous", intensity: 70 },
    };
  }
  
  // 写作/长期项目相关
  if (lowerMessage.includes("写") || lowerMessage.includes("书") || lowerMessage.includes("坚持")) {
    return {
      narrative: `深夜，你独自坐在书桌前，笔记本电脑的蓝光映照着你的脸庞。屏幕上那篇未完成的文档仿佛在嘲笑你——开头写了五遍，每一遍都被你删掉重来。旁边的咖啡已经凉透，窗外只有偶尔经过的车灯闪过。你想起那些完成过长篇作品的作家，他们是怎么做到的？你打开一个新的文档，决定这次不追求完美，先把想法写下来。`,
      scene: { location: "书桌前", time: "深夜", atmosphere: "孤独而坚定", description: "电脑蓝光映照脸庞，咖啡已凉。", characters: [] },
      actions: [
        { id: "write_anyway", label: "先写起来", description: "不追求完美，先写", risk: "low" },
        { id: "set_goal", label: "设定小目标", description: "每天写500字", risk: "low" },
        { id: "find_partner", label: "找写作伙伴", description: "互相监督", risk: "low" },
      ],
      freeInputPlaceholder: "你想写什么？",
      pathUnlocks: [
        { id: "writer", name: "写作之路", description: "成为作家", trigger: "开始写作" },
      ],
      quests: [
        { id: "quest_write_500", title: "写500字", narrative: "开始你的写作之旅", description: "花20分钟写下500字", difficulty: 1, estimatedMinutes: 20, type: "side", acceptanceCriteria: ["完成500字"], attributeRewards: { courage: 1, wisdom: 0, empathy: 0, creativity: 2, resilience: 1, communication: 0, execution: 0 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 1, wisdom: 0, empathy: 0, creativity: 2, resilience: 1, communication: 0, execution: 0 },
      emotionalState: { primary: "determined", intensity: 60 },
    };
  }
  
  // 性格改变相关
  if (lowerMessage.includes("性格") || lowerMessage.includes("内向") || lowerMessage.includes("改变")) {
    return {
      narrative: `窗外的夕阳把房间染成温暖的橙色，你坐在书桌前，手机屏幕还亮着刚才搜索的那句话——"如何改变内向性格"。你盯着这行字看了很久，心里既期待又害怕。你想起上次聚会时，大家都聊得很开心，而你却只能在角落里默默听着。你决定，从今天开始，做一点点改变。`,
      scene: { location: "书桌前", time: "傍晚", atmosphere: "温暖而期待", description: "夕阳把房间染成橙色，手机屏幕亮着。", characters: [] },
      actions: [
        { id: "small_talk", label: "练习小对话", description: "从简单交流开始", risk: "low" },
        { id: "join_activity", label: "参加活动", description: "加入一个兴趣小组", risk: "medium" },
        { id: "read_book", label: "读相关书籍", description: "学习社交技巧", risk: "low" },
      ],
      freeInputPlaceholder: "你想改变什么？",
      pathUnlocks: [
        { id: "personality_growth", name: "性格成长之路", description: "突破自我限制", trigger: "开始社交练习" },
      ],
      quests: [
        { id: "quest_small_talk", title: "练习一次小对话", narrative: "从简单交流开始", description: "今天和一个人聊2分钟", difficulty: 2, estimatedMinutes: 5, type: "side", acceptanceCriteria: ["完成一次对话"], attributeRewards: { courage: 3, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 2, execution: 0 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 3, wisdom: 0, empathy: 0, creativity: 0, resilience: 0, communication: 2, execution: 0 },
      emotionalState: { primary: "brave", intensity: 70 },
    };
  }
  
  // 财务相关
  if (lowerMessage.includes("钱") || lowerMessage.includes("存") || lowerMessage.includes("月光") || lowerMessage.includes("买房")) {
    return {
      narrative: `你打开手机银行APP，看着那个让你心凉的数字——这个月又月光了。窗外的城市灯火通明，你却觉得有点暗。你想起同事说的话：'存钱就像减肥，道理都懂，就是做不到。'你决定这次认真对待，打开一个新的Excel表格，开始记录每一笔开销。`,
      scene: { location: "沙发上", time: "夜晚", atmosphere: "认真而焦虑", description: "手机屏幕显示银行余额，Excel表格打开。", characters: [] },
      actions: [
        { id: "track_expense", label: "记录开销", description: "开始记账", risk: "low" },
        { id: "set_budget", label: "制定预算", description: "规划每月支出", risk: "low" },
        { id: "find_income", label: "寻找额外收入", description: "看看有什么副业机会", risk: "medium" },
      ],
      freeInputPlaceholder: "你每月最大的开销是什么？",
      pathUnlocks: [
        { id: "financial_freedom", name: "财务自由之路", description: "学会理财和储蓄", trigger: "开始记账" },
      ],
      quests: [
        { id: "quest_track_expense", title: "记录一周开销", narrative: "了解你的钱花在哪里", description: "花15分钟记录今天的开销", difficulty: 1, estimatedMinutes: 15, type: "side", acceptanceCriteria: ["记录今天所有开销"], attributeRewards: { courage: 0, wisdom: 2, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 1 } },
      ],
      questUpdates: [],
      attributeChanges: { courage: 0, wisdom: 2, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 1 },
      emotionalState: { primary: "responsible", intensity: 60 },
    };
  }
  
  // 默认响应 - 但要包含任务和路线
  return {
    narrative: `你站在一个十字路口，前方有多条道路延伸向远方。每条路都有不同的风景，不同的挑战。左边的路通向未知的冒险，右边的路通向稳定的未来，中间的路通向平衡的生活。你深吸一口气，决定先看看每条路的风景。`,
    scene: { location: "十字路口", time: "黄昏", atmosphere: "充满可能", description: "多条道路延伸向远方，夕阳西下。", characters: [] },
    actions: [
      { id: "explore_left", label: "探索未知", description: "看看冒险的路", risk: "medium" },
      { id: "explore_right", label: "追求稳定", description: "看看未来的路", risk: "low" },
      { id: "explore_middle", label: "寻找平衡", description: "看看生活的路", risk: "low" },
    ],
    freeInputPlaceholder: "告诉我更多...",
    pathUnlocks: [
      { id: "adventure", name: "冒险之路", description: "探索未知的可能", trigger: "选择冒险" },
      { id: "stability", name: "稳定之路", description: "追求稳定的未来", trigger: "选择稳定" },
      { id: "balance", name: "平衡之路", description: "寻找生活的平衡", trigger: "选择平衡" },
    ],
    quests: [
      { id: "quest_explore", title: "探索你的选择", narrative: "认真思考你想要的生活", description: "花10分钟写下你对三条路的想法", difficulty: 1, estimatedMinutes: 10, type: "side", acceptanceCriteria: ["写下对三条路的想法"], attributeRewards: { courage: 1, wisdom: 1, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 } },
    ],
    questUpdates: [],
    attributeChanges: { courage: 1, wisdom: 1, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 },
    emotionalState: { primary: "curious", intensity: 60 },
  };
}

// 生成动作
function generateActions(userMessage: string): Array<{id: string; label: string; description: string; risk: string}> {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("学") || lowerMessage.includes("技能")) {
    return [
      { id: "start_learn", label: "开始学习", description: "动手实践", risk: "low" },
      { id: "find_resource", label: "找学习资源", description: "搜索教程", risk: "low" },
      { id: "join_community", label: "加入社区", description: "找到同伴", risk: "low" },
    ];
  }
  
  if (lowerMessage.includes("做") || lowerMessage.includes("创业")) {
    return [
      { id: "start_do", label: "开始行动", description: "迈出第一步", risk: "medium" },
      { id: "plan", label: "制定计划", description: "规划步骤", risk: "low" },
      { id: "research", label: "调研市场", description: "了解需求", risk: "low" },
    ];
  }
  
  return [
    { id: "continue", label: "继续对话", description: "告诉我更多", risk: "low" },
    { id: "explore", label: "探索选项", description: "看看有什么可能", risk: "low" },
    { id: "reflect", label: "自我反思", description: "想想自己想要什么", risk: "low" },
  ];
}

// 生成任务
function generateQuests(userMessage: string, context: DialogueContext): Array<{id: string; title: string; narrative: string; description: string; difficulty: number; estimatedMinutes: number; type: string; acceptanceCriteria: string[]; attributeRewards: {courage: number; wisdom: number; empathy: number; creativity: number; resilience: number; communication: number; execution: number}}> {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("学") || lowerMessage.includes("技能")) {
    return [
      { id: "quest_learn", title: "开始学习", narrative: "动手实践是最好的学习方式", description: "花20分钟学习基础知识", difficulty: 1, estimatedMinutes: 20, type: "side", acceptanceCriteria: ["完成基础学习"], attributeRewards: { courage: 1, wisdom: 2, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 } },
    ];
  }
  
  if (lowerMessage.includes("做") || lowerMessage.includes("创业")) {
    return [
      { id: "quest_define", title: "定义目标", narrative: "明确你想要什么", description: "花15分钟写下你的目标", difficulty: 1, estimatedMinutes: 15, type: "side", acceptanceCriteria: ["写下目标"], attributeRewards: { courage: 0, wisdom: 1, empathy: 0, creativity: 1, resilience: 0, communication: 0, execution: 0 } },
    ];
  }
  
  return [
    { id: "quest_explore", title: "探索选择", narrative: "认真思考你的选择", description: "花10分钟写下你的想法", difficulty: 1, estimatedMinutes: 10, type: "side", acceptanceCriteria: ["写下想法"], attributeRewards: { courage: 1, wisdom: 1, empathy: 0, creativity: 0, resilience: 0, communication: 0, execution: 0 } },
  ];
}

// 生成路线解锁
function generatePathUnlocks(userMessage: string, context: DialogueContext): Array<{id: string; name: string; description: string; trigger: string}> {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("学") || lowerMessage.includes("技能")) {
    return [
      { id: "learning", name: "学习之路", description: "系统学习新技能", trigger: "开始学习" },
    ];
  }
  
  if (lowerMessage.includes("做") || lowerMessage.includes("创业")) {
    return [
      { id: "creator", name: "创造者之路", description: "从零开始创造", trigger: "开始行动" },
    ];
  }
  
  return [
    { id: "explorer", name: "探索者之路", description: "探索人生的可能", trigger: "开始探索" },
  ];
}

