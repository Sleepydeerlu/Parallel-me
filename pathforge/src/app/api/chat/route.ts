import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/engine";
import { 
  createDialogueContext, 
  addMessage, 
  updateUserProfile,
  addPath,
  addQuest,
  updateQuest,
  updateAttributes,
  updateEmotionalState,
  serializeContext,
  deserializeContext
} from "@/lib/ai/context-manager";
import { DialogueContext } from "@/lib/ai/context";
import { checkRateLimit, getRateLimitHeaders, createRateLimitResponse } from "@/lib/rate-limit";

interface RequestBody {
  messages: { role: string; content: string }[];
  context?: string;
}

export async function POST(request: Request) {
  // Rate limiting
  const identifier = request.headers.get("x-forwarded-for") || "anonymous";
  const rateLimitResult = checkRateLimit(identifier);
  
  if (!rateLimitResult.allowed) {
    return createRateLimitResponse();
  }

  try {
    const body = await request.json();
    const { messages, context: serializedContext } = body as RequestBody;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Get or create context
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

    // Get user message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from user" },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // Add user message to context
    context = addMessage(context, {
      id: `msg_${Date.now()}`,
      role: "user",
      content: lastUserMessage.content,
      timestamp: new Date().toISOString(),
    });

    // Generate AI response
    const aiResponse = await generateAIResponse(lastUserMessage.content, context);

    // Add AI response to context
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

    // Update attributes
    if (aiResponse.attributeChanges && Object.keys(aiResponse.attributeChanges).length > 0) {
      context = updateAttributes(context, aiResponse.attributeChanges);
    }

    // Update emotional state
    if (aiResponse.emotionalState) {
      context = updateEmotionalState(
        context,
        aiResponse.emotionalState.primary,
        aiResponse.emotionalState.intensity
      );
    }

    // Update user profile
    if (aiResponse.userProfileUpdates) {
      context = updateUserProfile(context, aiResponse.userProfileUpdates);
    }

    // Handle path unlocks
    if (aiResponse.pathUnlocks && aiResponse.pathUnlocks.length > 0) {
      for (const pathUnlock of aiResponse.pathUnlocks) {
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

    // Handle quest generation
    if (aiResponse.quests && aiResponse.quests.length > 0) {
      for (const quest of aiResponse.quests) {
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

    // Handle quest updates (model判断任务完成)
    if (aiResponse.questUpdates && aiResponse.questUpdates.length > 0) {
      for (const update of aiResponse.questUpdates) {
        context = updateQuest(context, update.id, {
          status: update.status as "completed" | "failed" | "abandoned",
          completedAt: update.status === "completed" ? new Date().toISOString() : undefined,
        });
      }
    }

    // Serialize context
    const newSerializedContext = serializeContext(context);

    return NextResponse.json(
      {
        ...aiResponse,
        context: newSerializedContext,
        contextStats: {
          messageCount: context.metadata.messageCount,
          summaryCount: context.metadata.summaryCount,
          pathCount: context.paths.length,
          questCount: context.quests.length,
        },
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
