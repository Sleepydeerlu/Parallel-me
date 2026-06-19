"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ATTRIBUTE_CONFIG, ATTRIBUTE_KEYS } from "@/lib/constants";
import type { Attributes } from "@/lib/types";

interface AttributePanelProps {
  attributes: Attributes;
  className?: string;
}

const AttributePanel = memo(function AttributePanel({ attributes, className }: AttributePanelProps) {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 ${className}`}>
      <h3 className="text-gray-300 text-sm font-medium mb-3">属性面板</h3>
      <div className="space-y-3">
        {ATTRIBUTE_KEYS.map((key) => {
          const value = attributes[key] || 0;
          const config = ATTRIBUTE_CONFIG[key];
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
});

export default AttributePanel;
