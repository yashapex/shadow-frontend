import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, Mic, History, BarChart3, User,
  Menu, X, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Applied Jobs", path: "/dashboard/jobs", icon: Briefcase },
  { title: "Mock Interview", path: "/dashboard/interview", icon: Mic },
  { title: "Interview History", path: "/dashboard/history", icon: History },
  { title: "Skill Analysis", path: "/dashboard/skills", icon: BarChart3 },
  { title: "Profile Settings", path: "/dashboard/profile", icon: User },
];

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-16 glass-card border-b border-border/30 z-50 flex items-center justify-between px-4 lg:hidden">
        <Logo size="sm" clickable={true} />
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-foreground">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 left-0 bottom-0 w-72 glass-card border-r border-border/30 z-50 p-4 lg:hidden flex flex-col"
            >
              <nav className="space-y-2 flex-1">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                        className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300", isActive ? "bg-gradient-to-r from-accent/20 to-destructive/10 border border-accent/40" : "hover:bg-muted/30 border border-transparent")}
                      >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isActive ? "bg-accent/20 text-accent" : "bg-muted/30 text-muted-foreground")}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={cn("font-medium text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>{item.title}</span>
                      </motion.div>
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
    </>
  );
};
