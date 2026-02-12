import { motion } from "framer-motion";
import { Scale, AlertTriangle, TrendingUp, Shield, Brain, Info } from "lucide-react";
import { FairnessGauge } from "@/components/recruiter/FairnessGauge";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const biasComparison = [
  { category: "Technical Skills", human: 72, ai: 85 },
  { category: "Communication", human: 68, ai: 79 },
  { category: "Problem Solving", human: 75, ai: 82 },
  { category: "Leadership", human: 80, ai: 78 },
  { category: "Culture Fit", human: 85, ai: 76 },
];

const biasGapData = [
  { metric: "Gender Bias", gap: 3, severity: "low" },
  { metric: "Age Bias", gap: 8, severity: "medium" },
  { metric: "Education Bias", gap: 12, severity: "high" },
  { metric: "Name Bias", gap: 2, severity: "low" },
  { metric: "Location Bias", gap: 5, severity: "low" },
];

const diversityRadar = [
  { axis: "Gender Balance", value: 88 },
  { axis: "Age Diversity", value: 72 },
  { axis: "Education Mix", value: 65 },
  { axis: "Ethnic Diversity", value: 82 },
  { axis: "Experience Range", value: 90 },
  { axis: "Location Diversity", value: 78 },
];

const BiasAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Bias Analytics</h1>
        <p className="text-muted-foreground mt-1">AI-powered fairness monitoring and bias detection</p>
      </div>

      {/* Top Row: Fairness + Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 border border-border/30 flex flex-col items-center"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Fairness Index</h3>
          <FairnessGauge score={87} />
          <p className="text-xs text-muted-foreground mt-4 text-center">Based on analysis of 1,247 candidate evaluations across 24 job postings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/30"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Human vs AI Score Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={biasComparison} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }} />
              <Legend />
              <Bar dataKey="human" name="Human Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ai" name="AI Score" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bias Gap & Diversity Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-border/30"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-6">Bias Gap Analysis</h3>
          <div className="space-y-4">
            {biasGapData.map((item, i) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <AlertTriangle className={cn("w-4 h-4 shrink-0", item.severity === "high" ? "text-destructive" : item.severity === "medium" ? "text-amber-400" : "text-emerald-400")} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{item.metric}</span>
                    <span className={cn("font-medium", item.severity === "high" ? "text-destructive" : item.severity === "medium" ? "text-amber-400" : "text-emerald-400")}>
                      {item.gap}% gap
                    </span>
                  </div>
                  <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.gap * 5}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                      className={cn("h-full rounded-full", item.severity === "high" ? "bg-destructive" : item.severity === "medium" ? "bg-amber-400" : "bg-emerald-400")}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 border border-border/30"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Diversity Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={diversityRadar}>
              <PolarGrid stroke="hsl(var(--border) / 0.3)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar dataKey="value" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6 border border-accent/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/20">
            <Brain className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">AI Bias Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Education Bias Detected", desc: "AI scoring shows 12% higher preference for candidates from top-tier universities. Recommend blinding institution names during initial screening.", severity: "high", confidence: 94 },
            { title: "Age Neutrality Improving", desc: "Age-related scoring bias decreased from 15% to 8% after last calibration. Continue monitoring quarterly.", severity: "medium", confidence: 87 },
            { title: "Gender Scoring Balanced", desc: "No significant gender-based scoring differences detected across technical and behavioral assessments. Fairness maintained.", severity: "low", confidence: 96 },
          ].map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={cn("rounded-xl p-4 border", insight.severity === "high" ? "bg-destructive/5 border-destructive/20" : insight.severity === "medium" ? "bg-amber-500/5 border-amber-500/20" : "bg-emerald-500/5 border-emerald-500/20")}
            >
              <div className="flex items-center gap-2 mb-2">
                <Info className={cn("w-4 h-4", insight.severity === "high" ? "text-destructive" : insight.severity === "medium" ? "text-amber-400" : "text-emerald-400")} />
                <span className="text-sm font-medium text-foreground">{insight.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{insight.desc}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Confidence:</span>
                <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${insight.confidence}%` }} />
                </div>
                <span className="text-xs font-medium text-accent">{insight.confidence}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BiasAnalytics;
