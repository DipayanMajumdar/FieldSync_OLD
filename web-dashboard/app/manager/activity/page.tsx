"use client";

import { useEffect, useState } from "react";

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/activity")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch(() => {
        // Fallback to pulling entries as activity feed if specific endpoint is pending
        fetch("http://localhost:3000/api/entries")
          .then((res) => res.json())
          .then((data) => setActivities(data));
      });
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Control / Activity</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Field Activity Feed</h2>
      </header>

      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/60 p-6 space-y-4">
        {activities.map((act, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 rounded-lg bg-gray-50/70 border border-gray-100 text-xs">
            <div>
              <p className="font-bold text-gray-900">{act.task_name || act.title}</p>
              <p className="text-gray-500 mt-0.5">Code: {act.task_code || act.code} • Progress recorded: {act.progress}%</p>
            </div>
            <span className="font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded text-[10px]">
              {act.status || "Synced"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}