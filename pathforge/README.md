<div align="center">

# 🎮 PathForge

### Simulate your possible futures. Choose one. Turn it into quests.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[![GitHub Stars](https://img.shields.io/github/stars/Sleepydeerlu/Parallel-me?style=social)](https://github.com/Sleepydeerlu/Parallel-me/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Sleepydeerlu/Parallel-me?style=social)](https://github.com/Sleepydeerlu/Parallel-me/network/members)

<br />

[🚀 Get Started](#quickstart) · [🎮 Demo](#demo) · [📖 Documentation](#features) · [🤝 Contributing](#contributing)

</div>

---

## 🤔 Why PathForge?

Most productivity tools only ask: **"What do you need to do today?"**

But what you really need to know is:

> - **Where am I going?**
> - **What paths are available?**
> - **Which path should I choose?**
> - **What should I do right now?**

**PathForge** is the first open-source tool that combines **AI-powered life simulation** with **RPG-style quest systems** to help you navigate life's biggest decisions.

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>🎯 Parallel Path Simulation</h3>
      <p>Input your goal or dilemma, and AI generates multiple life paths with different approaches. Compare tradeoffs, risks, and rewards.</p>
    </td>
    <td width="50%">
      <h3>⚔️ RPG Quest System</h3>
      <p>Transform your chosen path into a 7-day quest map with daily tasks, difficulty levels, and acceptance criteria.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📊 Attribute Tracking</h3>
      <p>Track your growth across 5 core attributes: Focus, Execution, Learning, Creativity, and Resilience.</p>
    </td>
    <td width="50%">
      <h3>📈 Weekly Reviews</h3>
      <p>Get AI-powered weekly reviews with progress analysis, path alignment scores, and personalized recommendations.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔋 Energy Management</h3>
      <p>Adjust task difficulty based on your energy level. Low energy? Get lighter tasks. High energy? Take on boss quests!</p>
    </td>
    <td width="50%">
      <h3>🔒 Privacy First</h3>
      <p>Your data stays on your device. No account required. Open source and self-hostable.</p>
    </td>
  </tr>
</table>

## 🎮 Demo

### Example 1: College Student

```
Input:
"我是一名大三学生。
我想一年内成为 AI 产品开发者。
我纠结要不要考研。
每周可投入 15 小时。"

Output:
├── 🎓 Research Path (稳健路线)
│   └── Deep learning, academic papers, graduate school
├── 🚀 Builder Path (激进路线)  
│   └── Open source projects, portfolio building, job ready
└── ⚖️ Hybrid Path (混合路线)
    └── Balance research and practice
```

### Example 2: Career Changer

```
Input:
"我是一名后端工程师。
我想转行做 AI 工程。
我想在 6 个月内做出第一个 AI 产品。"

Output:
├── 📚 Study Path (学习路线)
│   └── Online courses, certifications, theoretical foundation
├── 🔨 Build Path (实践路线)
│   └── Hands-on projects, open source contributions
└── 🎯 Focus Path (聚焦路线)
    └── Specific AI domain, deep expertise
```

## 🚀 Quickstart

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Sleepydeerlu/Parallel-me.git
cd Parallel-me/pathforge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
# OpenAI API Configuration
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏗️ Architecture

```
pathforge/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── onboarding/    # Goal input flow
│   │   ├── paths/         # Path selection
│   │   ├── review/        # Weekly reviews
│   │   └── timeline/      # Growth timeline
│   ├── components/
│   │   ├── layout/        # Layout components
│   │   ├── paths/         # Path-related components
│   │   ├── quests/        # Quest-related components
│   │   └── ui/            # Reusable UI components
│   └── lib/
│       └── schemas/       # Zod schemas
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI components |
| [Zod](https://zod.dev/) | Schema validation |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [OpenAI API](https://platform.openai.com/) | AI capabilities |

## 📖 API Reference

### Generate Paths

```http
POST /api/paths
Content-Type: application/json

{
  "identity": "大三学生",
  "goal": "一年内成为 AI 产品开发者",
  "dilemma": "纠结考研还是就业",
  "timeHorizon": "12 months",
  "weeklyHours": 15
}
```

### Generate Quests

```http
POST /api/quests
Content-Type: application/json

{
  "pathId": "path_001",
  "pathName": "产品开发型路线",
  "weeklyHours": 15
}
```

### Update Quest Status

```http
PATCH /api/quests/{id}
Content-Type: application/json

{
  "status": "completed",
  "reflection": "这个任务比想象中难，但我完成了初稿。",
  "actualMinutes": 75,
  "energyLevel": 60
}
```

### Generate Weekly Review

```http
POST /api/reviews
Content-Type: application/json

{
  "goalId": "goal_001",
  "weekStart": "2026-06-17",
  "weekEnd": "2026-06-23"
}
```

## 🗺️ Roadmap

- [x] **V0.1**: MVP with core features
- [ ] **V0.2**: SQLite database support
- [ ] **V0.3**: Docker deployment
- [ ] **V1.0**: User accounts and cloud sync

See the [open issues](https://github.com/Sleepydeerlu/Parallel-me/issues) for a full list of proposed features.

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Quick Start for Contributors

```bash
# Fork the repo
# Clone your fork
git clone https://github.com/your-username/Parallel-me.git

# Create a branch
git checkout -b feature/amazing-feature

# Make your changes
# Commit your changes
git commit -m "feat: add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📧 Contact

- GitHub: [@Sleepydeerlu](https://github.com/Sleepydeerlu)
- Project: [Parallel-me](https://github.com/Sleepydeerlu/Parallel-me)

---

<div align="center">

**[⬆ back to top](#-pathforge)**

Made with ❤️ by the PathForge community

</div>
