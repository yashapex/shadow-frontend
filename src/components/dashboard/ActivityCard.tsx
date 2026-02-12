import { motion } from "framer-motion";
import { LucideIcon, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  title: string;
  description: string;
  date: string;
  time: string;
  icon: LucideIcon;
  type: "interview" | "reminder" | "suggestion";
  actionLabel?: string;
  onAction?: () => void;
  delay?: number;
}

export const ActivityCard = ({
  title,
  description,
  date,
  time,
  icon: Icon,
  type,
  actionLabel = "View Details",
  onAction,
  delay = 0,
}: ActivityCardProps) => {
  const typeStyles = {
    interview: {
      bg: "from-accent/20 to-accent/5",
      icon: "bg-accent/20 text-accent",
      border: "border-accent/30",
    },
    reminder: {
      bg: "from-amber-500/20 to-amber-500/5",
      icon: "bg-amber-500/20 text-amber-400",
      border: "border-amber-500/30",
    },
    suggestion: {
      bg: "from-emerald-500/20 to-emerald-500/5",
      icon: "bg-emerald-500/20 text-emerald-400",
      border: "border-emerald-500/30",
    },
  };

  const style = typeStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ x: 5, transition: { duration: 0.2 } }}
      className={cn(
        "relative p-4 rounded-xl bg-gradient-to-r border backdrop-blur-sm group cursor-pointer",
        style.bg,
        style.border
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("p-3 rounded-xl shrink-0", style.icon)}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onAction}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
};
