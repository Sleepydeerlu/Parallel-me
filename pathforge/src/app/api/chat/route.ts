import { NextResponse } from "next/server";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const DEFAULT_RESPONSE = {
  narrative: "你的话让我陷入了思考。让我们继续探索吧。\n\n你站在原地，周围的世界似乎在等待你的下一个决定。",
  scene: {
    location: "当前位置",
    time: "现在",
    atmosphere: "平静而充满可能",
    description: "你站在人生的十字路口，每一条路都通向不同的未来。",
  },
  actions: [
    {
      id: "explore",
      label: "探索周围",
      description: "仔细观察周围的环境，寻找线索",
      risk: "low",
      reward: "发现新的可能性",
    },
    {
      id: "reflect",
      label: "静心思索",
      description: "找个安静的地方，整理自己的想法",
      risk: "low",
      reward: "获得内心平静",
    },
    {
      id: "talk",
      label: "与人交谈",
      description: "找一个信任的人聊聊",
      risk: "low",
      reward: "获得新的视角",
    },
  ],
  freeInputPlaceholder: "告诉我你的真实想法...",
  pathUnlocks: [],
  quests: [],
  attributeChanges: {},
  emotionalState: {
    primary: "neutral",
    intensity: 50,
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: Message[] };

    // 尝试调用OpenAI API
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.OPENAI_MODEL || "gpt-4";

    if (apiKey && apiKey !== "sk-your-api-key-here") {
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

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content;

          if (content) {
            try {
              // 尝试解析JSON响应
              const parsed = JSON.parse(content);
              return NextResponse.json(parsed);
            } catch {
              // 如果不是JSON，返回默认响应但使用AI的叙述
              return NextResponse.json({
                ...DEFAULT_RESPONSE,
                narrative: content,
              });
            }
          }
        }
      } catch (error) {
        console.error("OpenAI API error:", error);
      }
    }

    // 如果没有配置API或调用失败，返回模拟响应
    const lastUserMessage = messages
      .filter((m) => m.role === "user")
      .pop()?.content || "";

    const mockResponse = generateMockResponse(lastUserMessage);
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(DEFAULT_RESPONSE);
  }
}

function generateMockResponse(userMessage: string) {
  // 简单的关键词匹配来生成模拟响应
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("考研") || lowerMessage.includes("学业")) {
    return {
      narrative: `你的话让我看到了你内心的挣扎。\n\n想象一下：五年后的你，站在人生的另一个节点上。\n\n如果你选择考研，你可能会在学术的殿堂里深造，结识志同道合的伙伴，但也要面对漫长的备考和可能的失败。\n\n如果你选择直接工作，你可能会更早地接触社会，积累经验，但也可能错过深入学习的机会。\n\n> 你觉得，哪个选择更接近你理想中的自己？`,
      scene: {
        location: "图书馆窗边",
        time: "下午三点",
        atmosphere: "阳光温暖，但内心有些迷茫",
        description: "窗外是校园的梧桐树，落叶在风中飘舞。桌上摊开着考研资料和一封实习offer。",
      },
      actions: [
        {
          id: "study",
          label: "翻开考研资料",
          description: "开始认真复习，为考研做准备",
          risk: "low",
          reward: "学术能力提升",
        },
        {
          id: "work",
          label: "打开实习offer",
          description: "仔细看看这份工作机会",
          risk: "low",
          reward: "职场经验",
        },
        {
          id: "talk",
          label: "找人聊聊",
          description: "和信任的人讨论这个决定",
          risk: "low",
          reward: "新的视角",
        },
      ],
      freeInputPlaceholder: "告诉我你内心真实的想法...",
      pathUnlocks: [
        {
          id: "academic",
          name: "学术之路",
          description: "深入研究，追求知识的边界",
          trigger: "选择考研或表达对学术的兴趣",
        },
        {
          id: "career",
          name: "职场之路",
          description: "直接进入职场，积累实战经验",
          trigger: "选择工作或表达对职场的向往",
        },
      ],
      quests: [],
      attributeChanges: { wisdom: 1 },
      emotionalState: {
        primary: "contemplative",
        intensity: 60,
      },
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
      },
      actions: [
        {
          id: "current",
          label: "聊聊现状",
          description: "描述你目前的工作状态",
          risk: "low",
        },
        {
          id: "dream",
          label: "谈谈梦想",
          description: "说说你理想中的工作是什么样的",
          risk: "low",
        },
        {
          id: "confused",
          label: "表达迷茫",
          description: "承认自己现在很迷茫",
          risk: "low",
        },
      ],
      freeInputPlaceholder: "你现在的状态是...",
      pathUnlocks: [],
      quests: [],
      attributeChanges: {},
      emotionalState: {
        primary: "neutral",
        intensity: 50,
      },
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
      },
      actions: [
        {
          id: "dream",
          label: "畅想未来",
          description: "描述你理想中的生活",
          risk: "low",
          reward: "明确方向",
        },
        {
          id: "fear",
          label: "说出恐惧",
          description: "说出你最担心的事情",
          risk: "low",
          reward: "释放压力",
        },
        {
          id: "small",
          label: "从小事开始",
          description: "聊聊你最近在做的事情",
          risk: "low",
        },
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
          attributeRewards: { wisdom: 2, courage: 1 },
        },
      ],
      attributeChanges: { wisdom: 1 },
      emotionalState: {
        primary: "reflective",
        intensity: 70,
      },
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
    },
    actions: [
      {
        id: "continue",
        label: "继续对话",
        description: "告诉我更多关于你的事情",
        risk: "low",
      },
      {
        id: "explore",
        label: "探索选项",
        description: "看看有哪些可能的方向",
        risk: "low",
      },
    ],
    freeInputPlaceholder: "告诉我更多...",
    pathUnlocks: [],
    quests: [],
    attributeChanges: {},
    emotionalState: {
      primary: "neutral",
      intensity: 50,
    },
  };
}
