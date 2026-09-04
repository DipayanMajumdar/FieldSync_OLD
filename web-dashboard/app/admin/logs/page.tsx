"use client";
import { useEffect, useState } from "react";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/admin/audit-logs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          setLogs([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setLogs([]);
      });
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admin / Audit Logs</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">System Audit Log Stream</h2>
      </header>

      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-4">Log ID</th>
              <th className="p-4">Target Activity</th>
              <th className="p-4">State</th>
              <th className="p-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {Array.isArray(logs) && logs.length > 0 ? (
              logs.map((l, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="p-4 font-mono text-gray-400">LOG-{l.id}</td>
                  <td className="p-4 font-semibold">{l.activity}</td>
                  <td className="p-4 font-bold text-green-700">{l.status}</td>
                  <td className="p-4 text-right text-gray-400">
                    {l.created_at ? new Date(l.created_at).toLocaleTimeString() : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  Loading audit logs or no logs found...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}