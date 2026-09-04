"use client";

export default function AdminProjectsPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admin / Projects</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Active Project Registry</h2>
      </header>

      <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4 text-xs">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Oil Pipeline Phase 2 — Sector 7B</h4>
            <p className="text-gray-500 mt-0.5">Database URI: postgresql://postgres:***@localhost:5432/fieldsync</p>
          </div>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-bold text-[10px]">Active</span>
        </div>
      </div>
    </div>
  );
}