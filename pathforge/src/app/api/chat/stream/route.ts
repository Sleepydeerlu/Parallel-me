import { NextResponse } from "next/server";
import { generateAIResponseStream } from "@/lib/ai/engine";
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

    // Get stream from engine
    const stream = await generateAIResponseStream(lastUserMessage.content, context);

    // Return stream response
    return new Response(stream, {
      headers: {
        ...getRateLimitHeaders(rateLimitResult),
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat stream API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
