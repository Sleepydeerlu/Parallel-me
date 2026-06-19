import { DialogueContext, Message, Summary, UserProfile, PathState, QuestState } from "./context";

// 配置常量
const CONFIG = {
  MAX_RECENT_MESSAGES: 20,  // 保留最近的消息数
  SUMMARIZE_THRESHOLD: 10,  // 超过这个数量的消息需要压缩
  MAX_SUMMARIES: 5,         // 最多保留的摘要数
  MAX_TOKEN_ESTIMATE: 8000, // 估计的token上限
};

// 创建新的对话上下文
export function createDialogueContext(userId: string): DialogueContext {
  const now = new Date().toISOString();
  return {
    sessionId: `session_${Date.now()}`,
    userId,
    recentMessages: [],
    summaries: [],
    userProfile: {
      identity: {},
      goals: [],
      fears: [],
      desires: [],
      values: [],
      relationships: [],
      personality: {
        traits: [],
      },
    },
    paths: [],
    quests: [],
    attributes: {
      courage: 10,
      wisdom: 10,
      empathy: 10,
      creativity: 10,
      resilience: 10,
      communication: 10,
      execution: 10,
    },
    emotionalState: {
      primary: "neutral",
      intensity: 50,
      history: [],
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      summaryCount: 0,
      tokenEstimate: 0,
    },
  };
}

// 添加消息到上下文
export function addMessage(
  context: DialogueContext,
  message: Message
): DialogueContext {
  const updatedContext = {
    ...context,
    recentMessages: [...context.recentMessages, message],
    metadata: {
      ...context.metadata,
      messageCount: context.metadata.messageCount + 1,
      updatedAt: new Date().toISOString(),
      tokenEstimate: estimateTokens([...context.recentMessages, message]),
    },
  };

  // 检查是否需要压缩
  if (shouldSummarize(updatedContext)) {
    return compressContext(updatedContext);
  }

  return updatedContext;
}

// 检查是否需要压缩
function shouldSummarize(context: DialogueContext): boolean {
  return (
    context.recentMessages.length > CONFIG.MAX_RECENT_MESSAGES ||
    context.metadata.tokenEstimate > CONFIG.MAX_TOKEN_ESTIMATE
  );
}

// 压缩上下文
function compressContext(context: DialogueContext): DialogueContext {
  const messagesToSummarize = context.recentMessages.slice(
    0,
    CONFIG.SUMMARIZE_THRESHOLD
  );
  const remainingMessages = context.recentMessages.slice(
    CONFIG.SUMMARIZE_THRESHOLD
  );

  // 创建摘要
  const summary = createSummary(messagesToSummarize, context.summaries.length);

  // 限制摘要数量
  const updatedSummaries = [...context.summaries, summary].slice(
    -CONFIG.MAX_SUMMARIES
  );

  return {
    ...context,
    recentMessages: remainingMessages,
    summaries: updatedSummaries,
    metadata: {
      ...context.metadata,
      summaryCount: updatedSummaries.length,
      tokenEstimate: estimateTokens(remainingMessages),
    },
  };
}

// 创建摘要
function createSummary(messages: Message[], index: number): Summary {
  const firstMessage = messages[0];
  const lastMessage = messages[messages.length - 1];

  // 提取关键点
  const keyPoints = extractKeyPoints(messages);
  
  // 提取决策
  const decisions = extractDecisions(messages);
  
  // 分析情感弧线
  const emotionalArc = analyzeEmotionalArc(messages);

  return {
    id: `summary_${index}`,
    messageRange: {
      start: firstMessage.id,
      end: lastMessage.id,
    },
    summary: generateSummaryText(messages),
    keyPoints,
    emotionalArc,
    decisions,
    createdAt: new Date().toISOString(),
  };
}

// 提取关键点
function extractKeyPoints(messages: Message[]): string[] {
  const keyPoints: string[] = [];
  
  for (const message of messages) {
    if (message.role === "user") {
      // 提取用户的关键信息
      const content = message.content.toLowerCase();
      
      if (content.includes("我") && (content.includes("是") || content.includes("想"))) {
        keyPoints.push(message.content.substring(0, 100));
      }
    }
  }
  
  return keyPoints.slice(0, 5); // 最多5个关键点
}

// 提取决策
function extractDecisions(messages: Message[]): string[] {
  const decisions: string[] = [];
  
  for (const message of messages) {
    if (message.metadata?.pathImpact) {
      decisions.push(`选择了${message.metadata.pathImpact}路线`);
    }
  }
  
  return decisions;
}

// 分析情感弧线
function analyzeEmotionalArc(messages: Message[]): string {
  const emotions = messages
    .filter((m) => m.metadata?.emotion)
    .map((m) => m.metadata!.emotion!);
  
  if (emotions.length === 0) return "情绪稳定";
  if (emotions.length === 1) return `主要情绪：${emotions[0]}`;
  
  return `从${emotions[0]}到${emotions[emotions.length - 1]}`;
}

