import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            PathForge
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
          <Link href="/paths">
            <Button variant="ghost" size="sm">
              Paths
            </Button>
          </Link>
          <Link href="/review">
            <Button variant="ghost" size="sm">
              Review
            </Button>
          </Link>
          <Link href="/timeline">
            <Button variant="ghost" size="sm">
              Timeline
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
