import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
  variant?: "default" | "accent" | "success" | "warning";
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  delay = 0,
  variant = "default",
}: StatCardProps) => {
  const variantStyles = {
    default: "from-primary/20 to-primary/5 border-primary/20",
    accent: "from-accent/20 to-destructive/5 border-accent/30",
    success: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
    warning: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  };

  const iconStyles = {
    default: "bg-primary/20 text-primary",
    accent: "bg-accent/20 text-accent",
    success: "bg-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/20 text-amber-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "relative p-6 rounded-2xl bg-gradient-to-br border backdrop-blur-xl overflow-hidden group cursor-pointer",
        variantStyles[variant]
      )}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-3 rounded-xl", iconStyles[variant])}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                trend.isPositive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              )}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <h3 className="text-3xl font-display font-bold text-foreground mb-1">
            {value}
          </h3>
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
          )}
        </motion.div>
      </div>

      {/* Decorative Element */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};
