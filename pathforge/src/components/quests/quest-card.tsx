import { Button } from "@/components/ui/button";

interface Quest {
  id: string;
  title: string;
  type: "main" | "side" | "daily" | "recovery" | "social" | "reflection" | "boss";
  difficulty: number;
  estimatedMinutes: number;
  description: string;
  whyItMatters: string;
  acceptanceCriteria: string[];
  status: "pending" | "in_progress" | "completed" | "skipped" | "postponed";
  dueDate?: string;
}

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
  onSkip: (questId: string) => void;
  onPostpone: (questId: string) => void;
}

export default function QuestCard({ quest, onComplete, onSkip, onPostpone }: QuestCardProps) {
  const typeColors = {
    main: "bg-purple-100 text-purple-700",
    side: "bg-blue-100 text-blue-700",
    daily: "bg-green-100 text-green-700",
    recovery: "bg-yellow-100 text-yellow-700",
    social: "bg-pink-100 text-pink-700",
    reflection: "bg-indigo-100 text-indigo-700",
    boss: "bg-red-100 text-red-700",
  };

  const statusColors = {
    pending: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    skipped: "bg-yellow-100 text-yellow-700",
    postponed: "bg-orange-100 text-orange-700",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 transition-all ${
        quest.status === "completed"
          ? "bg-green-50 border border-green-200"
          : quest.status === "in_progress"
          ? "bg-blue-50 border border-blue-200"
          : "border border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${typeColors[quest.type]}`}>
            {quest.type}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[quest.status]}`}>
            {quest.status}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Difficulty: {quest.difficulty}</span>
          <span>•</span>
          <span>{quest.estimatedMinutes} min</span>
        </div>
      </div>

      <h3
        className={`text-lg font-medium mb-2 ${
          quest.status === "completed" ? "text-gray-500 line-through" : "text-gray-900"
        }`}
      >
        {quest.title}
      </h3>

      <p className="text-gray-600 text-sm mb-4">{quest.description}</p>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Why it matters</h4>
        <p className="text-sm text-gray-600">{quest.whyItMatters}</p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Acceptance Criteria</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {quest.acceptanceCriteria.map((criteria, index) => (
            <li key={index} className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              {criteria}
            </li>
          ))}
        </ul>
      </div>

      {quest.status === "pending" && (
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => onComplete(quest.id)}>
            Complete
          </Button>
          <Button size="sm" variant="outline" onClick={() => onSkip(quest.id)}>
            Skip
          </Button>
          <Button size="sm" variant="outline" onClick={() => onPostpone(quest.id)}>
            Postpone
          </Button>
        </div>
      )}

      {quest.status === "completed" && (
        <div className="text-green-600 text-sm font-medium">
          ✓ Completed
        </div>
      )}
    </div>
  );
}
