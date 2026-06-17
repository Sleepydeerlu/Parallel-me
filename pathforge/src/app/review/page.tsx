"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PathAlignment {
  pathId: string;
  pathName: string;
  score: number;
}

interface Review {
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
  pathAlignment: PathAlignment[];
  recommendations: string[];
}

const mockReview: Review = {
  weekStart: "2026-06-17",
  weekEnd: "2026-06-23",
  completionRate: 0.71,
  completedQuests: 5,
  skippedQuests: 2,
  summary: "本周你在产品定位和执行力上有明显推进。",
  attributeChanges: {
    execution: 5,
    learning: 3,
    creativity: 2,
    focus: 1,
    resilience: 0,
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
  ],
};

export default function ReviewPage() {
  const [review, setReview] = useState<Review>(mockReview);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Try to fetch review from API
    const fetchReview = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goalId: "goal_001",
            weekStart: "2026-06-17",
            weekEnd: "2026-06-23",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.review) {
            setReview(data.review);
          }
        }
      } catch (error) {
        console.error("Failed to fetch review:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, []);

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
            <span className="text-gray-600">Weekly Review</span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Weekly Review</h1>
          <p className="mt-2 text-gray-600">
            {mockReview.weekStart} - {mockReview.weekEnd}
          </p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completion Rate</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#6366f1"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - mockReview.completionRate)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {Math.round(mockReview.completionRate * 100)}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockReview.completedQuests}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{mockReview.skippedQuests}</div>
              <div className="text-sm text-gray-500">Skipped</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">本周总结</h2>
          <p className="text-gray-700">{mockReview.summary}</p>
        </div>

        {/* Attribute Changes */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">属性变化</h2>
          <div className="space-y-3">
            {Object.entries(mockReview.attributeChanges).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                <span className={`text-sm font-medium ${value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-500"}`}>
                  {value > 0 ? `+${value}` : value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Path Alignment */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">路线匹配度</h2>
          <div className="space-y-4">
            {mockReview.pathAlignment.map((path) => (
              <div key={path.pathId}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{path.pathName}</span>
                  <span className="text-sm text-gray-500">{path.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      path.score >= 70 ? "bg-green-500" : path.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${path.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">下周建议</h2>
          <ul className="space-y-3">
            {mockReview.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg">Continue Current Path</Button>
          </Link>
          <Link href="/paths">
            <Button variant="outline" size="lg">Re-simulate Paths</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
