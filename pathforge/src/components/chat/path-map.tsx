"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { PATH_STATUS_CONFIG } from "@/lib/constants";
import type { Path } from "@/lib/types";

interface PathMapProps {
  paths: Path[];
  activePathId?: string;
  onPathClick?: (pathId: string) => void;
  className?: string;
}

const PathMap = memo(function PathMap({ paths, activePathId, onPathClick, className }: PathMapProps) {
  if (paths.length === 0) {
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 ${className}`}>
        <h3 className="text-gray-300 text-sm font-medium mb-3">人生路线图</h3>
        <div className="text-gray-500 text-sm text-center py-4">
          开始对话，解锁你的人生路线...
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 ${className}`}>
      <h3 className="text-gray-300 text-sm font-medium mb-3">人生路线图</h3>
      <div className="space-y-2">
        {paths.map((path, index) => {
          const config = PATH_STATUS_CONFIG[path.status] || PATH_STATUS_CONFIG.locked;
          const isActive = path.id === activePathId;

          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => path.status !== "locked" && onPathClick?.(path.id)}
              className={`relative p-3 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? "border-indigo-500 bg-indigo-900/30"
                  : path.status === "locked"
                  ? "border-gray-700 bg-gray-800/50 cursor-not-allowed"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{config.label}</span>
                  <span className={`font-medium ${config.textColor}`}>
                    {path.name}
                  </span>
                </div>
                {path.status !== "locked" && (
                  <span className="text-gray-400 text-xs">{path.progress}%</span>
                )}
              </div>
              
              {path.status !== "locked" && (
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${path.progress}%` }}
                    transition={{ duration: 0.5 }}
                    className={`${config.color} h-1 rounded-full`}
                  />
                </div>
              )}
              
              {path.description && (
                <p className="mt-1 text-gray-400 text-xs">{path.description}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default PathMap;
