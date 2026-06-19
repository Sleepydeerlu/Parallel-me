"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ChatInterface from "@/components/chat/chat-interface";
import AttributePanel from "@/components/chat/attribute-panel";
import PathMap from "@/components/chat/path-map";
import QuestList from "@/components/chat/quest-list";
import { ErrorBoundary } from "@/components/error-boundary";
import { clearContextStorage } from "@/lib/ai/storage";
import { DEFAULT_ATTRIBUTES } from "@/lib/constants";
import type { Path, Quest, ContextStats, Attributes } from "@/lib/types";

function PlayPageContent() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [attributes, setAttributes] = useState<Attributes>({ ...DEFAULT_ATTRIBUTES });
  const [paths, setPaths] = useState<Path[]>([]);
  const [activePathId, setActivePathId] = useState<string | undefined>();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [contextStats, setContextStats] = useState<ContextStats | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleClearChat = useCallback(() => {
    if (confirm("确定要清除对话历史吗？这将删除所有对话数据。")) {
      clearContextStorage();
      setResetKey((prev) => prev + 1);
      setPaths([]);
      setQuests([]);
      setAttributes({ ...DEFAULT_ATTRIBUTES });
    }
  }, []);

  const handleAction = useCallback((actionId: string) => {
    console.log("Action:", actionId);
  }, []);

  const handleQuestAccept = useCallback((quest: Quest) => {
    setQuests((prev) => {
      if (prev.some((q) => q.id === quest.id)) {
        return prev;
      }
      return [...prev, quest];
    });
  }, []);

  const handleQuestComplete = useCallback((questId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, status: "completed" } : q
      )
    );
    setAttributes((prev) => ({
      ...prev,
      execution: prev.execution + 1,
    }));
  }, []);

  const handlePathUnlock = useCallback((path: { id: string; name: string; description: string }) => {
    setPaths((prev) => {
      if (prev.some((p) => p.id === path.id)) {
        return prev;
      }
      return [
        ...prev,
        {
          ...path,
          status: "unlocked" as const,
          progress: 0,
        },
      ];
    });
  }, []);

  const handlePathClick = useCallback((pathId: string) => {
    setActivePathId(pathId);
    setPaths((prev) =>
      prev.map((p) =>
        p.id === pathId
          ? { ...p, status: "active" as const }
          : { ...p, status: p.status === "active" ? "unlocked" as const : p.status }
      )
    );
  }, []);

  const handleContextUpdate = useCallback((stats: ContextStats) => {
    setContextStats(stats);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">PathForge</h1>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400 text-sm">探索无限可能</span>
          </div>
          <div className="flex items-center space-x-4">
            {contextStats && (
              <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500">
                <span>消息: {contextStats.messageCount}</span>
                <span>•</span>
                <span>路线: {contextStats.pathCount}</span>
                <span>•</span>
                <span>任务: {contextStats.questCount}</span>
              </div>
            )}
            <button
              onClick={handleClearChat}
              className="text-gray-400 hover:text-red-400 p-2 transition-colors text-sm"
              title="清除对话历史"
            >
              🗑️
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-gray-400 hover:text-white p-2 transition-colors"
            >
              {showSidebar ? "◀" : "▶"}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <ChatInterface
            key={resetKey}
            onAction={handleAction}
            onQuestAccept={handleQuestAccept}
            onPathUnlock={handlePathUnlock}
            onContextUpdate={handleContextUpdate}
            resetKey={resetKey}
          />
        </div>

        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: showSidebar ? 320 : 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 border-l border-gray-700 overflow-hidden"
        >
          <div className="w-80 h-full overflow-y-auto p-4 space-y-4">
            <AttributePanel attributes={attributes} />
            <PathMap
              paths={paths}
              activePathId={activePathId}
              onPathClick={handlePathClick}
            />
            <QuestList
              quests={quests}
              onComplete={handleQuestComplete}
            />
            
            {/* Help */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-gray-300 text-sm font-medium mb-2">使用提示</h3>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• 描述你的现状和困惑</li>
                <li>• 点击选项或自由输入</li>
                <li>• 路线会随对话解锁</li>
                <li>• 任务会在对话中产生</li>
                <li>• 完成任务提升属性</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <ErrorBoundary>
      <PlayPageContent />
    </ErrorBoundary>
  );
}
