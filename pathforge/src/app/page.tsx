"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const examples = [
  "我想一年内成为 AI 产品开发者，但纠结要不要考研。",
  "我想半年内做出第一个开源产品。",
  "我想转行，但不知道走技术还是产品。",
  "我想建立个人品牌，但不知道从何开始。",
  "我想学习一门新技能，但总是坚持不下去。",
];

const features = [
  {
    icon: "💬",
    title: "无限对话",
    description: "与AI持续对话，探索人生的无限可能，没有预设选项。",
  },
  {
    icon: "🌟",
    title: "动态路线",
    description: "对话中自然解锁新路线，路线会因你的表述而改变。",
  },
  {
    icon: "🎯",
    title: "实时任务",
    description: "根据对话实时生成任务，每次体验都不同。",
  },
];

const stats = [
  { value: "∞", label: "平行路线" },
  { value: "实时", label: "动态生成" },
  { value: "7", label: "核心属性" },
  { value: "沉浸", label: "式体验" },
];

export default function Home() {
  const [currentExample, setCurrentExample] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const example = examples[currentExample];
    let index = 0;
    setDisplayText("");
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (index < example.length) {
        setDisplayText(example.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        
        // Move to next example after delay
        setTimeout(() => {
          setCurrentExample((prev) => (prev + 1) % examples.length);
        }, 2000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentExample]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full opacity-50 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-50 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full mb-8">
              <span className="text-indigo-600 text-sm font-medium">
                ✨ Open Source Life Simulator
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900">
              Simulate your
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                possible futures.
              </span>
            </h1>

            <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              Choose one. Turn it into quests.
            </p>

            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              PathForge helps you explore life paths, choose one, and build it through RPG-style quests.
              Transform your goals into actionable daily tasks with AI-powered guidance.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/play">
                <Button size="lg" className="px-8 py-4 text-lg bg-indigo-600 hover:bg-indigo-700">
                  🎮 开始探索 (v2 Demo)
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  📋 传统模式 (v1)
                </Button>
              </Link>
            </div>

            <div className="mt-6">
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                ✨ v2: 无限对话 + 动态路线 + 沉浸式体验
              </span>
            </div>
          </motion.div>

          {/* Typing Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="ml-2 text-sm text-gray-400">PathForge Terminal</span>
              </div>
              <div className="font-mono text-sm">
                <div className="text-gray-400">$ pathforge --goal</div>
                <div className="mt-2 text-gray-900">
                  <span className="text-indigo-600">&gt;</span> {displayText}
                  {isTyping && <span className="animate-pulse">|</span>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-indigo-600">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900">How PathForge Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to transform your life goals into actionable quests
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900">See it in action</h2>
            <p className="mt-4 text-lg text-gray-600">
              Watch how PathForge transforms a simple goal into a structured quest system
            </p>
          </motion.div>

          {/* Mock Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Mock Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-900">PathForge</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">Dashboard</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      Week 1
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Mock Quest Cards */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">main</span>
                        <span className="text-sm text-gray-500">60 min</span>
                      </div>
                      <h4 className="font-medium text-gray-900">完成第一个 AI 工具的产品定位文档</h4>
                      <p className="text-sm text-gray-600 mt-1">为你的第一个 AI 产品定义目标用户、痛点和 MVP。</p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">daily</span>
                        <span className="text-sm text-gray-500">30 min</span>
                      </div>
                      <h4 className="font-medium text-gray-900">学习 React 基础组件开发</h4>
                      <p className="text-sm text-gray-600 mt-1">学习 React 组件的基础知识和最佳实践。</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">side</span>
                        <span className="text-sm text-gray-500">20 min</span>
                      </div>
                      <h4 className="font-medium text-gray-900">阅读一篇 AI 产品设计文章</h4>
                      <p className="text-sm text-gray-600 mt-1">阅读一篇关于 AI 产品设计的文章并总结要点。</p>
                    </div>
                  </div>

                  {/* Mock Attributes */}
                  <div className="space-y-4">
                    <div className="bg-white border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Attributes</h4>
                      <div className="space-y-3">
                        {[
                          { name: "Focus", value: 12, color: "bg-indigo-500" },
                          { name: "Execution", value: 18, color: "bg-green-500" },
                          { name: "Learning", value: 15, color: "bg-blue-500" },
                          { name: "Creativity", value: 10, color: "bg-purple-500" },
                          { name: "Resilience", value: 11, color: "bg-yellow-500" },
                        ].map((attr) => (
                          <div key={attr.name}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{attr.name}</span>
                              <span className="text-gray-500">{attr.value}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`${attr.color} h-2 rounded-full`}
                                style={{ width: `${Math.min(attr.value * 5, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Current Path</h4>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium text-indigo-600">产品开发型路线</div>
                        <div className="mt-1">通过连续开源项目建立作品集和产品能力。</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Input Examples */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900">What&apos;s your goal or dilemma?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Here are some examples of what you can ask PathForge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <p className="text-gray-700">&ldquo;{example}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900">Built with Modern Tech</h2>
            <p className="mt-4 text-lg text-gray-600">
              Powered by the latest technologies for the best experience
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Next.js", icon: "⚡" },
              { name: "React", icon: "⚛️" },
              { name: "TypeScript", icon: "📘" },
              { name: "Tailwind CSS", icon: "🎨" },
              { name: "shadcn/ui", icon: "🧩" },
              { name: "Zod", icon: "✅" },
              { name: "Framer Motion", icon: "🎬" },
              { name: "OpenAI", icon: "🤖" },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors"
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="font-medium text-gray-900">{tech.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to forge your path?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Start simulating your possible futures today
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/onboarding">
                <Button size="lg" className="px-8 py-4 text-lg bg-white text-indigo-600 hover:bg-gray-100">
                  🚀 Get Started Free
                </Button>
              </Link>
              <a href="https://github.com/Sleepydeerlu/Parallel-me" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                  ⭐ Star on GitHub
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">PathForge</h3>
              <p className="text-gray-400">
                Simulate your possible futures. Choose one. Turn it into quests.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/onboarding" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://github.com/Sleepydeerlu/Parallel-me" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://github.com/Sleepydeerlu/Parallel-me/blob/main/README.md" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://github.com/Sleepydeerlu/Parallel-me/blob/main/CONTRIBUTING.md" className="hover:text-white transition-colors">Contributing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://github.com/Sleepydeerlu/Parallel-me/issues" className="hover:text-white transition-colors">Issues</a></li>
                <li><a href="https://github.com/Sleepydeerlu/Parallel-me/discussions" className="hover:text-white transition-colors">Discussions</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2026 PathForge. Open Source under MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
