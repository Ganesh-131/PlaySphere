import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full relative">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow font-delay-1000"></div>
      
      <Sidebar />
      <main className="flex-1 relative z-10 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
