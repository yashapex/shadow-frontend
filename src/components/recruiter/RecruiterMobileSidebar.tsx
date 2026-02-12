import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, Video, Scale, BarChart3, Settings, Menu, X, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Dashboard", path: "/recruiter", icon: LayoutDashboard },
  { title: "Job Postings", path: "/recruiter/jobs", icon: FileText },
  { title: "Candidates", path: "/recruiter/candidates", icon: Users },
  { title: "Interviews", path: "/recruiter/interviews", icon: Video },
  { title: "Bias Analytics", path: "/recruiter/bias", icon: Scale },
  { title: "Reports", path: "/recruiter/reports", icon: BarChart3 },
  { title: "Settings", path: "/recruiter/settings", icon: Settings },
];

export const RecruiterMobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="lg:hidden">
      <div className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="p-2 rounded-lg bg-muted/20 border border-border/30 text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="sm" clickable={true} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 z-50 glass-card border-r border-border/50 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <Logo size="sm" clickable={true} />
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2 flex-1">
                {navItems.map((item) => {
                  const isActive = item.path === "/recruiter" ? location.pathname === "/recruiter" : location.pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.path} to={item.path} end={item.path === "/recruiter"} onClick={() => setIsOpen(false)}>
                      <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300", isActive ? "bg-gradient-to-r from-accent/20 to-destructive/10 border border-accent/40" : "hover:bg-muted/30 border border-transparent")}>
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isActive ? "bg-accent/20 text-accent" : "bg-muted/30 text-muted-foreground")}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={cn("font-medium text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>{item.title}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </nav>

              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30 transition-all duration-300 mt-4">
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
