"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/chat/chat-interface";
import AttributePanel from "@/components/chat/attribute-panel";
import PathMap from "@/components/chat/path-map";
import QuestList from "@/components/chat/quest-list";

interface Path {
  id: string;
  name: string;
  description: string;
  status: "locked" | "unlocked" | "active" | "completed" | "abandoned";
  progress: number;
}

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

export default function PlayPage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [attributes, setAttributes] = useState({
    courage: 10,
    wisdom: 10,
    empathy: 10,
    creativity: 10,
    resilience: 10,
    communication: 10,
    execution: 10,
  });
  const [paths, setPaths] = useState<Path[]>([]);
  const [activePathId, setActivePathId] = useState<string | undefined>();
  const [quests, setQuests] = useState<Quest[]>([]);

  const handleAction = (actionId: string) => {
    console.log("Action:", actionId);
  };

  const handleQuestAccept = (quest: Quest) => {
    setQuests((prev) => [
      ...prev,
      { ...quest, status: "active" },
    ]);
  };

  const handleQuestComplete = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, status: "completed" } : q
      )
    );

    // 增加属性
    setAttributes((prev) => ({
      ...prev,
      execution: prev.execution + 1,
    }));
  };

  const handlePathClick = (pathId: string) => {
    setActivePathId(pathId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* 顶部导航 */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">PathForge</h1>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400 text-sm">探索无限可能</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-gray-400 hover:text-white p-2"
            >
              {showSidebar ? "◀" : "▶"}
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 聊天区域 */}
        <div className="flex-1">
          <ChatInterface
            onAction={handleAction}
            onQuestAccept={handleQuestAccept}
          />
        </div>

        {/* 侧边栏 */}
        {showSidebar && (
          <div className="w-80 bg-gray-900 border-l border-gray-700 overflow-y-auto p-4 space-y-4">
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
          </div>
        )}
      </div>
    </div>
  );
}
