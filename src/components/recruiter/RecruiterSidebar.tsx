import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, Video, Scale, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Dashboard", path: "/recruiter", icon: LayoutDashboard },
  { title: "Job Postings", path: "/recruiter/jobs", icon: FileText },
  { title: "Live Interviews", path: "/recruiter/live-interviews", icon: Video }, // For Scheduling
  { title: "Results & Reports", path: "/recruiter/results", icon: FileText },
  { title: "Candidates", path: "/recruiter/candidates", icon: Users },
  { title: "Interviews", path: "/recruiter/interviews", icon: Video },
  // { title: "Bias Analytics", path: "/recruiter/bias", icon: Scale },
  { title: "Reports", path: "/recruiter/reports", icon: BarChart3 },
  { title: "Settings", path: "/recruiter/settings", icon: Settings },
];

export const RecruiterSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-50 glass-card border-r border-border/50 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-3">
          {isCollapsed ? (
            <Logo size="sm" clickable={true} className="[&>span]:hidden" />
          ) : (
            <div>
              <Logo size="md" clickable={true} />
              <p className="text-xs text-muted-foreground mt-1 ml-[52px]">Recruiter Command</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = item.path === "/recruiter" ? location.pathname === "/recruiter" : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path} end={item.path === "/recruiter"}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-accent/20 to-destructive/10 border border-accent/40"
                    : "hover:bg-muted/30 border border-transparent hover:border-border/50"
                )}
              >
                {isActive && <motion.div layoutId="recruiterActiveIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-accent to-destructive rounded-r-full" />}
                <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300", isActive ? "bg-accent/20 text-accent" : "bg-muted/30 text-muted-foreground group-hover:text-accent group-hover:bg-accent/10")}>
                  <Icon className="w-5 h-5" />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className={cn("font-medium text-sm", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 rounded-xl bg-accent/5 blur-xl -z-10" />}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Hiring Health */}
      {/* <AnimatePresence>
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="p-4 mx-4 mb-2 rounded-xl bg-gradient-to-br from-accent/10 to-destructive/5 border border-accent/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Hiring Health</span>
              <span className="text-lg font-display font-bold text-gradient">92%</span>
            </div>
            <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-accent to-destructive rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Logout Button */}
      <div className="p-4 border-t border-border/30">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30 transition-all duration-300",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-medium text-sm">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/50 transition-all duration-300 z-50"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
};
