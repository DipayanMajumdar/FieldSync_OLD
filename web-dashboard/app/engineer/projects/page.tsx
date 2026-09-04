"use client";
import { useEffect, useState } from "react";

export default function EngineerProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/engineer/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Site Engineer / Projects</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Assigned Project Scope</h2>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-3 text-xs">
              <span className="bg-orange-50 text-[#d66c25] font-extrabold px-2 py-0.5 rounded uppercase font-mono">{proj.code}</span>
              <h3 className="font-bold text-gray-900 text-sm">{proj.name}</h3>
              <p className="text-gray-500">Discipline Assignment: <span className="font-bold text-gray-800">{proj.discipline}</span></p>
              <div className="flex justify-between font-bold pt-2">
                <span>Current Progress: {proj.progress}%</span>
                <span className="text-green-700">{proj.status}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-xl text-center text-gray-400 text-xs col-span-2">Loading active project assignments...</div>
        )}
      </div>
    </div>
  );
}