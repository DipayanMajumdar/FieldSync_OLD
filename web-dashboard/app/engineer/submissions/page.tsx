"use client";
import { useEffect, useState } from "react";

export default function EngineerSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/engineer/submissions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubmissions(data);
      })
      .catch((err) => console.error("Failed to load submissions:", err));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Site Engineer / Submissions</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">My Submissions Log</h2>
      </header>

      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-4">Task Code</th>
              <th className="p-4">Activity Name</th>
              <th className="p-4">Progress</th>
              <th className="p-4">Quantity</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {Array.isArray(submissions) && submissions.length > 0 ? (
              submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-mono text-[#d66c25] font-bold">{sub.task_code || "PIP-05"}</td>
                  <td className="p-4 font-semibold">{sub.task_name}</td>
                  <td className="p-4 font-bold">{sub.progress}%</td>
                  <td className="p-4 text-gray-600">{sub.quantity} {sub.unit}</td>
                  <td className="p-4 text-right">
                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded font-bold text-[10px]">
                      {sub.status || "SYNCED"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">No field submissions found in database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}