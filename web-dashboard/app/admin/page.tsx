"use client";

import { useEffect, useState } from "react";

export default function AdminSyncHealthPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [selectedConflict, setSelectedConflict] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchHealth = () => {
    fetch("http://localhost:3000/api/admin/sync-health")
      .then((res) => res.json())
      .then((data) => {
        setHealthData(data);
        if (data.conflicts && data.conflicts.length > 0 && !selectedConflict) {
          setSelectedConflict(data.conflicts[0]);
        }
      })
      .catch((err) => console.error("Error fetching admin sync health:", err));
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (resolution: string) => {
    if (!selectedConflict) return;
    try {
      const res = await fetch("http://localhost:3000/api/admin/resolve-conflict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conflict_id: selectedConflict.id, resolution })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        setTimeout(() => setStatusMessage(null), 4000);
        fetchHealth();
      }
    } catch (err) {
      console.error("Resolution failed:", err);
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6 relative">
      {statusMessage && (
        <div className="fixed top-6 right-6 bg-[#1b1916] text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-xs font-bold border border-gray-700">
          {statusMessage}
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-start border-b border-gray-200/60 pb-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Oil Pipeline Phase 2 · Design 05 - Sync operations</p>
          <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Sync health & conflicts</h2>
          <p className="text-xs text-gray-500 mt-0.5">Resolve unresolved source differences before they enter the project record.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-700">Preview role: Admin</p>
        </div>
      </header>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-2xs border border-gray-200/60">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Devices online</p>
          <p className="text-3xl font-black text-[#1b1916]">{healthData?.devices_online || 47}</p>
          <p className="text-[10px] text-gray-400 mt-1">connected now</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-2xs border border-gray-200/60">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pending sync</p>
          <p className="text-3xl font-black text-[#1b1916]">{healthData?.pending_sync || 8}</p>
          <p className="text-[10px] text-gray-400 mt-1">waiting for network</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-2xs border border-gray-200/60">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Conflicts</p>
          <p className="text-3xl font-black text-orange-600">{healthData?.conflicts_count || 2}</p>
          <p className="text-[10px] text-orange-600 mt-1 font-semibold">unresolved</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-2xs border border-gray-200/60">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Sync success · 24h</p>
          <p className="text-3xl font-black text-green-600">{healthData?.sync_success_rate || 94}%</p>
        </div>
      </div>

      {/* Middle Grid (3 Columns matching Figma) */}
      <div className="grid grid-cols-3 gap-6">
        {/* Column 1: Attention Queue */}
        <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#1b1916]">Attention queue</h3>
              <p className="text-[10px] text-gray-400">Unresolved items first</p>
            </div>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">08</span>
          </div>

          <div className="space-y-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase">Failed · 1</p>
            <div className="p-3 bg-red-50/50 rounded-lg border border-red-100 text-xs space-y-1">
              <span className="font-bold text-red-600 font-mono">PIP-05-001</span>
              <p className="font-bold text-gray-800">Photo 2 upload failed</p>
              <p className="text-[10px] text-red-600 font-bold">↺ Retry upload</p>
            </div>

            <p className="text-[9px] font-bold text-gray-400 uppercase pt-2">Conflicts · 2</p>
            {healthData?.conflicts?.map((c: any) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedConflict(c)}
                className={`p-3 rounded-lg border text-xs space-y-1 cursor-pointer transition ${
                  selectedConflict?.id === c.id ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="font-bold text-orange-700 font-mono">{c.task_code}</span>
                <p className="font-bold text-gray-800">{c.title}</p>
                <p className="text-[10px] text-gray-500">{c.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Schedule Variance Heatmap & WBS Activity Registry */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#1b1916]">Schedule variance heatmap</h3>
              <p className="text-[10px] text-gray-400">Variance by week and WBS level · selected W18 / L3</p>
            </div>

            {/* Heatmap Grid Mock */}
            <div className="grid grid-cols-8 gap-1.5 text-center text-[10px] font-bold pt-2">
              <span className="text-gray-400"></span>
              <span className="text-gray-400">W15</span>
              <span className="text-gray-400">W16</span>
              <span className="text-gray-400">W17</span>
              <span className="text-gray-400 bg-gray-100 rounded">W18</span>
              <span className="text-gray-400">W19</span>
              <span className="text-gray-400">W20</span>
              <span className="text-gray-400">W21</span>

              <span className="text-gray-500 text-left">L1</span>
              <div className="bg-green-100 text-green-800 p-1.5 rounded">✓</div>
              <div className="bg-green-100 text-green-800 p-1.5 rounded">✓</div>
              <div className="bg-orange-100 text-orange-800 p-1.5 rounded">!</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>

              <span className="text-gray-500 text-left">L2</span>
              <div className="bg-green-100 text-green-800 p-1.5 rounded">✓</div>
              <div className="bg-orange-100 text-orange-800 p-1.5 rounded">!</div>
              <div className="bg-orange-100 text-orange-800 p-1.5 rounded">!</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>

              <span className="text-gray-500 text-left">L3</span>
              <div className="bg-green-100 text-green-800 p-1.5 rounded">✓</div>
              <div className="bg-orange-100 text-orange-800 p-1.5 rounded">!</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>
              <div className="bg-black text-white p-1.5 rounded ring-2 ring-[#d66c25]">✕</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>
              <div className="bg-red-100 text-red-800 p-1.5 rounded">✕</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#1b1916]">WBS activity registry</h3>
              <p className="text-[10px] text-gray-400">08 records · readable source-of-record rows</p>
            </div>
            <table className="w-full text-left text-[11px]">
              <thead className="text-gray-400 border-b border-gray-100 uppercase text-[9px] font-bold">
                <tr><th>ID</th><th>Activity</th><th>Discipline</th><th>Plan</th><th>Actual</th><th>State</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-800">
                <tr>
                  <td className="py-2 font-mono text-gray-500">CV-05-001</td>
                  <td className="py-2 font-medium">Foundation Block A</td>
                  <td className="py-2 text-gray-500">Civil</td>
                  <td className="py-2">80%</td>
                  <td className="py-2 font-bold">72%</td>
                  <td className="py-2"><span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-[9px] font-bold">Warning</span></td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-gray-500">PIP-05-003</td>
                  <td className="py-2 font-medium">Pipe rack welding Section 3</td>
                  <td className="py-2 text-gray-500">Piping</td>
                  <td className="py-2">60%</td>
                  <td className="py-2 font-bold text-red-600">45%</td>
                  <td className="py-2"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[9px] font-bold">Critical</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 3: Conflict Inspector & Resolution Panel */}
        <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#1b1916]">Conflict inspector</h3>
            <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded">Conflict</span>
          </div>

          <p className="text-xs font-semibold text-gray-700">
            {selectedConflict ? `${selectedConflict.task_code} - progress conflict` : "Select a conflict item"}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-[9px] text-gray-400 uppercase font-bold">Mobile Report</p>
              <p className="text-lg font-black text-gray-900 mt-1">{selectedConflict?.mobile_value || "45%"}</p>
              <p className="text-[10px] text-gray-500 mt-1">Arjun Singh</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-[9px] text-gray-400 uppercase font-bold">Manual Report</p>
              <p className="text-lg font-black text-gray-900 mt-1">{selectedConflict?.manual_value || "60%"}</p>
              <p className="text-[10px] text-gray-500 mt-1">Project Control</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button 
              onClick={() => handleResolve('MOBILE')}
              className="w-full bg-[#d66c25] hover:bg-[#c25e1f] text-white py-2.5 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Keep mobile report
            </button>
            <button 
              onClick={() => handleResolve('MANUAL')}
              className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
            >
              Keep manual report
            </button>
            <button 
              onClick={() => handleResolve('UNRESOLVED')}
              className="w-full bg-gray-50 border border-gray-200 text-gray-500 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition cursor-pointer"
            >
              Keep unresolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}