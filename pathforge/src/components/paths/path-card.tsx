import { Button } from "@/components/ui/button";

interface Path {
  id: string;
  name: string;
  archetype: string;
  summary: string;
  futureSnapshot: string;
  suitableFor: string[];
  benefits: string[];
  costs: string[];
  risks: string[];
  requiredSkills: string[];
}

interface PathCardProps {
  path: Path;
  selected?: boolean;
  onSelect: (pathId: string) => void;
}

export default function PathCard({ path, selected, onSelect }: PathCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all ${
        selected
          ? "ring-2 ring-indigo-500 shadow-md"
          : "hover:shadow-md"
      }`}
      onClick={() => onSelect(path.id)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{path.name}</h3>
        {selected && (
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
            Selected
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-4">{path.summary}</p>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Future Snapshot</h4>
        <p className="text-sm text-gray-600">{path.futureSnapshot}</p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {path.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">+</span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Costs & Risks</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {path.costs.map((cost, index) => (
            <li key={index} className="flex items-start">
              <span className="text-red-500 mr-2">-</span>
              {cost}
            </li>
          ))}
          {path.risks.map((risk, index) => (
            <li key={`risk-${index}`} className="flex items-start">
              <span className="text-yellow-500 mr-2">!</span>
              {risk}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
        <div className="flex flex-wrap gap-2">
          {path.requiredSkills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {selected && (
        <div className="mt-4">
          <Button className="w-full">Start this path</Button>
        </div>
      )}
    </div>
  );
}
