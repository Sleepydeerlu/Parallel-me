"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    identity: "",
    currentStage: "",
    goal: "",
    dilemma: "",
    timeHorizon: "12 months",
    weeklyHours: 15,
    currentSkills: [] as string[],
    constraints: [] as string[],
  });

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Generate paths and navigate
      setIsGenerating(true);
      try {
        const response = await fetch("/api/paths", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          // Store paths in sessionStorage for the paths page
          sessionStorage.setItem("generatedPaths", JSON.stringify(data.paths));
          sessionStorage.setItem("goalInput", JSON.stringify(formData));
          router.push("/paths");
        } else {
          console.error("Failed to generate paths");
          // Navigate anyway with mock data
          router.push("/paths");
        }
      } catch (error) {
        console.error("Error:", error);
        // Navigate anyway with mock data
        router.push("/paths");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tell us about yourself</h1>
          <p className="mt-2 text-gray-600">
            Help us understand your current situation and goals.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 3</span>
            <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Identity and Goal */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Identity & Goal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  当前身份 (Current Identity)
                </label>
                <input
                  type="text"
                  value={formData.identity}
                  onChange={(e) => handleInputChange("identity", e.target.value)}
                  placeholder="例如：大三学生、初级前端工程师、自由撰稿人"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  当前阶段 (Current Stage)
                </label>
                <input
                  type="text"
                  value={formData.currentStage}
                  onChange={(e) => handleInputChange("currentStage", e.target.value)}
                  placeholder="例如：在校学习、刚工作1-2年、自由职业中"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  长期目标 (Long-term Goal)
                </label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => handleInputChange("goal", e.target.value)}
                  placeholder="例如：一年内成为 AI 产品开发者"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  当前困惑 (Current Dilemma)
                </label>
                <textarea
                  value={formData.dilemma}
                  onChange={(e) => handleInputChange("dilemma", e.target.value)}
                  placeholder="例如：纠结考研还是就业"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Time and Skills */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Time & Skills</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  时间周期 (Time Horizon)
                </label>
                <select
                  value={formData.timeHorizon}
                  onChange={(e) => handleInputChange("timeHorizon", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="3 months">3 个月</option>
                  <option value="6 months">6 个月</option>
                  <option value="12 months">12 个月</option>
                  <option value="24 months">24 个月</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  每周可投入时间 (Weekly Hours)
                </label>
                <input
                  type="number"
                  value={formData.weeklyHours}
                  onChange={(e) => handleInputChange("weeklyHours", parseInt(e.target.value))}
                  min={1}
                  max={40}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  现有能力 (Current Skills)
                </label>
                <input
                  type="text"
                  placeholder="例如：Python basic, frontend basic"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-500">用逗号分隔多个技能</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Constraints */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Constraints & Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  约束条件 (Constraints)
                </label>
                <textarea
                  placeholder="例如：不想完全放弃学业、预算有限"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-500">描述你面临的限制条件</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  不想牺牲什么 (What you don&apos;t want to sacrifice)
                </label>
                <textarea
                  placeholder="例如：健康、家庭时间、兴趣爱好"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button onClick={handleNext} disabled={isGenerating}>
            {isGenerating ? "Generating..." : step === 3 ? "Generate Paths" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
