"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveContextToStorage, loadContextFromStorage } from "@/lib/ai/storage";
import { serializeContext } from "@/lib/ai/context-manager";
import { 
  WELCOME_MESSAGE, 
  INITIAL_SCENE, 
  INITIAL_ACTIONS 
} from "@/lib/constants";
import type { Quest, PathUnlock, Scene, Action, ContextStats } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    scene?: string;
    emotion?: string;
  };
}

interface ChatInterfaceProps {
  onAction?: (actionId: string) => void;
  onPathUnlock?: (path: PathUnlock) => void;
  onQuestUpdate?: (quests: Quest[]) => void;
  onContextUpdate?: (stats: ContextStats) => void;
  resetKey?: number;
}

const MessageBubble = memo(function MessageBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
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
  );
});

const ActionButton = memo(function ActionButton({ 
  action, 
  onClick, 
  index 
}: { 
  action: Action; 
  onClick: (action: Action) => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index }}
      onClick={() => onClick(action)}
      className="bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-full px-4 py-2 text-sm transition-all border border-gray-600 hover:border-gray-500 hover:scale-105"
      title={action.description}
    >
      {action.label}
    </motion.button>
  );
});

export default function ChatInterface({ 
  onAction, 
  onPathUnlock,
  onQuestUpdate,
  onContextUpdate,
  resetKey = 0
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentActions, setCurrentActions] = useState<Action[]>([]);
  const [currentPathUnlocks, setCurrentPathUnlocks] = useState<PathUnlock[]>([]);
  const [placeholder, setPlaceholder] = useState("告诉我你的情况...");
  const [context, setContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const resetToWelcome = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setContext(null);
    setCurrentScene(INITIAL_SCENE);
    setCurrentActions(INITIAL_ACTIONS);
    setCurrentPathUnlocks([]);
    setPlaceholder("告诉我你的情况...");
  }, []);

  useEffect(() => {
    if (resetKey > 0) {
      resetToWelcome();
      return;
    }

    const storedContext = loadContextFromStorage();
    if (storedContext && storedContext.recentMessages.length > 0) {
      const restoredMessages: Message[] = storedContext.recentMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        metadata: msg.metadata,
      }));
      setMessages(restoredMessages);
      setContext(serializeContext(storedContext));
      
      if (storedContext.currentScene) {
        setCurrentScene(storedContext.currentScene);
      }
      return;
    }

    resetToWelcome();
  }, [resetKey, resetToWelcome]);

  const handleSendMessage = useCallback(async (content: string) => {
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
    setCurrentActions([]);
    setCurrentPathUnlocks([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.narrative,
          timestamp: new Date(),
          metadata: {
            scene: data.scene?.location,
            emotion: data.emotionalState?.primary,
          },
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setCurrentScene(data.scene || null);
        setCurrentActions(data.actions || []);
        setCurrentPathUnlocks(data.pathUnlocks || []);
        setPlaceholder(data.freeInputPlaceholder || "告诉我你的想法...");
        
        if (data.context) {
          setContext(data.context);
          try {
            const contextObj = JSON.parse(data.context);
            saveContextToStorage(contextObj);
            
            // 通知父组件任务更新
            if (onQuestUpdate && contextObj.quests) {
              onQuestUpdate(contextObj.quests);
            }
          } catch (e) {
            console.error("Failed to save context:", e);
          }
        }
        
        if (data.contextStats) {
          onContextUpdate?.(data.contextStats);
        }
        
        if (data.pathUnlocks && data.pathUnlocks.length > 0) {
          data.pathUnlocks.forEach((path: PathUnlock) => {
            onPathUnlock?.(path);
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "抱歉，出现了一些问题。请再试一次。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, context, onContextUpdate, onPathUnlock, onQuestUpdate]);

  const handleActionClick = useCallback((action: Action) => {
    handleSendMessage(action.label);
    onAction?.(action.id);
  }, [handleSendMessage, onAction]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  }, [handleSendMessage, inputValue]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Scene indicator */}
      {currentScene && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-4 py-2"
        >
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">📍 {currentScene.location}</span>
              <span className="text-gray-400">🕐 {currentScene.time}</span>
            </div>
            <span className="text-gray-400 italic">{currentScene.atmosphere}</span>
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-700 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <span className="text-gray-400 text-sm">思考中...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {currentActions.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 justify-start"
          >
            {currentActions.map((action, index) => (
              <ActionButton
                key={action.id}
                action={action}
                onClick={handleActionClick}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Path unlocks */}
        {currentPathUnlocks.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-900/50 border border-purple-700 rounded-xl p-4"
          >
            <div className="text-purple-300 text-sm font-medium mb-2">🌟 新路线解锁</div>
            {currentPathUnlocks.map((path) => (
              <div key={path.id} className="mb-2 last:mb-0">
                <div className="text-white font-medium">{path.name}</div>
                <div className="text-gray-300 text-sm mt-1">{path.description}</div>
              </div>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 disabled:opacity-50 transition-all"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
