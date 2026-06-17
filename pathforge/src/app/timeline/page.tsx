import Link from "next/link";
import { Button } from "@/components/ui/button";

const timelineData = [
  {
    period: "30天",
    goal: "完成第一个 AI 产品原型",
    tasks: ["产品定位文档", "技术选型", "MVP开发", "用户测试"],
    skills: ["产品设计", "前端开发", "API集成"],
    risks: ["技术难点", "时间管理"],
  },
  {
    period: "90天",
    goal: "发布 3 个开源 AI 项目",
    tasks: ["项目1发布", "项目2开发", "项目3规划", "社区运营"],
    skills: ["开源发布", "技术写作", "社区管理"],
    risks: ["质量控制", "精力分散"],
  },
  {
    period: "180天",
    goal: "建立个人技术品牌",
    tasks: ["技术博客", "开源贡献", "技术分享", "作品集"],
    skills: ["技术表达", "个人品牌", "网络建设"],
    risks: ["内容质量", "持续性"],
  },
  {
    period: "365天",
    goal: "获得 AI 产品开发者职位",
    tasks: ["简历优化", "面试准备", "作品展示", "求职申请"],
    skills: ["面试技巧", "职业规划", "薪资谈判"],
    risks: ["市场变化", "竞争压力"],
  },
];

export default function TimelinePage() {
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
            <span className="text-gray-600">Timeline</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Your Growth Timeline</h1>
          <p className="mt-2 text-gray-600">
            Track your progress towards becoming an AI product developer.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <div key={index} className="relative flex items-start">
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow" />

                {/* Content */}
                <div className="ml-16 bg-white rounded-lg shadow-sm p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{item.period}</h2>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                      {item.goal}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Tasks */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Key Tasks</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {item.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Skills to Develop</h3>
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Risks */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Potential Risks</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {item.risks.map((risk, riskIndex) => (
                          <li key={riskIndex} className="flex items-start">
                            <span className="text-yellow-500 mr-2">!</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Position */}
        <div className="mt-8 bg-indigo-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-indigo-900 mb-2">Current Position</h2>
          <p className="text-indigo-700">
            You are at the beginning of your 30-day journey. Focus on completing your first AI product prototype.
          </p>
          <div className="mt-4">
            <Link href="/dashboard">
              <Button>Continue to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
