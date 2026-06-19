"use client";

import { motion } from "framer-motion";

interface Quest {
  id: string;
  title: string;
  narrative: string;
  description: string;
  difficulty: number;
  estimatedMinutes: number;
  type: "main" | "side" | "hidden" | "emergency" | string;
  status: "active" | "completed" | "failed" | "abandoned";
  acceptanceCriteria: string[];
}

interface QuestListProps {
  quests: Quest[];
  onQuestClick?: (questId: string) => void;
  onComplete?: (questId: string) => void;
  className?: string;
}

const typeConfig: Record<string, { color: string; label: string; icon: string }> = {
  main: { color: "bg-purple-900/50 border-purple-700", label: "主线", icon: "🎯" },
  side: { color: "bg-blue-900/50 border-blue-700", label: "支线", icon: "📌" },
  hidden: { color: "bg-yellow-900/50 border-yellow-700", label: "隐藏", icon: "🔮" },
  emergency: { color: "bg-red-900/50 border-red-700", label: "紧急", icon: "🚨" },
};

const statusConfig = {
  active: { color: "text-green-400", label: "进行中" },
  completed: { color: "text-gray-400", label: "已完成" },
  failed: { color: "text-red-400", label: "失败" },
  abandoned: { color: "text-gray-500", label: "已放弃" },
};

export default function QuestList({ quests, onQuestClick, onComplete, className }: QuestListProps) {
  const activeQuests = quests.filter((q) => q.status === "active");
  const completedQuests = quests.filter((q) => q.status === "completed");

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-300 text-sm font-medium">任务列表</h3>
        <span className="text-gray-500 text-xs">
          {completedQuests.length}/{quests.length} 完成
        </span>
      </div>

      {quests.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-4">
          继续对话，解锁新的任务...
        </div>
      ) : (
        <div className="space-y-2">
          {activeQuests.map((quest, index) => {
            const type = typeConfig[quest.type];

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onQuestClick?.(quest.id)}
                className={`p-3 rounded-lg border cursor-pointer hover:border-gray-600 transition-colors ${type.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">{type.icon}</span>
                      <span className="text-xs text-gray-400">{type.label}</span>
                      <span className="text-xs text-gray-500">
                        {quest.estimatedMinutes}分钟
                      </span>
                    </div>
                    <h4 className="text-white font-medium text-sm">{quest.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">{quest.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete?.(quest.id);
                    }}
                    className="ml-2 text-green-400 hover:text-green-300 text-xs"
                  >
                    完成
                  </button>
                </div>
              </motion.div>
            );
          })}

          {completedQuests.length > 0 && (
            <div className="pt-2 border-t border-gray-700">
              <div className="text-gray-500 text-xs mb-2">已完成</div>
              {completedQuests.slice(0, 3).map((quest) => (
                <div
                  key={quest.id}
                  className="text-gray-500 text-sm line-through py-1"
                >
                  {quest.title}
                </div>
              ))}
              {completedQuests.length > 3 && (
                <div className="text-gray-600 text-xs">
                  +{completedQuests.length - 3} 更多
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
