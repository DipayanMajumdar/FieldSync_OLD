import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FieldSync — Field Control",
  description: "Smart field data, connected projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f4ef] text-gray-900 antialiased selection:bg-[#d66c25] selection:text-white m-0 p-0">
        {children}
      </body>
    </html>
  );
}