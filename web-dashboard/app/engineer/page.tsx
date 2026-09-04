"use client";

import { useState } from "react";

export default function SiteEngineerCapturePage() {
  const [progress, setProgress] = useState(72);
  const [quantity, setQuantity] = useState("15");
  const [unit, setUnit] = useState("meters");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSync = async (saveOnly = false) => {
    setStatusMsg("Syncing with backend & AI Worker...");
    const formData = new FormData();
    formData.append("wbs_id", "7"); // L5.14 Spool Fabrication
    formData.append("progress", progress.toString());
    formData.append("quantity", quantity);
    formData.append("unit", unit);
    formData.append("lat", "22.5736");
    formData.append("lng", "88.3829");
    if (imageFile) formData.append("image", imageFile);
    if (audioFile) formData.append("audio", audioFile);

    try {
      const res = await fetch("http://localhost:3000/api/sync", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(saveOnly ? "Saved locally on device." : "Synced successfully! AI tags generated.");
      } else {
        setStatusMsg("Sync failed: " + data.error);
      }
    } catch (err) {
      setStatusMsg("Network error connecting to local server.");
    }
    setTimeout(() => setStatusMsg(null), 5000);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-6 relative font-sans text-[#1b1916]">
      {statusMsg && (
        <div className="fixed top-6 right-6 bg-[#1b1916] text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-xs font-bold border border-gray-700 animate-bounce">
          {statusMsg}
        </div>
      )}

      {/* Top Header */}
      <header className="flex justify-between items-start border-b border-gray-200/60 pb-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Oil Pipeline Phase 2</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Capture activity</h2>
        </div>
        <div className="bg-white border border-gray-200/80 px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-2 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Network good, last sync 2 min ago</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-700">Arjun Singh · Site Engineer</span>
        </div>
      </header>

      {/* Task Banner */}
      <div className="bg-white rounded-xl p-4 shadow-2xs border border-gray-200/60 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="bg-[#d66c25] text-white text-xs font-bold px-2.5 py-1 rounded">A</span>
          <span className="text-sm font-bold text-gray-900">PIP-05-003 / Pipe rack welding — Section 3</span>
        </div>
        <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
          Saved on device
        </span>
      </div>

      {/* Workflow Stepper Bar */}
      <div className="bg-white rounded-xl p-4 shadow-2xs border border-gray-200/60 flex justify-between items-center text-xs font-semibold text-gray-400">
        <span className="text-orange-600 font-bold">● Saved on device</span>
        <span>— Queued</span>
        <span>— Uploading</span>
        <span>— Verified</span>
        <span>— Approved</span>
        <span>— Published</span>
      </div>

      {/* Main Grid Layout (3 Columns matching Figma) */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Column 1: Activity Details & Location */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase">Activity details</h3>
              <p className="text-[10px] text-gray-400">Record 02418</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Project</p>
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800">
                Oil Pipeline Phase 2
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Work breakdown structure</p>
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 truncate">
                PIP-05-003 · Pipe rack welding — Sect...
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Progress · previous 60%</p>
                <span className="text-lg font-black text-[#d66c25]">{progress}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-[#d66c25] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Quantity</label>
                <input 
                  type="text" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Unit</label>
                <input 
                  type="text" 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-3 text-xs">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Location & capture</h3>
            <p className="text-[10px] text-gray-400">Auto-captured</p>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Coordinates</span>
              <span className="font-mono font-bold">Lat 22.5736 / Long 88.3829</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">GPS accuracy</span>
              <span className="font-bold">±3 m</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Captured time</span>
              <span className="font-bold">12 May 2025 · 10:43</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Location source</span>
              <span className="font-bold">Device GPS</span>
            </div>
          </div>
        </div>

        {/* Column 2: Handoff Manifest & Evidence Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase">Handoff manifest</h3>
              <p className="text-[10px] text-gray-400">1 of 5 uploaded, item-level sync receipt</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-600 font-semibold">Activity data</span>
                <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-[10px]">Ready</span>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-600 font-semibold">Photo 1 (YOLO11)</span>
                <label className="bg-[#d66c25] text-white px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer hover:bg-[#c25e1f]">
                  {imageFile ? "Attached ✓" : "Upload Image"}
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-600 font-semibold">Voice note (Whisper)</span>
                <label className="bg-gray-800 text-white px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer hover:bg-gray-700">
                  {audioFile ? "Voice Attached ✓" : "Upload Audio"}
                  <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-semibold pt-2">Local handoff completeness · {imageFile && audioFile ? '5 / 5' : '3 / 5'} attachments</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4 text-xs">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Sync attempt</h3>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Last completed</span>
              <span className="font-bold">12 May · 08:41</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Current attempt</span>
              <span className="font-bold text-orange-600">Queued · #03</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Connection</span>
              <span className="font-bold text-green-700">Network good</span>
            </div>
          </div>
        </div>

        {/* Column 3: Record History & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4 text-xs">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase">Record history</h3>
              <p className="text-[10px] text-gray-400">Chain of custody · current</p>
            </div>
            <div className="space-y-2 pt-1 border-b border-gray-100 pb-3">
              <div className="flex justify-between"><span className="text-gray-500">Current state</span><span className="font-bold text-orange-600">Saved on device</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Device</span><span className="font-bold">iPhone 14 · iOS</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Captured by</span><span className="font-bold">Arjun Singh</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Sync attempts</span><span className="font-bold">2 complete · 1 queued</span></div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="relative pl-4 border-l-2 border-orange-500 space-y-1">
                <p className="font-bold text-gray-800">Saved on device</p>
                <p className="text-[10px] text-gray-400">12 May · 10:43</p>
              </div>
              <div className="relative pl-4 border-l-2 border-gray-200 space-y-1">
                <p className="font-bold text-gray-800">Edited by Arjun</p>
                <p className="text-[10px] text-gray-400">12 May · 10:44</p>
              </div>
              <div className="relative pl-4 border-l-2 border-gray-200 space-y-1">
                <p className="font-bold text-gray-800">Sync attempt queued</p>
                <p className="text-[10px] text-gray-400">12 May · 10:45</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-2xs border border-gray-200/60 space-y-4">
            <button 
              onClick={() => handleSync(true)}
              className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-xs font-bold hover:bg-gray-50 transition shadow-2xs cursor-pointer"
            >
              Save on device
            </button>
            <button 
              onClick={() => handleSync(false)}
              className="w-full bg-[#d66c25] hover:bg-[#c25e1f] text-white py-3 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>⚡ Sync now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}