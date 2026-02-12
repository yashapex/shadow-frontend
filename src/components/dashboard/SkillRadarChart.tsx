import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface SkillData {
  skill: string;
  value: number;
  fullMark: number;
}

interface SkillRadarChartProps {
  data: SkillData[];
  title?: string;
}

export const SkillRadarChart = ({ data, title }: SkillRadarChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6 border border-border/30"
    >
      {title && (
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">
          {title}
        </h3>
      )}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <defs>
              <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 100%, 50%)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(7, 100%, 61%)" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <PolarGrid
              stroke="hsl(var(--border))"
              strokeOpacity={0.3}
            />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="hsl(0, 100%, 50%)"
              fill="url(#skillGradient)"
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
