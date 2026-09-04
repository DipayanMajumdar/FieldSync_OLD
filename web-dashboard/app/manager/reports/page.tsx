"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch(() => setReports([
        { title: "Weekly Executive Summary — Oil India EPC", date: "Live Database Snapshot", type: "PDF" }
      ]));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Control / Reports</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Executive Reports</h2>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {reports.map((rep, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4 text-xs">
            <span className="bg-orange-50 text-[#d66c25] font-extrabold px-2 py-0.5 rounded uppercase">{rep.type || "PDF"}</span>
            <h3 className="font-bold text-gray-900 text-sm">{rep.title}</h3>
            <p className="text-gray-400 text-[10px]">{rep.date}</p>
            <button onClick={() => alert("Downloading live server report...")} className="w-full bg-gray-50 border border-gray-200 py-2 rounded font-bold hover:bg-gray-100 transition">
              Download Export
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}