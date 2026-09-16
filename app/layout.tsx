import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./_components/sidebar";
import Topbar from "./_components/topbar";


export const metadata: Metadata = {
  title: "HydroMesh",
  description: "Weather & Soil Station Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <Sidebar />
        <div className="lg:pl-[260px]">
          <Topbar />
          <main className="w-full pt-16 bg-slate-50 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
