import { NextResponse } from "next/server";

interface PathRequest {
  identity: string;
  currentStage: string;
  goal: string;
  dilemma: string;
  timeHorizon: string;
  weeklyHours: number;
  currentSkills: string[];
  constraints: string[];
}

interface GeneratedPath {
  id: string;
  name: string;
  archetype: string;
  summary: string;
  futureSnapshot: string;
  suitableFor: string[];
  benefits: string[];
  costs: string[];
  risks: string[];
  requiredSkills: string[];
  thirtyDayValidation: string[];
  ninetyDayMilestones: string[];
  oneYearOutcome: string;
}

function generatePaths(input: PathRequest): GeneratedPath[] {
  // This is a mock implementation. In production, this would call an LLM API.
  const basePath: GeneratedPath = {
    id: "path_001",
    name: "稳健路线",
    archetype: "researcher",
    summary: "通过深入研究和学术积累建立专业能力。",
    futureSnapshot: `一年后，你在${input.goal}方面拥有扎实的理论基础和研究能力。`,
    suitableFor: ["喜欢深入思考", "对学术研究感兴趣", "时间充裕"],
    benefits: ["理论基础扎实", "适合深造", "长期发展潜力大"],
    costs: ["需要持续学习", "短期内成果不明显"],
    risks: ["可能与实际脱节", "需要较强的自律性"],
    requiredSkills: ["文献阅读", "数据分析", "论文写作"],
    thirtyDayValidation: [
      "完成3篇相关领域的深度阅读",
      "写一篇学习总结",
      "与一位从业者交流",
    ],
    ninetyDayMilestones: [
      "完成一个小的研究项目",
      "形成系统的知识框架",
      "开始输出内容",
    ],
    oneYearOutcome: `在${input.goal}领域建立了扎实的基础，具备继续深造或进入相关领域的能力。`,
  };

  const aggressivePath: GeneratedPath = {
    id: "path_002",
    name: "激进路线",
    archetype: "builder",
    summary: "通过快速迭代和项目实践建立作品集。",
    futureSnapshot: `一年后，你拥有多个可展示的${input.goal}相关项目。`,
    suitableFor: ["喜欢动手实践", "希望快速看到成果", "执行力强"],
    benefits: ["作品产出快", "反馈周期短", "更适合找实习或远程机会"],
    costs: ["需要持续执行", "早期作品质量可能不稳定"],
    risks: ["容易做太多半成品", "技术深度可能不足"],
    requiredSkills: ["快速学习", "项目管理", "开源发布"],
    thirtyDayValidation: [
      "完成第一个小项目",
      "发布到GitHub",
      "获得第一个用户反馈",
    ],
    ninetyDayMilestones: [
      "完成3个项目",
      "建立个人主页",
      "获得社区认可",
    ],
    oneYearOutcome: `在${input.goal}方面拥有丰富的实践经验和可展示的作品集。`,
  };

  const hybridPath: GeneratedPath = {
    id: "path_003",
    name: "混合路线",
    archetype: "hybrid",
    summary: "平衡研究深度和项目实践，双轨验证。",
    futureSnapshot: `一年后，你在${input.goal}方面既有理论基础又有实践经验。`,
    suitableFor: ["希望全面发展", "不确定未来方向", "时间有限"],
    benefits: ["风险分散", "能力全面", "选择空间大"],
    costs: ["精力分散", "可能两方面都不够深入"],
    risks: ["容易迷失方向", "需要更好的时间管理"],
    requiredSkills: ["时间管理", "优先级判断", "自我复盘"],
    thirtyDayValidation: [
      "完成一个小项目",
      "阅读3篇深度文章",
      "写一篇总结",
    ],
    ninetyDayMilestones: [
      "完成2个项目",
      "形成知识框架",
      "开始输出内容",
    ],
    oneYearOutcome: `在${input.goal}方面具备综合能力，可以根据市场情况灵活选择发展方向。`,
  };

  return [basePath, aggressivePath, hybridPath];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = body as PathRequest;

    // Validate input
    if (!input.goal || !input.identity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate paths
    const paths = generatePaths(input);

    return NextResponse.json({ paths });
  } catch (error) {
    console.error("Error generating paths:", error);
    return NextResponse.json(
      { error: "Failed to generate paths" },
      { status: 500 }
    );
  }
}
