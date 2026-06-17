import { NextResponse } from "next/server";

interface UpdateQuestRequest {
  status: "completed" | "skipped" | "postponed";
  reflection?: string;
  actualMinutes?: number;
  energyLevel?: number;
}

interface QuestLog {
  id: string;
  questId: string;
  status: string;
  completedAt?: string;
  reflection?: string;
  actualMinutes?: number;
  energyLevel?: number;
  attributeChanges: {
    focus: number;
    execution: number;
    creativity: number;
    learning: number;
    resilience: number;
  };
}

function calculateAttributeChanges(
  status: string,
  difficulty: number
): { focus: number; execution: number; creativity: number; learning: number; resilience: number } {
  const base = status === "completed" ? difficulty : status === "skipped" ? 0 : 1;
  
  return {
    focus: status === "completed" ? base : 0,
    execution: status === "completed" ? base : 0,
    creativity: status === "completed" ? Math.ceil(base / 2) : 0,
    learning: status === "completed" ? Math.ceil(base / 2) : 0,
    resilience: status === "completed" ? 1 : status === "skipped" ? 0 : 1,
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const input = body as UpdateQuestRequest;

    // Validate input
    if (!input.status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate attribute changes (mock difficulty = 2)
    const attributeChanges = calculateAttributeChanges(input.status, 2);

    // Create quest log
    const questLog: QuestLog = {
      id: `log_${Date.now()}`,
      questId: id,
      status: input.status,
      completedAt: input.status === "completed" ? new Date().toISOString() : undefined,
      reflection: input.reflection,
      actualMinutes: input.actualMinutes,
      energyLevel: input.energyLevel,
      attributeChanges,
    };

    return NextResponse.json({
      questLogId: questLog.id,
      attributeChanges: questLog.attributeChanges,
    });
  } catch (error) {
    console.error("Error updating quest:", error);
    return NextResponse.json(
      { error: "Failed to update quest" },
      { status: 500 }
    );
  }
}
