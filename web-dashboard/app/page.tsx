"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("Project Manager");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "Project Manager") router.push("/manager");
    else if (role === "Site Engineer") router.push("/engineer");
    else if (role === "Admin") router.push("/admin");
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-[#121412] text-white p-12 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d66c25]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Field<span className="text-[#d66c25]">Sync</span>
          </h1>
          <p className="text-[9px] tracking-[0.25em] text-gray-500 mt-1 uppercase">Field Control</p>
        </div>

        <div className="max-w-md z-10 my-auto">
          <h2 className="text-4xl xl:text-5xl font-semibold tracking-tight leading-[1.15] mb-6">
            Smart field data,<br />connected projects.
          </h2>
          <p className="text-gray-400 text-xs xl:text-sm leading-relaxed mb-12">
            Capture field data, verify evidence, and keep every project role synced — from site engineer to project control.
          </p>

          <div className="flex gap-12">
            <div>
              <p className="text-2xl font-bold">94%</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Sync success</p>
            </div>
            <div>
              <p className="text-2xl font-bold">47</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Devices online</p>
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Active projects</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-gray-500 border-t border-gray-800/80 pt-6 flex justify-between">
          <span>© 2026 FieldSync</span>
          <span>Secure access • Role-based permissions</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#f5f4ef] p-8">
        <div className="w-full max-w-sm">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Welcome Back</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">Sign in to FieldSync</h2>
          <p className="text-xs text-gray-500 mb-8">Enter your credentials to continue to your project workspace.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Employee ID</label>
              <input 
                type="text" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. FS-2291" 
                className="w-full bg-white border border-gray-200/80 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#d66c25] focus:ring-1 focus:ring-[#d66c25] transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password" 
                  className="w-full bg-white border border-gray-200/80 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#d66c25] focus:ring-1 focus:ring-[#d66c25] transition shadow-2xs"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 hover:text-gray-600">SHOW</button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-[11px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Login as</label>
              <div 
                className="w-full bg-white border border-gray-200/80 rounded-lg px-4 py-3 text-xs flex justify-between items-center cursor-pointer shadow-2xs"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              >
                <span className="text-gray-900 font-medium">{role}</span>
                <span className="text-[9px] text-gray-500">▼</span>
              </div>
              
              {showRoleDropdown && (
                <div className="absolute w-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                  {["Site Engineer", "Project Manager", "Admin"].map((r) => (
                    <div 
                      key={r} 
                      className="px-4 py-3 text-xs text-gray-800 hover:bg-[#f5f4ef] cursor-pointer font-medium border-b border-gray-50 last:border-none"
                      onClick={() => { setRole(r); setShowRoleDropdown(false); }}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#d66c25] hover:bg-[#c25e1f] text-white font-semibold rounded-lg py-3.5 text-xs transition mt-2 shadow-sm"
            >
              Sign In
            </button>
          </form>
          
          <p className="text-center text-[10px] text-gray-400 mt-8">Secure access • Data encrypted in transit</p>
        </div>
      </div>
    </div>
  );
}