"use client";

import { useEffect, useState } from "react";

export default function WorkBreakdownPage() {
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/wbs")
      .then((res) => res.json())
      .then((data) => setNodes(data))
      .catch((err) => console.error("Failed to load breakdown data:", err));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Control / WBS</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Work breakdown structure</h2>
      </header>

      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Name</th>
              <th className="p-4">Discipline</th>
              <th className="p-4">Progress</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {nodes.map((node) => (
              <tr key={node.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-mono text-[#d66c25] font-bold">{node.code}</td>
                <td className="p-4 font-semibold">{node.name}</td>
                <td className="p-4 text-gray-600">{node.discipline}</td>
                <td className="p-4 font-bold">{node.progress}%</td>
                <td className="p-4 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    node.status === 'BEHIND' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {node.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}