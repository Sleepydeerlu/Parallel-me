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

interface PathComparisonTableProps {
  paths: Path[];
}

export default function PathComparisonTable({ paths }: PathComparisonTableProps) {
  const dimensions = [
    { name: "稳定性", values: ["高", "中", "中"] },
    { name: "成长速度", values: ["中", "高", "中"] },
    { name: "风险", values: ["低", "中", "中"] },
    { name: "作品产出", values: ["低", "高", "中"] },
    { name: "学术深度", values: ["高", "中", "中"] },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Path Comparison</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">Dimension</th>
            {paths.map((path) => (
              <th key={path.id} className="text-left py-2 px-4">
                {path.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dimensions.map((dim, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 font-medium">{dim.name}</td>
              {dim.values.slice(0, paths.length).map((value, valueIndex) => (
                <td key={valueIndex} className="py-2 px-4">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
