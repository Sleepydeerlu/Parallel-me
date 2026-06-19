import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/engine";
import { 
  createDialogueContext, 
  addMessage, 
  updateUserProfile,
  addPath,
  addQuest,
  updateAttributes,
  updateEmotionalState,
  serializeContext,
  deserializeContext
} from "@/lib/ai/context-manager";
import { DialogueContext } from "@/lib/ai/context";

interface RequestBody {
  messages: { role: string; content: string }[];
  context?: string; // 序列化的上下文
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, context: serializedContext } = body as RequestBody;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // 获取或创建上下文
    let context: DialogueContext;
    if (serializedContext) {
      try {
        context = deserializeContext(serializedContext);
      } catch {
        context = createDialogueContext("anonymous");
      }
    } else {
      context = createDialogueContext("anonymous");
    }

    // 获取用户消息
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from user" },
        { status: 400 }
      );
    }

    // 添加用户消息到上下文
    context = addMessage(context, {
      id: `msg_${Date.now()}`,
      role: "user",
      content: lastUserMessage.content,
      timestamp: new Date().toISOString(),
    });

    // 生成AI响应
    const aiResponse = await generateAIResponse(lastUserMessage.content, context);

    // 添加AI响应到上下文
    context = addMessage(context, {
      id: `msg_${Date.now() + 1}`,
      role: "assistant",
      content: aiResponse.narrative,
      timestamp: new Date().toISOString(),
      metadata: {
        scene: aiResponse.scene?.location,
        emotion: aiResponse.emotionalState?.primary,
        questGenerated: aiResponse.quests.length > 0,
      },
    });

    // 更新属性
    if (aiResponse.attributeChanges && Object.keys(aiResponse.attributeChanges).length > 0) {
      context = updateAttributes(context, aiResponse.attributeChanges);
    }

    // 更新情感状态
    if (aiResponse.emotionalState) {
      context = updateEmotionalState(
        context,
        aiResponse.emotionalState.primary,
        aiResponse.emotionalState.intensity
      );
    }

    // 更新用户画像
    if (aiResponse.userProfileUpdates) {
      context = updateUserProfile(context, aiResponse.userProfileUpdates);
    }

    // 处理路线解锁
    if (aiResponse.pathUnlocks && aiResponse.pathUnlocks.length > 0) {
      for (const pathUnlock of aiResponse.pathUnlocks) {
        // 检查是否已经存在
        const existingPath = context.paths.find((p) => p.id === pathUnlock.id);
        if (!existingPath) {
          context = addPath(context, {
            id: pathUnlock.id,
            name: pathUnlock.name,
            description: pathUnlock.description,
            status: "unlocked",
            progress: 0,
            origin: {
              dialogueId: context.recentMessages[context.recentMessages.length - 2]?.id || "unknown",
              trigger: pathUnlock.trigger,
            },
            milestones: [],
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // 处理任务生成
    if (aiResponse.quests && aiResponse.quests.length > 0) {
      for (const quest of aiResponse.quests) {
        // 检查是否已经存在
        const existingQuest = context.quests.find((q) => q.id === quest.id);
        if (!existingQuest) {
          context = addQuest(context, {
            id: quest.id,
            title: quest.title,
            description: quest.description,
            narrative: quest.narrative,
            type: quest.type as "main" | "side" | "hidden" | "emergency",
            status: "active",
            difficulty: quest.difficulty,
            estimatedMinutes: quest.estimatedMinutes,
            acceptanceCriteria: quest.acceptanceCriteria,
            origin: {
              dialogueId: context.recentMessages[context.recentMessages.length - 2]?.id || "unknown",
              scene: aiResponse.scene?.location || "unknown",
            },
            rewards: {
              attributes: quest.attributeRewards || {},
              unlocks: [],
            },
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // 序列化上下文
    const newSerializedContext = serializeContext(context);

    return NextResponse.json({
      ...aiResponse,
      context: newSerializedContext,
      contextStats: {
        messageCount: context.metadata.messageCount,
        summaryCount: context.metadata.summaryCount,
        pathCount: context.paths.length,
        questCount: context.quests.length,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
