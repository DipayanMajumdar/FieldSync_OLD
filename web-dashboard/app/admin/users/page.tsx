"use client";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admin / Users</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">User Access & Permissions</h2>
      </header>

      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-4">Identity Title</th>
              <th className="p-4">System Role</th>
              <th className="p-4">Zone Access</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-900">{u.name}</td>
                <td className="p-4 text-gray-600">{u.role}</td>
                <td className="p-4 text-gray-500">{u.access}</td>
                <td className="p-4 text-right font-bold text-green-700">{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}