"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Action {
  id: string;
  label: string;
  description: string;
  risk: "low" | "medium" | "high";
  reward?: string;
}

interface Scene {
  location: string;
  time: string;
  atmosphere: string;
  description: string;
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

interface ChatInterfaceProps {
  onAction?: (actionId: string) => void;
  onQuestAccept?: (quest: Quest) => void;
}

export default function ChatInterface({ onAction, onQuestAccept }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentActions, setCurrentActions] = useState<Action[]>([]);
  const [currentQuests, setCurrentQuests] = useState<Quest[]>([]);
  const [placeholder, setPlaceholder] = useState("告诉我你的情况...");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `欢迎来到PathForge。\n\n在这里，你不是在规划人生，而是在探索人生的无限可能。\n\n告诉我，你是谁？你最近在思考什么？`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setCurrentScene({
      location: "起点",
      time: "现在",
      atmosphere: "充满期待",
      description: "你站在一段新旅程的起点，周围是无限的可能。",
    });
    setCurrentActions([
      {
        id: "introduce",
        label: "自我介绍",
        description: "告诉我你是谁，你的现状",
        risk: "low",
      },
      {
        id: "confused",
        label: "我很迷茫",
        description: "说出你的困惑",
        risk: "low",
      },
      {
        id: "explore",
        label: "我想探索",
        description: "直接开始探索不同的人生路线",
        risk: "low",
      },
    ]);
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.narrative,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setCurrentScene(data.scene || null);
        setCurrentActions(data.actions || []);
        setCurrentQuests(data.quests || []);
        setPlaceholder(data.freeInputPlaceholder || "告诉我你的想法...");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: Action) => {
    handleSendMessage(action.label);
    onAction?.(action.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* 场景指示器 */}
      {currentScene && (
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">📍 {currentScene.location}</span>
              <span className="text-gray-400">🕐 {currentScene.time}</span>
            </div>
            <span className="text-gray-400 italic">{currentScene.atmosphere}</span>
          </div>
        </div>
      )}

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 加载指示器 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-700 rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* 可选动作 */}
        {currentActions.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 justify-start"
          >
            {currentActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-full px-4 py-2 text-sm transition-colors border border-gray-600 hover:border-gray-500"
              >
                {action.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* 新任务提示 */}
        {currentQuests.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-900/50 border border-indigo-700 rounded-xl p-4"
          >
            <div className="text-indigo-300 text-sm font-medium mb-2">🎯 新任务解锁</div>
            {currentQuests.map((quest) => (
              <div key={quest.id} className="mb-2 last:mb-0">
                <div className="text-white font-medium">{quest.title}</div>
                <div className="text-gray-300 text-sm mt-1">{quest.description}</div>
                <button
                  onClick={() => onQuestAccept?.(quest)}
                  className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  接受任务 →
                </button>
              </div>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
