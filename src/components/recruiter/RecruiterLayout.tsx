import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { RecruiterSidebar } from "./RecruiterSidebar";
import { RecruiterHeader } from "./RecruiterHeader";
import { RecruiterMobileSidebar } from "./RecruiterMobileSidebar";

export const RecruiterLayout = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="grid-overlay absolute inset-0 opacity-30" />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="orb orb-crimson w-[400px] h-[400px] -top-48 -right-48"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="orb orb-navy w-[500px] h-[500px] -bottom-48 -left-48"
        />
      </div>

      <div className="hidden lg:block">
        <RecruiterSidebar />
      </div>

      <RecruiterMobileSidebar />

      <div className="lg:ml-[280px] transition-all duration-300 pt-16 lg:pt-0">
        <div className="hidden lg:block">
          <RecruiterHeader />
        </div>
        <main className="p-4 lg:p-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
