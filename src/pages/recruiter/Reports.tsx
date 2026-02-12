import { motion } from "framer-motion";
import { Download, Clock, TrendingUp, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

const hiringTrend = [
  { month: "Aug", hires: 8 }, { month: "Sep", hires: 12 }, { month: "Oct", hires: 15 },
  { month: "Nov", hires: 11 }, { month: "Dec", hires: 18 }, { month: "Jan", hires: 22 },
];

const sourceData = [
  { name: "LinkedIn", value: 35, color: "hsl(var(--accent))" },
  { name: "Referrals", value: 25, color: "hsl(var(--destructive))" },
  { name: "Job Boards", value: 20, color: "hsl(var(--primary))" },
  { name: "Career Site", value: 15, color: "hsl(45, 100%, 50%)" },
  { name: "Other", value: 5, color: "hsl(var(--muted-foreground))" },
];

const deptHiring = [
  { dept: "Engineering", open: 12, filled: 8 },
  { dept: "Product", open: 5, filled: 4 },
  { dept: "Design", open: 3, filled: 2 },
  { dept: "Marketing", open: 4, filled: 3 },
  { dept: "Sales", open: 6, filled: 5 },
];

const kpis = [
  { label: "Avg Time to Hire", value: "18 days", icon: Clock, trend: -12 },
  { label: "Cost per Hire", value: "$4,200", icon: Briefcase, trend: -8 },
  { label: "Offer Acceptance", value: "89%", icon: TrendingUp, trend: 5 },
  { label: "Candidate NPS", value: "72", icon: Users, trend: 10 },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Hiring analytics and performance insights</p>
        </div>
        <Button variant="heroOutline" className="gap-2">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-5 border border-border/30"
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="w-5 h-5 text-accent" />
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", kpi.trend > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-accent/20 text-accent")}>
                {kpi.trend > 0 ? "↑" : "↓"}{Math.abs(kpi.trend)}%
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6 border border-border/30">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Hiring Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={hiringTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }} />
              <Area type="monotone" dataKey="hires" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6 border border-border/30">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Candidate Sources</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {sourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {sourceData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name} ({s.value}%)
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dept Hiring */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6 border border-border/30">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Department Hiring Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={deptHiring} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
            <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }} />
            <Bar dataKey="open" name="Open Positions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="filled" name="Filled" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Reports;
