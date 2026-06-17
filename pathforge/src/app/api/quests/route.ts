import { NextResponse } from "next/server";

interface QuestRequest {
  pathId: string;
  pathName: string;
  weeklyHours: number;
}

interface GeneratedQuest {
  id: string;
  title: string;
  type: "main" | "side" | "daily";
  difficulty: number;
  estimatedMinutes: number;
  description: string;
  whyItMatters: string;
  acceptanceCriteria: string[];
  dueDate: string;
}

function generateQuests(input: QuestRequest): GeneratedQuest[] {
  // This is a mock implementation. In production, this would call an LLM API.
  const today = new Date();
  const quests: GeneratedQuest[] = [];

  // Generate quests for 7 days
  for (let day = 0; day < 7; day++) {
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + day);
    const dueDateStr = dueDate.toISOString().split("T")[0];

    // Main quest (every other day)
    if (day % 2 === 0) {
      quests.push({
        id: `quest_main_${day}`,
        title: `Day ${day + 1}: Main Quest - ${getMainQuestTitle(day, input.pathName)}`,
        type: "main",
        difficulty: 2,
        estimatedMinutes: 60,
        description: getMainQuestDescription(day, input.pathName),
        whyItMatters: `This quest helps you progress on your ${input.pathName} path.`,
        acceptanceCriteria: getMainQuestCriteria(day),
        dueDate: dueDateStr,
      });
    }

    // Daily quest (every day)
    quests.push({
      id: `quest_daily_${day}`,
      title: `Day ${day + 1}: Daily Quest - ${getDailyQuestTitle(day)}`,
      type: "daily",
      difficulty: 1,
      estimatedMinutes: 30,
      description: getDailyQuestDescription(day),
      whyItMatters: "Consistent daily practice builds momentum.",
      acceptanceCriteria: getDailyQuestCriteria(day),
      dueDate: dueDateStr,
    });

    // Side quest (some days)
    if (day % 3 === 0) {
      quests.push({
        id: `quest_side_${day}`,
        title: `Day ${day + 1}: Side Quest - ${getSideQuestTitle(day)}`,
        type: "side",
        difficulty: 1,
        estimatedMinutes: 20,
        description: getSideQuestDescription(day),
        whyItMatters: "Side quests help you explore and build supporting skills.",
        acceptanceCriteria: getSideQuestCriteria(day),
        dueDate: dueDateStr,
      });
    }
  }

  return quests;
}

function getMainQuestTitle(day: number, pathName: string): string {
  const titles = [
    "Complete product positioning document",
    "Build project skeleton",
    "Implement core feature",
    "Write technical documentation",
    "Create user guide",
    "Prepare demo",
    "Publish first version",
  ];
  return titles[day % titles.length];
}

function getMainQuestDescription(day: number, pathName: string): string {
  const descriptions = [
    "Write a clear product positioning document that defines your target users, core pain points, and MVP features.",
    "Set up the project structure with proper tooling, dependencies, and basic configuration.",
    "Implement the core feature that demonstrates your product's main value proposition.",
    "Create comprehensive technical documentation for your project.",
    "Write a user guide that helps new users understand and use your product.",
    "Prepare a demo that showcases your product's key features and benefits.",
    "Publish the first version of your product to a public platform.",
  ];
  return descriptions[day % descriptions.length];
}

function getMainQuestCriteria(day: number): string[] {
  const criteria = [
    ["Document contains target user definition", "Document contains pain point analysis", "Document contains MVP feature list"],
    ["Project runs without errors", "Basic structure is in place", "Dependencies are configured"],
    ["Feature works as expected", "Code is clean and readable", "Tests are passing"],
    ["Documentation is complete", "Examples are provided", "API is documented"],
    ["Guide is clear and concise", "Screenshots are included", "Common issues are addressed"],
    ["Demo runs smoothly", "Key features are highlighted", "User flow is clear"],
    ["Product is accessible", "Basic functionality works", "README is complete"],
  ];
  return criteria[day % criteria.length];
}

function getDailyQuestTitle(day: number): string {
  const titles = [
    "Read an article about AI products",
    "Write a learning note",
    "Practice a new skill",
    "Review yesterday's work",
    "Plan tomorrow's tasks",
    "Reflect on progress",
    "Share something learned",
  ];
  return titles[day % titles.length];
}

function getDailyQuestDescription(day: number): string {
  const descriptions = [
    "Read one article about AI product design or development and summarize key insights.",
    "Write a brief note about what you learned today.",
    "Spend 30 minutes practicing a relevant skill.",
    "Review what you accomplished yesterday and identify improvements.",
    "Plan your tasks for tomorrow with clear priorities.",
    "Reflect on your progress and identify areas for improvement.",
    "Share something you learned with someone or post it online.",
  ];
  return descriptions[day % descriptions.length];
}

function getDailyQuestCriteria(day: number): string[] {
  const criteria = [
    ["Article is read", "Key insights are noted", "One insight is applied"],
    ["Note is written", "Learning is documented", "Next steps are identified"],
    ["Practice session is completed", "Progress is tracked", "Difficulty is noted"],
    ["Yesterday's work is reviewed", "Improvements are identified", "Lessons are documented"],
    ["Tasks are listed", "Priorities are set", "Time is allocated"],
    ["Progress is assessed", "Blockers are identified", "Adjustments are planned"],
    ["Something is shared", "Feedback is received", "Connection is made"],
  ];
  return criteria[day % criteria.length];
}

function getSideQuestTitle(day: number): string {
  const titles = [
    "Explore a new tool",
    "Connect with a peer",
    "Update your portfolio",
  ];
  return titles[day % titles.length];
}

function getSideQuestDescription(day: number): string {
  const descriptions = [
    "Explore a new tool or technology that could help with your project.",
    "Connect with someone in your field and exchange ideas.",
    "Update your portfolio or personal website with recent work.",
  ];
  return descriptions[day % descriptions.length];
}

function getSideQuestCriteria(day: number): string[] {
  const criteria = [
    ["Tool is explored", "Features are understood", "Potential use is identified"],
    ["Connection is made", "Ideas are exchanged", "Follow-up is planned"],
    ["Portfolio is updated", "New work is added", "Description is written"],
  ];
  return criteria[day % criteria.length];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = body as QuestRequest;

    // Validate input
    if (!input.pathId || !input.pathName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate quests
    const quests = generateQuests(input);

    return NextResponse.json({ quests });
  } catch (error) {
    console.error("Error generating quests:", error);
    return NextResponse.json(
      { error: "Failed to generate quests" },
      { status: 500 }
    );
  }
}
