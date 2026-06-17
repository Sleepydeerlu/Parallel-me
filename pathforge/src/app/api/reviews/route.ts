import { NextResponse } from "next/server";

interface ReviewRequest {
  goalId: string;
  weekStart: string;
  weekEnd: string;
}

interface WeeklyReview {
  id: string;
  weekStart: string;
  weekEnd: string;
  completionRate: number;
  completedQuests: number;
  skippedQuests: number;
  summary: string;
  attributeChanges: {
    focus: number;
    execution: number;
    creativity: number;
    learning: number;
    resilience: number;
  };
  pathAlignment: {
    pathId: string;
    pathName: string;
    score: number;
  }[];
  recommendations: string[];
}

function generateReview(input: ReviewRequest): WeeklyReview {
  // This is a mock implementation. In production, this would call an LLM API.
  return {
    id: `review_${Date.now()}`,
    weekStart: input.weekStart,
    weekEnd: input.weekEnd,
    completionRate: 0.71,
    completedQuests: 5,
    skippedQuests: 2,
    summary: "本周你在产品定位和执行力上有明显推进。你完成了主要的产品定位文档，并开始了项目搭建。虽然有一些任务被跳过，但整体进展良好。",
    attributeChanges: {
      focus: 2,
      execution: 5,
      creativity: 3,
      learning: 4,
      resilience: 1,
    },
    pathAlignment: [
      { pathId: "path_001", pathName: "产品开发型路线", score: 72 },
      { pathId: "path_002", pathName: "研究型路线", score: 58 },
      { pathId: "path_003", pathName: "混合型路线", score: 35 },
    ],
    recommendations: [
      "下周至少完成一个可展示 demo",
      "继续保持每日学习习惯",
      "可以尝试更复杂的任务",
      "注意时间管理，避免任务堆积",
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = body as ReviewRequest;

    // Validate input
    if (!input.goalId || !input.weekStart || !input.weekEnd) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate review
    const review = generateReview(input);

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error generating review:", error);
    return NextResponse.json(
      { error: "Failed to generate review" },
      { status: 500 }
    );
  }
}
