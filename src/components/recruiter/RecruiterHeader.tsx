import { motion } from "framer-motion";
import { Bell, Search, Bot, Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";
import { UserNav } from "../layout/UserNav";

export const RecruiterHeader = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-border/30 px-6 py-4">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search candidates, jobs, interviews..." className="pl-10 bg-muted/20 border-border/30 focus:border-accent/50 focus:ring-accent/20" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
          <Button variant="glass" size="sm" className="gap-2 bg-gradient-to-r from-accent/10 to-destructive/10 border-accent/30 hover:border-accent/50">
            <Bot className="w-4 h-4 text-accent" />
            <span className="text-sm">AI Hiring Assistant</span>
          </Button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted/20 border border-border/30 text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-300"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="relative p-2 rounded-lg bg-muted/20 border border-border/30 text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
          </button>

          <Link to="/recruiter/settings">
            <button className="p-2 rounded-lg bg-muted/20 border border-border/30 text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-300">
              <Settings className="w-5 h-5" />
            </button>
          </Link>

          <div className="flex items-center gap-3 pl-4 border-l border-border/30">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-foreground">{user?.name || "Recruiter"}</p>
            <p className="text-xs text-muted-foreground">HR Director</p>
          </div>
          <UserNav />
        </div>
        </motion.div>
      </div>
    </header>
  );
};