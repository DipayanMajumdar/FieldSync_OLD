"use client";

import { useEffect, useState } from "react";

export default function EvidenceVerificationPage() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/entries")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error("Failed to load server entries:", err));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="flex justify-between items-start border-b border-gray-200/60 pb-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Control / Evidence</p>
          <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Evidence verification queue</h2>
          <p className="text-xs text-gray-500 mt-0.5">Live server telemetry and AI vision outputs</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#d66c25] font-mono">{entry.task_code}</span>
                <h4 className="text-sm font-bold text-gray-900">{entry.task_name}</h4>
                <p className="text-xs text-gray-500">Quantity: {entry.quantity} {entry.unit} • Progress: {entry.progress}%</p>
              </div>
              <span className="bg-green-100 text-green-800 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">{entry.status}</span>
            </div>

            {entry.image_path && (
              <div className="h-44 rounded-lg overflow-hidden bg-gray-900 border border-gray-100">
                <img src={`http://localhost:3000/uploads/${entry.image_path}`} alt="Evidence" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="bg-[#f5f4ef] p-3 rounded-lg border border-[#e5e4df] text-xs space-y-2">
              <p className="font-bold text-gray-800">🤖 AI Site Verification (YOLO11):</p>
              <div className="flex flex-wrap gap-1">
                {Array.isArray(entry.ai_tags) && entry.ai_tags.map((t: any, i: number) => (
                  <span key={i} className="bg-white border border-[#d66c25]/30 text-[#d66c25] px-2 py-0.5 rounded text-[10px] font-semibold">
                    {t.label} ({t.confidence}%)
                  </span>
                ))}
              </div>
              <p className="text-gray-700 pt-1"><span className="font-bold">🎙️ Whisper Transcript:</span> &quot;{entry.transcript}&quot;</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}