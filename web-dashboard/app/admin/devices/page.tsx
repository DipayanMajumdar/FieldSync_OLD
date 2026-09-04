"use client";
import { useEffect, useState } from "react";

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/admin/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admin / Devices</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Connected Field Devices</h2>
      </header>

      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-4">Device Name</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Last Sync</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {devices.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-900">{d.device_name}</td>
                <td className="p-4 text-gray-600">{d.role}</td>
                <td className="p-4 font-mono text-gray-500">{d.ip}</td>
                <td className="p-4 text-gray-500">{d.last_sync}</td>
                <td className="p-4 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}