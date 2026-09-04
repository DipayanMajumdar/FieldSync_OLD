"use client";

import { useEffect, useState } from "react";

export default function ScheduleMatchPage() {
  const [wbsData, setWbsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/wbs")
      .then((res) => res.json())
      .then((data) => {
        setWbsData(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to load live WBS data:", err));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="flex justify-between items-start border-b border-gray-200/60 pb-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Control / Schedule</p>
          <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">WBS & schedule match</h2>
          <p className="text-xs text-gray-500 mt-0.5">Live database synchronization across L1–L6 nodes</p>
        </div>
      </header>

      <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
        <h3 className="text-sm font-bold text-[#1b1916]">Live Database Hierarchy</h3>
        {loading ? (
          <p className="text-xs text-gray-400 py-8 text-center">Loading live records from database...</p>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">WBS Code</th>
                <th className="p-3">Level</th>
                <th className="p-3">Activity Name</th>
                <th className="p-3">Discipline</th>
                <th className="p-3">Progress</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {wbsData.map((node) => (
                <tr key={node.id} className="hover:bg-gray-50/50">
                  <td className="p-3 font-mono text-[#d66c25] font-bold">{node.code}</td>
                  <td className="p-3 text-gray-500">L{node.level}</td>
                  <td className="p-3 font-semibold">{node.name}</td>
                  <td className="p-3 text-gray-600">{node.discipline}</td>
                  <td className="p-3 font-bold">{node.progress}%</td>
                  <td className="p-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      node.status === 'BEHIND' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {node.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}