// 生成摘要文本
function generateSummaryText(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === "user");
  const assistantMessages = messages.filter((m) => m.role === "assistant");
  
  if (userMessages.length === 0) return "对话开始";
  
  const userContent = userMessages.map((m) => m.content).join(" ");
  const topics = extractTopics(userContent);
  
  return `用户讨论了${topics}等话题，共${messages.length}条消息。`;
}

// 提取话题
function extractTopics(content: string): string {
  const topics: string[] = [];
  
  const topicKeywords = {
    "工作": ["工作", "职业", "上班", "公司"],
    "学习": ["学习", "考研", "考试", "学校"],
    "人生": ["人生", "未来", "目标", "梦想"],
    "情感": ["感情", "爱情", "朋友", "家人"],
    "成长": ["成长", "进步", "提升", "改变"],
  };
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((keyword) => content.includes(keyword))) {
      topics.push(topic);
    }
  }
  
  return topics.length > 0 ? topics.join("、") : "各种";
}

// 估计token数量
function estimateTokens(messages: Message[]): number {
  let totalChars = 0;
  for (const message of messages) {
    totalChars += message.content.length;
  }
  // 粗略估计：1个中文字符约等于2个token
  return Math.ceil(totalChars * 2);
}

// 更新用户画像
export function updateUserProfile(
  context: DialogueContext,
  updates: Partial<UserProfile>
): DialogueContext {
  return {
    ...context,
    userProfile: {
      ...context.userProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    },
  };
}

// 添加路线
export function addPath(
  context: DialogueContext,
  path: PathState
): DialogueContext {
  return {
    ...context,
    paths: [...context.paths, path],
  };
}

// 更新路线状态
export function updatePath(
  context: DialogueContext,
  pathId: string,
  updates: Partial<PathState>
): DialogueContext {
  return {
    ...context,
    paths: context.paths.map((p) =>
      p.id === pathId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ),
  };
}

// 添加任务
export function addQuest(
  context: DialogueContext,
  quest: QuestState
): DialogueContext {
  return {
    ...context,
    quests: [...context.quests, quest],
  };
}

// 更新任务状态
export function updateQuest(
  context: DialogueContext,
  questId: string,
  updates: Partial<QuestState>
): DialogueContext {
  return {
    ...context,
    quests: context.quests.map((q) =>
      q.id === questId ? { ...q, ...updates } : q
    ),
  };
}

// 更新属性
export function updateAttributes(
  context: DialogueContext,
  changes: Record<string, number>
): DialogueContext {
  const newAttributes = { ...context.attributes };
  
  for (const [key, value] of Object.entries(changes)) {
    if (key in newAttributes) {
      (newAttributes as any)[key] = Math.max(0, Math.min(100, (newAttributes as any)[key] + value));
    }
  }
  
  return {
    ...context,
    attributes: newAttributes,
  };
}

// 更新情感状态
export function updateEmotionalState(
  context: DialogueContext,
  emotion: string,
  intensity: number
): DialogueContext {
  return {
    ...context,
    emotionalState: {
      primary: emotion,
      intensity,
      history: [
        ...context.emotionalState.history,
        {
          emotion,
          intensity,
          timestamp: new Date().toISOString(),
        },
      ].slice(-10), // 保留最近10条情感记录
    },
  };
}

// 构建给AI的上下文摘要
export function buildContextSummary(context: DialogueContext): string {
  const parts: string[] = [];

  // 用户画像
  if (context.userProfile.identity?.occupation) {
    parts.push(`用户身份：${context.userProfile.identity.occupation}`);
  }
  if (context.userProfile.goals.length > 0) {
    parts.push(`用户目标：${context.userProfile.goals.join("、")}`);
  }
  if (context.userProfile.fears.length > 0) {
    parts.push(`用户担忧：${context.userProfile.fears.join("、")}`);
  }

  // 活跃路线
  const activePath = context.paths.find((p) => p.status === "active");
  if (activePath) {
    parts.push(`当前路线：${activePath.name} - ${activePath.description}`);
  }

  // 活跃任务
  const activeQuests = context.quests.filter((q) => q.status === "active");
  if (activeQuests.length > 0) {
    parts.push(`进行中的任务：${activeQuests.map((q) => q.title).join("、")}`);
  }

  // 情感状态
  parts.push(`当前情感：${context.emotionalState.primary}，强度${context.emotionalState.intensity}`);

  // 历史摘要
  if (context.summaries.length > 0) {
    const lastSummary = context.summaries[context.summaries.length - 1];
    parts.push(`之前的对话摘要：${lastSummary.summary}`);
    if (lastSummary.keyPoints.length > 0) {
      parts.push(`关键点：${lastSummary.keyPoints.join("；")}`);
    }
  }

  return parts.join("\n");
}

// 序列化上下文（用于存储）
export function serializeContext(context: DialogueContext): string {
  return JSON.stringify(context, null, 2);
}

// 反序列化上下文
export function deserializeContext(data: string): DialogueContext {
  return JSON.parse(data);
}
