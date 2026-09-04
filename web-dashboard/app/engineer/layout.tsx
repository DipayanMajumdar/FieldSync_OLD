"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Capture activity", href: "/engineer" },
    { label: "My submissions", href: "/engineer/submissions" },
    { label: "Sync queue", href: "/engineer/queue", badge: 4 },
    { label: "Projects", href: "/engineer/projects" },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#f5f4ef] text-[#1b1916] font-sans overflow-hidden">
      {/* Mobile Mimic Dark Sidebar */}
      <aside className="w-64 bg-[#1b1916] text-gray-400 flex flex-col justify-between shrink-0 shadow-xl z-25">
        <div>
          <div className="p-6 border-b border-gray-800/60">
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Field<span className="text-[#d66c25]">Sync</span>
            </h1>
            <p className="text-[9px] tracking-[0.2em] text-gray-500 mt-1 uppercase font-semibold">Site Engineer</p>
          </div>

          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? "bg-[#2d2925] text-white font-semibold shadow-inner"
                      : "text-gray-400 hover:text-white hover:bg-[#25221e]"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-gray-800/60 bg-[#141210] space-y-2">
          <div className="text-[10px] text-gray-400 font-mono">
            <p>iPhone 14 · iOS</p>
            <p className="text-green-500">Battery 78% · GPS ±3m</p>
          </div>
          <div className="flex items-center space-x-3 pt-2 border-t border-gray-800">
            <div className="w-7 h-7 rounded-full bg-[#d66c25] text-white flex items-center justify-center font-bold text-[11px]">
              AS
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Arjun Singh</p>
              <p className="text-[10px] text-gray-500 truncate">Site Engineer</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f5f4ef]">
        {children}
      </main>
    </div>
  );
}