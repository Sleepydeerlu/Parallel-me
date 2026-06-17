"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuestCard } from "@/components/quests";

interface Quest {
  id: string;
  title: string;
  type: "main" | "side" | "daily";
  difficulty: number;
  estimatedMinutes: number;
  description: string;
  whyItMatters: string;
  acceptanceCriteria: string[];
  status: "pending" | "in_progress" | "completed" | "skipped" | "postponed";
  dueDate: string;
}

const mockQuests: Quest[] = [
  {
    id: "quest_001",
    title: "完成第一个 AI 工具的产品定位文档",
    type: "main",
    difficulty: 2,
    estimatedMinutes: 60,
    description: "为你的第一个 AI 产品定义目标用户、痛点和 MVP。",
    whyItMatters: "产品开发型路线需要先形成清晰的产品判断。",
    acceptanceCriteria: ["写出目标用户", "写出核心痛点", "写出 MVP 功能列表"],
    status: "pending",
    dueDate: "2026-06-18",
  },
  {
    id: "quest_002",
    title: "学习 React 基础组件开发",
    type: "daily",
    difficulty: 1,
    estimatedMinutes: 30,
    description: "学习 React 组件的基础知识和最佳实践。",
    whyItMatters: "React 是前端开发的基础技能。",
    acceptanceCriteria: ["完成一个简单的组件", "理解组件生命周期", "掌握状态管理"],
    status: "completed",
    dueDate: "2026-06-18",
  },
  {
    id: "quest_003",
    title: "阅读一篇 AI 产品设计文章",
    type: "side",
    difficulty: 1,
    estimatedMinutes: 20,
    description: "阅读一篇关于 AI 产品设计的文章并总结要点。",
    whyItMatters: "了解行业最佳实践和设计趋势。",
    acceptanceCriteria: ["文章已阅读", "要点已总结", "一个洞察已记录"],
    status: "pending",
    dueDate: "2026-06-18",
  },
  {
    id: "quest_004",
    title: "搭建 Next.js 项目骨架",
    type: "main",
    difficulty: 2,
    estimatedMinutes: 45,
    description: "创建 Next.js 项目并配置基本依赖。",
    whyItMatters: "项目骨架是开发的基础。",
    acceptanceCriteria: ["项目能运行", "依赖已配置", "基本结构已建立"],
    status: "in_progress",
    dueDate: "2026-06-19",
  },
  {
    id: "quest_005",
    title: "写一篇学习笔记",
    type: "daily",
    difficulty: 1,
    estimatedMinutes: 15,
    description: "记录今天学到的知识和心得。",
    whyItMatters: "记录和反思有助于巩固学习。",
    acceptanceCriteria: ["笔记已写", "重点已标注", "下一步已规划"],
    status: "pending",
    dueDate: "2026-06-19",
  },
];

const mockAttributes = {
  focus: 12,
  execution: 18,
  learning: 15,
  creativity: 10,
  resilience: 11,
};

export default function DashboardPage() {
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [attributes, setAttributes] = useState(mockAttributes);
  const [energyLevel, setEnergyLevel] = useState(70);

  const handleCompleteQuest = async (questId: string) => {
    try {
      const response = await fetch(`/api/quests/${questId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          energyLevel,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update quest status
        setQuests((prev) =>
          prev.map((q) =>
            q.id === questId ? { ...q, status: "completed" } : q
          )
        );

        // Update attributes
        setAttributes((prev) => ({
          focus: prev.focus + data.attributeChanges.focus,
          execution: prev.execution + data.attributeChanges.execution,
          creativity: prev.creativity + data.attributeChanges.creativity,
          learning: prev.learning + data.attributeChanges.learning,
          resilience: prev.resilience + data.attributeChanges.resilience,
        }));
      }
    } catch (error) {
      console.error("Error completing quest:", error);
      // Update locally anyway
      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId ? { ...q, status: "completed" } : q
        )
      );
    }
  };

  const handleSkipQuest = async (questId: string) => {
    try {
      await fetch(`/api/quests/${questId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "skipped",
          energyLevel,
        }),
      });

      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId ? { ...q, status: "skipped" } : q
        )
      );
    } catch (error) {
      console.error("Error skipping quest:", error);
      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId ? { ...q, status: "skipped" } : q
        )
      );
    }
  };

  const handlePostponeQuest = async (questId: string) => {
    try {
      await fetch(`/api/quests/${questId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "postponed",
          energyLevel,
        }),
      });

      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId ? { ...q, status: "postponed" } : q
        )
      );
    } catch (error) {
      console.error("Error postponing quest:", error);
      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId ? { ...q, status: "postponed" } : q
        )
      );
    }
  };

  const completedCount = quests.filter((q) => q.status === "completed").length;
  const totalCount = quests.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-gray-900">
              PathForge
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/review">
              <Button variant="outline" size="sm">
                Weekly Review
              </Button>
            </Link>
            <Link href="/timeline">
              <Button variant="outline" size="sm">
                Timeline
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Current Path and Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Path */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Path</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">产品开发型路线</h3>
                  <p className="text-gray-600">通过连续开源项目建立作品集和产品能力。</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">{completionRate}%</div>
                  <div className="text-sm text-gray-500">Week Progress</div>
                </div>
              </div>
            </div>

            {/* Energy Level */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Today&apos;s Energy</h2>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-medium text-gray-900">{energyLevel}%</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {energyLevel < 30
                  ? "Low energy - consider lighter tasks"
                  : energyLevel < 70
                  ? "Moderate energy - good for regular tasks"
                  : "High energy - great for challenging tasks!"}
              </p>
            </div>

            {/* Today's Quests */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Today&apos;s Quests</h2>
              <div className="space-y-4">
                {quests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={handleCompleteQuest}
                    onSkip={handleSkipQuest}
                    onPostpone={handlePostponeQuest}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Attributes and Skills */}
          <div className="space-y-6">
            {/* Attributes Panel */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Attributes</h2>
              <div className="space-y-3">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key}
                      </span>
                      <span className="text-sm text-gray-500">{value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${Math.min(value * 5, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Tree Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skill Tree</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">产品设计</span>
                  <span className="text-sm text-gray-500">Lv.1 20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">前端实现</span>
                  <span className="text-sm text-gray-500">Lv.1 10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">后端接口</span>
                  <span className="text-sm text-gray-500">Lv.1 5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">模型 API</span>
                  <span className="text-sm text-gray-500">Lv.1 15%</span>
                </div>
              </div>
            </div>

            {/* 7-Day Map */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7-Day Quest Map</h2>
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                  <div
                    key={day}
                    className={`text-center p-2 rounded ${
                      index < 2
                        ? "bg-green-100 text-green-700"
                        : index === 2
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <div className="text-xs font-medium">{day}</div>
                    <div className="text-lg font-bold">
                      {index < 2 ? "✓" : index === 2 ? "•" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
