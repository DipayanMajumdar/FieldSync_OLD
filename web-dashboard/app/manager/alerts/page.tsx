"use client";

import { useEffect, useState } from "react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error("Failed to fetch alerts:", err));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Control / Alerts</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Active Project Delay Alerts</h2>
      </header>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white p-6 rounded-xl shadow-2xs border border-gray-200/60 flex justify-between items-center text-xs">
            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{alert.discipline}</span>
              <h4 className="text-sm font-bold text-gray-900 mt-0.5">{alert.title}</h4>
              <p className="text-gray-500 mt-1">{alert.details}</p>
            </div>
            <span className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-md font-bold">
              {alert.severity} PRIORITY
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}