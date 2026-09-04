"use client";

export default function AdminSettingsPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6">
      <header className="border-b border-gray-200/60 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admin / Settings</p>
        <h2 className="text-3xl font-extrabold text-[#1b1916] tracking-tight">Platform Configuration</h2>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4 text-xs">
          <h3 className="font-bold text-gray-900 text-sm">YOLO11 Vision & Whisper AI Worker</h3>
          <div>
            <label className="block font-bold text-gray-600 mb-1">Inference Engine Endpoint</label>
            <input type="text" disabled value="http://localhost:8000/analyze" className="w-full bg-gray-50 border border-gray-200 rounded p-2 font-mono text-gray-600" />
          </div>
          <div>
            <label className="block font-bold text-gray-600 mb-1">Confidence Threshold</label>
            <input type="range" defaultValue={75} className="w-full accent-[#d66c25]" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4 text-xs">
          <h3 className="font-bold text-gray-900 text-sm">Database & Sync Polling</h3>
          <div>
            <label className="block font-bold text-gray-600 mb-1">PostgreSQL Connection String</label>
            <input type="text" disabled value="postgresql://postgres:***@localhost:5432/fieldsync" className="w-full bg-gray-50 border border-gray-200 rounded p-2 font-mono text-gray-600" />
          </div>
          <button onClick={() => alert("Database cache flushed successfully.")} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded transition">
            Flush Local Sync Cache
          </button>
        </div>
      </div>
    </div>
  );
}