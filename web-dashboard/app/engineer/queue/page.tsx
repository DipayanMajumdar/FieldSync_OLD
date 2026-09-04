"use client";
import { useEffect, useState } from "react";

export default function EngineerSyncQueuePage() {
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/engineer/submissions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter items that are pending or synced
          setQueue(data);
        }
      })
      .catch((err) => console.error("Failed to load queue:", err));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Site Engineer / Queue</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Active Sync Queue</h2>
      </header>

      <div className="space-y-4">
        {Array.isArray(queue) && queue.length > 0 ? (
          queue.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-2xs border border-gray-200/60 flex justify-between items-center text-xs">
              <div>
                <span className="font-mono text-[#d66c25] font-bold">{item.task_code}</span>
                <h4 className="text-sm font-bold text-gray-900 mt-0.5">{item.task_name}</h4>
                <p className="text-gray-500 mt-1">Transcript: &quot;{item.transcript || "No voice remark"}&quot;</p>
              </div>
              <span className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-md font-bold uppercase">
                {item.status || "QUEUED"}
              </span>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-xl text-center text-gray-400 text-xs">Queue is currently clear. All items synced.</div>
        )}
      </div>
    </div>
  );
}