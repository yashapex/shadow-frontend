import { motion } from "framer-motion";
import { Users, FileText, UserCheck, Video, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { HiringFunnel } from "@/components/recruiter/HiringFunnel";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";

const interviewData = [
  { month: "Jan", scheduled: 45, completed: 38 },
  { month: "Feb", scheduled: 52, completed: 47 },
  { month: "Mar", scheduled: 61, completed: 55 },
  { month: "Apr", scheduled: 48, completed: 44 },
  { month: "May", scheduled: 73, completed: 68 },
  { month: "Jun", scheduled: 65, completed: 61 },
];

const scoreDistribution = [
  { range: "0-20", count: 12 },
  { range: "21-40", count: 45 },
  { range: "41-60", count: 128 },
  { range: "61-80", count: 234 },
  { range: "81-100", count: 89 },
];

const recentActivity = [
  { action: "New application received", candidate: "James Wilson", role: "Frontend Developer", time: "5m ago" },
  { action: "Interview completed", candidate: "Emily Davis", role: "Data Scientist", time: "1h ago" },
  { action: "Candidate shortlisted", candidate: "Michael Brown", role: "DevOps Engineer", time: "2h ago" },
  { action: "Offer extended", candidate: "Lisa Chen", role: "Product Manager", time: "4h ago" },
];

const RecruiterDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Recruiter Dashboard</h1>
        <p className="text-muted-foreground mt-1">AI-powered hiring command center</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Applicants" value="1,247" icon={Users} trend={{ value: 12, isPositive: true }} delay={0} variant="accent" />
        <StatCard title="Active Job Posts" value="24" icon={FileText} trend={{ value: 8, isPositive: true }} delay={0.05} variant="default" />
        <StatCard title="Shortlisted" value="156" icon={UserCheck} trend={{ value: 15, isPositive: true }} delay={0.1} variant="success" />
        <StatCard title="Interviews Scheduled" value="38" icon={Video} trend={{ value: 5, isPositive: false }} delay={0.15} variant="warning" />
        <StatCard title="Hiring Success" value="78%" icon={TrendingUp} trend={{ value: 3, isPositive: true }} delay={0.2} variant="accent" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-border/30"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-6">Hiring Funnel</h3>
          <HiringFunnel />
        </motion.div>

        {/* Interview Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 border border-border/30"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-6">Interview Progress</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={interviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }} />
              <Area type="monotone" dataKey="scheduled" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" strokeWidth={2} />
              <Area type="monotone" dataKey="completed" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Score Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 border border-border/30"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-6">Candidate Score Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="count" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 border border-border/30"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.candidate} · {item.role}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
