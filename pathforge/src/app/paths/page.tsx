"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PathCard, PathComparisonTable } from "@/components/paths";

interface Path {
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
}

const mockPaths: Path[] = [
  {
    id: "path_001",
    name: "研究型路线",
    archetype: "researcher",
    summary: "通过深入研究和学术积累建立专业能力。",
    futureSnapshot: "一年后，你拥有扎实的理论基础和研究能力，适合继续深造或进入研究机构。",
    suitableFor: ["喜欢深入思考", "对学术研究感兴趣"],
    benefits: ["理论基础扎实", "适合深造", "长期发展潜力大"],
    costs: ["需要持续学习", "短期内成果不明显"],
    risks: ["可能与实际脱节", "需要较强的自律性"],
    requiredSkills: ["文献阅读", "数据分析", "论文写作"],
  },
  {
    id: "path_002",
    name: "产品开发型路线",
    archetype: "builder",
    summary: "通过连续开源项目建立作品集和产品能力。",
    futureSnapshot: "一年后，你拥有 3 个可展示 AI 产品和一个清晰的个人主页。",
    suitableFor: ["喜欢动手做项目", "希望用作品证明能力"],
    benefits: ["作品产出快", "反馈周期短", "更适合找实习或远程机会"],
    costs: ["需要持续执行", "早期作品质量可能不稳定"],
    risks: ["容易做太多半成品", "技术深度可能不足"],
    requiredSkills: ["前端", "后端", "模型 API", "产品设计", "开源发布"],
  },
  {
    id: "path_003",
    name: "混合型路线",
    archetype: "hybrid",
    summary: "平衡研究深度和产品实践，双轨验证。",
    futureSnapshot: "一年后，你既有理论基础又有实践经验，具备更强的综合竞争力。",
    suitableFor: ["希望全面发展", "不确定未来方向"],
    benefits: ["风险分散", "能力全面", "选择空间大"],
    costs: ["精力分散", "可能两方面都不够深入"],
    risks: ["容易迷失方向", "需要更好的时间管理"],
    requiredSkills: ["时间管理", "优先级判断", "自我复盘"],
  },
];

export default function PathsPage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [paths, setPaths] = useState<Path[]>(mockPaths);

  useEffect(() => {
    // Try to load generated paths from sessionStorage
    const storedPaths = sessionStorage.getItem("generatedPaths");
    if (storedPaths) {
      try {
        const parsedPaths = JSON.parse(storedPaths);
        if (Array.isArray(parsedPaths) && parsedPaths.length > 0) {
          setPaths(parsedPaths);
        }
      } catch (error) {
        console.error("Failed to parse stored paths:", error);
      }
    }
  }, []);

  const handleSelectPath = (pathId: string) => {
    setSelectedPath(pathId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Parallel Paths</h1>
          <p className="mt-2 text-gray-600">
            Based on your goal, we&apos;ve generated three possible paths. Choose one as your main quest.
          </p>
        </div>

        {/* Comparison Toggle */}
        <div className="flex justify-center mb-8">
          <Button
            variant={showComparison ? "default" : "outline"}
            onClick={() => setShowComparison(!showComparison)}
          >
            {showComparison ? "Hide Comparison" : "Show Comparison"}
          </Button>
        </div>

        {/* Comparison Table */}
        {showComparison && <PathComparisonTable paths={paths} />}

        {/* Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paths.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              selected={selectedPath === path.id}
              onSelect={handleSelectPath}
            />
          ))}
        </div>

        {/* Select Button */}
        <div className="flex justify-center mt-8">
          {selectedPath ? (
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-3 text-lg">
                Start this path
              </Button>
            </Link>
          ) : (
            <Button size="lg" disabled className="px-8 py-3 text-lg">
              Select a path to continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
