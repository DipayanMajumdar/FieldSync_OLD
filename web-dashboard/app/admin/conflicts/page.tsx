"use client";
import { useEffect, useState } from "react";

export default function AdminConflictsPage() {
  const [conflicts, setConflicts] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/admin/conflicts-list")
      .then((res) => res.json())
      .then((data) => setConflicts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admin / Conflicts</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Sync Conflicts & Discrepancies</h2>
      </header>

      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-4">Task Code</th>
              <th className="p-4">Conflict Description</th>
              <th className="p-4">Mobile Value</th>
              <th className="p-4">Manual Value</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {conflicts.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-mono text-[#d66c25] font-bold">{c.task_code}</td>
                <td className="p-4 font-semibold">{c.title}</td>
                <td className="p-4 text-gray-600">{c.mobile_value}</td>
                <td className="p-4 text-gray-600">{c.manual_value}</td>
                <td className="p-4 text-right font-bold text-orange-600">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}