# PathForge

Simulate your possible futures. Choose one. Turn it into quests.

PathForge is an AI-driven life path simulation and RPG growth system that helps users transform major choices, long-term goals, and daily tasks into actionable growth paths.

## Why

Most productivity tools only care about "what to do today?" But what users really struggle with is:

- Why am I doing these things?
- Where will these tasks take me?
- Am I doing things consistent with who I want to become?

PathForge's value is putting tasks back into the context of life paths.

## Demo

### Example 1: College Student

**Input:**
```
我是一名大三学生。
我想一年内成为 AI 产品开发者。
我纠结要不要考研。
每周可投入 15 小时。
我会一点 Python 和前端。
```

**Output:**
- 3 parallel life paths (Research, Builder, Hybrid)
- 7-day quest map for each path
- Daily tasks with acceptance criteria
- Weekly review and attribute tracking

### Example 2: Career Changer

**Input:**
```
我是一名后端工程师。
我想转行做 AI 工程。
我想在 6 个月内做出第一个 AI 产品。
```

**Output:**
- Career transition paths
- Skill development roadmap
- Project-based learning quests

## Features

### Core Features

- **Parallel Path Simulation**: Generate multiple life paths based on your goals
- **RPG Growth System**: Track progress with attributes, skills, and achievements
- **AI-Powered Quests**: Get concrete, actionable daily tasks
- **Weekly Reviews**: Reflect on progress and adjust direction
- **Energy Management**: Adjust task difficulty based on your energy level

### Technical Features

- **Local-First**: Your data stays on your device
- **Privacy-Focused**: No account required for basic usage
- **OpenAI-Compatible**: Use any OpenAI-compatible API
- **Self-Hostable**: Deploy on your own infrastructure

## How It Works

1. **Input Your Goal**: Describe your current situation and what you want to achieve
2. **Generate Paths**: AI generates 3 parallel life paths with different approaches
3. **Choose a Path**: Select one path as your main quest line
4. **Get Quests**: Receive a 7-day quest map with daily tasks
5. **Track Progress**: Complete quests, gain attributes, and level up
6. **Weekly Review**: Reflect on your progress and adjust direction

## Quickstart

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pathforge.git
cd pathforge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Using Your Own API Key

PathForge supports any OpenAI-compatible API. You can:

1. Use OpenAI directly
2. Use Azure OpenAI
3. Use local models (like Ollama)
4. Use other providers (like Anthropic, Google, etc.)

## Configuration

### Customizing the AI

You can customize the AI behavior by modifying the prompt templates in `src/lib/prompts/`.

### Customizing Attributes

The attribute system can be customized in `src/lib/schemas/attribute.ts`.

### Customizing Quest Types

Quest types and their properties can be modified in `src/lib/schemas/quest.ts`.

## Roadmap

### V0.1: MVP (Current)

- [x] Goal input and path generation
- [x] Path comparison and selection
- [x] 7-day quest map
- [x] Quest completion and tracking
- [x] Basic attribute system
- [x] Weekly review

### V0.2: Data Structure Stable

- [ ] SQLite database support
- [ ] Multi-goal management
- [ ] Advanced skill tree
- [ ] Path alignment analysis

### V0.3: Open Source Release

- [ ] Docker deployment
- [ ] Environment variable configuration
- [ ] Example user templates
- [ ] Contributing guidelines

### V1.0: Production Ready

- [ ] User accounts
- [ ] Cloud sync
- [ ] Calendar integration
- [ ] Data export
- [ ] Mobile app

## Privacy

PathForge is designed with privacy in mind:

- **Local-First**: Your data is stored locally by default
- **No Tracking**: We don't track your usage
- **Data Control**: You can export or delete your data at any time
- **Open Source**: You can review the code to verify our privacy claims

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Code Style

We use:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Zod](https://zod.dev/) - TypeScript-first schema validation

## Support

- [GitHub Issues](https://github.com/yourusername/pathforge/issues)
- [Discord Community](https://discord.gg/pathforge)
- [Email Support](mailto:support@pathforge.dev)

## Contact

- [Twitter](https://twitter.com/pathforge)
- [Website](https://pathforge.dev)
- [Blog](https://blog.pathforge.dev)
