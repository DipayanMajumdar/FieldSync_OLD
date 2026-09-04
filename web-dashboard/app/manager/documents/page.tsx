"use client";

import { useEffect, useState } from "react";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/documents")
      .then((res) => res.json())
      .then((data) => setDocs(data))
      .catch(() => setDocs([
        { name: "Sector 7B Pipeline CAD Schematic v4.2.dwg", category: "Blueprints", updated: "Synced Server" }
      ]));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Control / Documents</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Project Documents & Blueprints</h2>
      </header>

      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-4">Document Name</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {docs.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-900">📄 {d.name}</td>
                <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-[10px] font-bold">{d.category}</span></td>
                <td className="p-4 text-right font-bold text-[#d66c25]">{d.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}