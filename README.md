<div align="center">

# 🎮 PathForge

### Simulate your possible futures. Choose one. Turn it into quests.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-purple)](https://openai.com/)

[![GitHub Stars](https://img.shields.io/github/stars/Sleepydeerlu/Parallel-me?style=social)](https://github.com/Sleepydeerlu/Parallel-me/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Sleepydeerlu/Parallel-me?style=social)](https://github.com/Sleepydeerlu/Parallel-me/network/members)

**PathForge** is an AI-powered life simulation and RPG growth system that transforms your goals, dreams, and dilemmas into immersive, actionable quests.

**不再是选择题，而是无限可能。**

[🚀 Quick Start](#quickstart) · [✨ Features](#features) · [🎯 How It Works](#how-it-works) · [📖 Documentation](#documentation)

</div>

---

## 🤔 Why PathForge?

Most productivity tools ask: **"What do you need to do today?"**

But what you really need to know is:

> - **Where am I going?**
> - **What paths are available?**
> - **Which path should I choose?**
> - **What should I do right now?**

**PathForge** is different. It's the first open-source tool that combines **AI-powered life simulation** with **RPG-style quest systems** to help you navigate life's biggest decisions.

### The Problem

- 🎯 Traditional todo apps don't help you choose **what** to do
- 🧭 Life planning tools are too rigid and formulaic
- 🎮 Gamified apps feel shallow and disconnected from reality
- 🤖 AI chatbots give advice but don't help you **execute**

### The Solution

PathForge simulates multiple life paths, lets you explore them through immersive dialogue, and then transforms your chosen path into concrete, gamified quests.

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>🎭 Immersive Life Simulation</h3>
      <p>Experience different life paths through rich, narrative-driven dialogue. The AI creates vivid scenarios that help you truly feel what each path would be like.</p>
    </td>
    <td width="50%">
      <h3>⚔️ RPG Quest System</h3>
      <p>Transform abstract goals into concrete, gamified quests with difficulty levels, time estimates, and acceptance criteria. Level up as you progress!</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔀 Infinite Path Exploration</h3>
      <p>No pre-defined paths. The AI dynamically generates unique life paths based on your specific situation, goals, and constraints.</p>
    </td>
    <td width="50%">
      <h3>📊 Attribute Tracking</h3>
      <p>Track your growth across 7 core attributes: Courage, Wisdom, Empathy, Creativity, Resilience, Communication, and Execution.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🧠 Context-Aware AI</h3>
      <p>The AI remembers your conversation history, adapts to your emotional state, and evolves the narrative based on your choices.</p>
    </td>
    <td width="50%">
      <h3>💾 Persistent Progress</h3>
      <p>Your journey is automatically saved. Pick up where you left off, even after closing the browser.</p>
    </td>
  </tr>
</table>

---

## 🎯 How It Works

```
1. Share Your Situation
   └─ Tell PathForge about your goals, dilemmas, or dreams

2. Explore Infinite Paths
   └─ AI generates unique life paths tailored to your situation

3. Choose Your Path
   └─ Select the path that resonates with you

4. Complete Quests
   └─ Transform your path into actionable, gamified quests

5. Level Up
   └─ Track your growth and unlock new possibilities
```

### Example Journey

```
You: 我是一名大三计算机专业学生，纠结要不要考研

PathForge: 
┌─────────────────────────────────────────────────────────┐
│ 深夜的图书馆自习区，你的笔记本电脑屏幕上闪烁着一个     │
│ 编程入门教程。旁边摊开的是你的文学概论课本...           │
│                                                         │
│ 🎯 New Quest: 完成第一个程序                            │
│ 🌟 New Path: 从文学到代码的跨界之路                     │
│                                                         │
│ Actions:                                                │
│ • 开始跟着教程敲代码                                    │
│ • 回复同学消息，问问转行的事                            │
│ • 打开知乎搜索'文科生转程序员'                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- An AI API key (OpenAI compatible)

### Installation

```bash
# Clone the repository
git clone https://github.com/Sleepydeerlu/Parallel-me.git
cd Parallel-me/pathforge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local with your API key
# OPENAI_API_KEY=your-api-key
# OPENAI_BASE_URL=https://api.openai.com/v1
# OPENAI_MODEL=gpt-4

# Start the development server
npm run dev
```

Open [http://localhost:3000/play](http://localhost:3000/play) to start your journey.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your AI API key | Required |
| `OPENAI_BASE_URL` | API base URL | `https://api.openai.com/v1` |
| `OPENAI_MODEL` | Model to use | `gpt-4` |

**Supported AI Providers:**
- OpenAI
- Azure OpenAI
- Local models (Ollama)
- Any OpenAI-compatible API

---

## 🏗️ Architecture

```
pathforge/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/           # Chat API endpoints
│   │   │   └── chat/stream/    # Streaming chat API
│   │   ├── play/               # Main play page
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   └── chat/               # Chat UI components
│   │       ├── chat-interface.tsx
│   │       ├── attribute-panel.tsx
│   │       ├── path-map.tsx
│   │       └── quest-list.tsx
│   └── lib/
│       ├── ai/                 # AI engine
│       │   ├── engine.ts       # Core AI logic
│       │   ├── context.ts      # Context management
│       │   └── storage.ts      # Local storage
│       ├── types.ts            # Shared types
│       └── constants.ts        # Shared constants
└── public/                     # Static assets
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI components |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Zod](https://zod.dev/) | Schema validation |
| [OpenAI API](https://platform.openai.com/) | AI capabilities |

---

## 📖 Documentation

### API Endpoints

#### Chat API
```http
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "我想转行做程序员" }
  ],
  "context": "optional-context-string"
}
```

#### Streaming Chat API
```http
POST /api/chat/stream
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "我想转行做程序员" }
  ]
}
```

### Response Format

```json
{
  "narrative": "场景描写和对话",
  "scene": {
    "location": "图书馆",
    "time": "深夜",
    "atmosphere": "专注而迷茫"
  },
  "actions": [
    {
      "id": "start_coding",
      "label": "开始跟着教程敲代码",
      "description": "动手实践是最好的学习方式",
      "risk": "low"
    }
  ],
  "pathUnlocks": [
    {
      "id": "career_change",
      "name": "从文学到代码的跨界之路",
      "description": "用文科生的视角重新定义编程"
    }
  ],
  "quests": [
    {
      "id": "quest_hello_world",
      "title": "完成第一个程序",
      "description": "花30分钟完成Hello World程序",
      "difficulty": 1,
      "estimatedMinutes": 30
    }
  ],
  "attributeChanges": {
    "courage": 2,
    "wisdom": 1
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

```bash
# Fork the repo
# Clone your fork
git clone https://github.com/your-username/Parallel-me.git

# Create a branch
git checkout -b feature/amazing-feature

# Make your changes
npm run dev

# Test your changes
npm run build

# Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [OpenAI](https://openai.com/) - AI capabilities

---

<div align="center">

**[⬆ back to top](#-pathforge)**

Made with ❤️ by the PathForge community

</div>
