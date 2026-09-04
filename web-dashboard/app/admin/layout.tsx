"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Sync health", href: "/admin" },
    { label: "Conflicts", href: "/admin/conflicts" },
    { label: "Devices", href: "/admin/devices" },
    { label: "Users", href: "/admin/users" },
    { label: "Projects", href: "/admin/projects" },
    { label: "Audit logs", href: "/admin/logs" },
    { label: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#f5f4ef] text-[#1b1916] font-sans overflow-hidden">
      {/* Dark Admin Sidebar */}
      <aside className="w-64 bg-[#1b1916] text-gray-400 flex flex-col justify-between shrink-0 shadow-xl z-25">
        <div>
          <div className="p-6 border-b border-gray-800/60">
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Field<span className="text-[#d66c25]">Sync</span>
            </h1>
            <p className="text-[9px] tracking-[0.2em] text-gray-500 mt-1 uppercase font-semibold">Operations Platform</p>
          </div>

          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? "bg-[#2d2925] text-white font-semibold shadow-inner"
                      : "text-gray-400 hover:text-white hover:bg-[#25221e]"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-gray-800/60 bg-[#141210] flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold text-xs">
            EM
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Elon Musk</p>
            <p className="text-[10px] text-gray-500 truncate">Admin</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f5f4ef]">
        {children}
      </main>
    </div>
  );
}