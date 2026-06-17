import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Simulate your possible futures.
            <br />
            <span className="text-indigo-600">Choose one. Turn it into quests.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            PathForge helps you explore life paths, choose one, and build it through RPG-style quests.
            Transform your goals into actionable daily tasks with AI-powered guidance.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/onboarding">
              <Button size="lg" className="px-8 py-3 text-lg">
                Start your path
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Input Examples */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">
            What&apos;s your goal or dilemma?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                &ldquo;我想一年内成为 AI 产品开发者，但纠结要不要考研。&rdquo;
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                &ldquo;我想半年内做出第一个开源产品。&rdquo;
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                &ldquo;我想转行，但不知道走技术还是产品。&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How PathForge Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Simulate paths</h3>
              <p className="text-gray-600">
                Input your goal and let AI generate multiple life paths with different approaches.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose a main quest</h3>
              <p className="text-gray-600">
                Compare paths, understand tradeoffs, and select one as your main quest line.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Level up weekly</h3>
              <p className="text-gray-600">
                Complete daily quests, track your progress, and review your growth every week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Result Preview */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            See what you&apos;ll get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Parallel Paths</h3>
              <p className="text-gray-600 text-sm">
                Compare different life paths with clear benefits, costs, and risks for each option.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quest Map</h3>
              <p className="text-gray-600 text-sm">
                Get a 7-day task map with concrete, actionable quests tailored to your chosen path.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skill Tree</h3>
              <p className="text-gray-600 text-sm">
                Track your growth with RPG-style attributes and skill progression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 italic">
            This is a reflection tool, not a destiny machine.
            <br />
            PathForge helps you explore possibilities and take action — it doesn&apos;t predict the future.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400">
            PathForge: Simulate your possible futures. Choose one. Turn it into quests.
          </p>
        </div>
      </footer>
    </div>
  );
}
