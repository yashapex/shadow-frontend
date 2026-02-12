import { motion } from "framer-motion";

const stages = [
  { label: "Applications", value: 1247, color: "from-primary to-primary/70", width: "100%" },
  { label: "Resume Screening", value: 834, color: "from-accent/80 to-accent/50", width: "67%" },
  { label: "Interview Stage", value: 412, color: "from-accent to-destructive/80", width: "33%" },
  { label: "Final Selection", value: 156, color: "from-destructive to-destructive/70", width: "12.5%" },
];

export const HiringFunnel = () => {
  return (
    <div className="space-y-4">
      {stages.map((stage, i) => (
        <div key={stage.label} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{stage.label}</span>
            <span className="font-display font-bold text-foreground">{stage.value}</span>
          </div>
          <div className="h-8 bg-muted/20 rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: stage.width }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${stage.color} rounded-lg flex items-center justify-end pr-3`}
            >
              <span className="text-xs font-medium text-foreground">{Math.round((stage.value / 1247) * 100)}%</span>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};
