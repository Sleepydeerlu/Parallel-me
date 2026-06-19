"use client";

import { motion } from "framer-motion";

interface Attributes {
  courage: number;
  wisdom: number;
  empathy: number;
  creativity: number;
  resilience: number;
  communication: number;
  execution: number;
}

interface AttributePanelProps {
  attributes: Attributes;
  className?: string;
}

const attributeConfig = {
  courage: { label: "勇气", icon: "⚔️", color: "bg-red-500" },
  wisdom: { label: "智慧", icon: "📚", color: "bg-blue-500" },
  empathy: { label: "共情", icon: "❤️", color: "bg-pink-500" },
  creativity: { label: "创造力", icon: "🎨", color: "bg-purple-500" },
  resilience: { label: "韧性", icon: "🛡️", color: "bg-yellow-500" },
  communication: { label: "沟通力", icon: "💬", color: "bg-green-500" },
  execution: { label: "执行力", icon: "⚡", color: "bg-orange-500" },
};

export default function AttributePanel({ attributes, className }: AttributePanelProps) {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 ${className}`}>
      <h3 className="text-gray-300 text-sm font-medium mb-3">属性面板</h3>
      <div className="space-y-3">
        {Object.entries(attributeConfig).map(([key, config]) => {
          const value = attributes[key as keyof Attributes] || 0;
          const percentage = Math.min((value / 30) * 100, 100);

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{config.icon}</span>
                  <span className="text-gray-300 text-sm">{config.label}</span>
                </div>
                <span className="text-gray-400 text-sm">{value}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`${config.color} h-2 rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
