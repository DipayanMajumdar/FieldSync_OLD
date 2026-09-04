"use client";

import { useEffect, useState } from "react";

export default function ProjectControlOverview() {
  const [stats, setStats] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [wbsSearch, setWbsSearch] = useState("");
  const [selectedAlertFilter, setSelectedAlertFilter] = useState("All");
  const [notification, setNotification] = useState<string | null>(null);

  // Live polling effect for backend data synchronization
  useEffect(() => {
    async function fetchAll() {
      try {
        const [sRes, eRes, aRes] = await Promise.all([
          fetch("http://localhost:3000/api/stats"),
          fetch("http://localhost:3000/api/entries"),
          fetch("http://localhost:3000/api/alerts"),
        ]);
        setStats(await sRes.json());
        setEntries(await eRes.json());
        setAlerts(await aRes.json());
      } catch (err) {
        console.warn("Backend offline or using fallback telemetry");
      }
    }
    fetchAll();
    const interval = setInterval(fetchAll, 3000);
    return () => clearInterval(interval);
  }, []);

  const overallProg = stats ? stats.overall_progress : 68;
  const planned = stats ? stats.planned_baseline : 74;
  const variance = stats ? stats.variance : -6;

  // Interactive Action Handler
  const triggerAction = (actionName: string) => {
    setNotification(`Action successful: ${actionName}`);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredAlerts = selectedAlertFilter === "All" 
    ? alerts 
    : alerts.filter(a => a.severity?.toLowerCase() === selectedAlertFilter.toLowerCase());

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6 relative">
      {/* Interactive Toast Notification Banner */}
      {notification && (
        <div className="fixed top-6 right-6 bg-[#1b1916] text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-xs font-bold border border-gray-700 animate-bounce">
          {notification}
        </div>
      )}

      {/* Top Header Bar */}
      <header className="flex justify-between items-start border-b border-gray-200/60 pb-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Field control / Current project</p>
          <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Oil Pipeline Phase 2</h2>
          <p className="text-xs text-gray-500 mt-0.5">Control room - Week 15 - Project Manager Control</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">12–18 May 2025</p>
            <p className="text-xs font-bold text-gray-700">Project Manager view</p>
          </div>
          <button 
            onClick={() => triggerAction("Exporting project telemetry PDF report...")}
            className="bg-[#1b1916] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition shadow-sm cursor-pointer"
          >
            Export Report
          </button>
        </div>
      </header>

      {/* Top 5 Metrics Cards (Interactive Filter Toggles) */}
      <div className="grid grid-cols-5 gap-4">
        <div onClick={() => triggerAction("Filtered view: Actual Progress Metrics")} className="bg-white rounded-xl p-5 shadow-2xs border border-gray-200/60 cursor-pointer hover:border-[#d66c25] transition">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Actual progress</p>
          <p className="text-3xl font-black text-[#1b1916]">{overallProg}%</p>
        </div>
        <div onClick={() => triggerAction("Filtered view: Planned Baseline Schedule")} className="bg-white rounded-xl p-5 shadow-2xs border border-gray-200/60 cursor-pointer hover:border-[#d66c25] transition">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Planned progress</p>
          <p className="text-3xl font-black text-[#1b1916]">{planned}%</p>
        </div>
        <div onClick={() => triggerAction("Filtered view: Critical Variance Breakdown")} className="bg-white rounded-xl p-5 shadow-2xs border border-gray-200/60 cursor-pointer hover:border-red-500 transition">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Variance</p>
          <p className="text-3xl font-black text-red-600">{variance}%</p>
        </div>
        <div onClick={() => setSelectedAlertFilter("All")} className="bg-white rounded-xl p-5 shadow-2xs border border-gray-200/60 cursor-pointer hover:border-orange-500 transition">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">HSE issues</p>
          <p className="text-3xl font-black text-[#1b1916]">12</p>
        </div>
        <div onClick={() => setSelectedAlertFilter("High")} className="bg-white rounded-xl p-5 shadow-2xs border border-gray-200/60 cursor-pointer hover:border-orange-600 transition">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Critical delays (Click to filter)</p>
          <p className="text-3xl font-black text-orange-600">{alerts.length || 3}</p>
        </div>
      </div>

      {/* Middle Section (3 Columns) */}
      <div className="grid grid-cols-3 gap-6">
        {/* Needs Attention Box */}
        <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#1b1916]">Needs attention</h3>
              <p className="text-[10px] text-gray-400 font-medium">Ranked by consequence ({filteredAlerts.length} shown)</p>
            </div>
            <select 
              value={selectedAlertFilter}
              onChange={(e) => setSelectedAlertFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-[10px] font-bold rounded px-2 py-1 outline-none"
            >
              <option value="All">Filter: All</option>
              <option value="High">Filter: High Priority</option>
            </select>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, idx) => (
                <div key={idx} onClick={() => triggerAction(`Opening item ticket: ${alert.title}`)} className="p-3 bg-red-50/50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-50 transition">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-red-600 uppercase">{alert.severity || "Critical"} delay</span>
                    <span className="text-[10px] font-mono text-gray-400">{alert.discipline || "PIP-05"}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-800">{alert.title}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{alert.details}</p>
                </div>
              ))
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center text-xs text-gray-400">No active alerts matching filter.</div>
            )}
          </div>
        </div>

        {/* Cumulative Progress S-Curve */}
        <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1b1916]">Cumulative progress</h3>
            <p className="text-[10px] text-gray-400 font-medium">Planned vs. actual, S-curve</p>
          </div>
          <div className="flex-1 relative my-4 border-l border-b border-gray-200 cursor-crosshair" title="Interactive S-Curve Model">
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 600 200">
              <path d="M 0 190 Q 300 140, 580 30" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 0 190 Q 280 160, 500 75" fill="none" stroke="#d66c25" strokeWidth="3" />
            </svg>
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-400 mr-1.5"></span> Planned</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#d66c25] mr-1.5"></span> Actual</span>
            </div>
            <button onClick={() => triggerAction("Toggled S-Curve projection model")} className="text-[#d66c25] hover:underline">Toggle Forecast</button>
          </div>
        </div>

        {/* WBS Progress with Search */}
        <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#1b1916]">WBS progress</h3>
              <p className="text-[10px] text-gray-400 font-medium">Selected branch highlighted</p>
            </div>
          </div>
          <input 
            type="text" 
            placeholder="Search branch..." 
            value={wbsSearch}
            onChange={(e) => setWbsSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs outline-none focus:border-[#d66c25]"
          />
          <div className="space-y-3 text-xs">
            {(!wbsSearch || "pipeline phase 2".includes(wbsSearch.toLowerCase())) && (
              <div onClick={() => triggerAction("Selected WBS Branch: Pipeline Phase 2")} className="cursor-pointer hover:opacity-80">
                <div className="flex justify-between font-semibold mb-1 text-gray-700"><span>L1 Pipeline Phase 2</span><span>68%</span></div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-green-600 h-2 rounded-full w-[68%]"></div></div>
              </div>
            )}
            {(!wbsSearch || "civil works".includes(wbsSearch.toLowerCase())) && (
              <div onClick={() => triggerAction("Selected WBS Branch: Civil Works")} className="cursor-pointer hover:opacity-80">
                <div className="flex justify-between font-semibold mb-1 text-gray-700"><span>L2 Civil Works</span><span>82%</span></div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-green-600 h-2 rounded-full w-[82%]"></div></div>
              </div>
            )}
            {(!wbsSearch || "piping".includes(wbsSearch.toLowerCase())) && (
              <div onClick={() => triggerAction("Selected WBS Branch: Piping")} className="bg-orange-50/40 p-2.5 rounded-lg border border-orange-100 cursor-pointer">
                <div className="flex justify-between font-semibold mb-1 text-gray-800"><span>L3 Piping</span><span>54%</span></div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden"><div className="bg-[#d66c25] h-2 rounded-full w-[54%]"></div></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section (2 Columns) */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
          <h3 className="text-sm font-bold text-[#1b1916]">Baseline vs. reported</h3>
          <p className="text-[10px] text-gray-400">Gantt snapshot, 12–18 May 2025</p>
          <div className="space-y-3 text-xs pt-2">
            <div onClick={() => triggerAction("Gantt Focus: Foundation")} className="cursor-pointer">
              <p className="text-gray-600 font-semibold mb-1">Foundation</p>
              <div className="w-full bg-gray-100 h-3 rounded-full"><div className="bg-green-600 h-3 rounded-full w-[90%]"></div></div>
            </div>
            <div onClick={() => triggerAction("Gantt Focus: Piping")} className="cursor-pointer">
              <p className="text-gray-600 font-semibold mb-1">Piping</p>
              <div className="w-full bg-gray-100 h-3 rounded-full"><div className="bg-green-700 h-3 rounded-full w-[72%]"></div></div>
            </div>
            <div onClick={() => triggerAction("Gantt Focus: Pipe rack weld")} className="cursor-pointer">
              <p className="text-gray-600 font-semibold mb-1">Pipe rack weld</p>
              <div className="w-full bg-gray-100 h-3 rounded-full"><div className="bg-[#d66c25] h-3 rounded-full w-[45%]"></div></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-[#1b1916]">Audited activity log</h3>
            <span className="text-[10px] text-[#d66c25] font-bold cursor-pointer hover:underline" onClick={() => triggerAction("Refreshed audit log feed")}>Refresh Stream</span>
          </div>
          <p className="text-[10px] text-gray-400 mb-4">Meaningful source events - filtered to WBS / PIP-05-003</p>
          <table className="w-full text-left text-xs">
            <thead className="text-gray-400 border-b border-gray-100 uppercase text-[9px] font-bold">
              <tr><th className="pb-2">Activity</th><th className="pb-2">Source</th><th className="pb-2">State</th><th className="pb-2 text-right">Time</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-800">
              <tr onClick={() => triggerAction("Opened log item: Foundation Block A")} className="hover:bg-gray-50 cursor-pointer">
                <td className="py-3 font-medium">Foundation Block A - 72%</td>
                <td className="py-3 text-gray-500">Field Unit Alpha, mobile</td>
                <td className="py-3 font-bold text-green-600">Verified</td>
                <td className="py-3 text-right text-gray-400 text-[10px]">10:43 - 18 May</td>
              </tr>
              <tr onClick={() => triggerAction("Opened log item: Pipe rack welding")} className="hover:bg-gray-50 cursor-pointer">
                <td className="py-3 font-medium">Pipe rack welding, Section 3 - 45%</td>
                <td className="py-3 text-gray-500">Field Unit Beta, mobile</td>
                <td className="py-3 font-bold text-orange-600">Needs review</td>
                <td className="py-3 text-right text-gray-400 text-[10px]">09:58 - 18 May</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}