import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, FileText, UserCheck, Video, TrendingUp, Loader2, Briefcase } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { HiringFunnel } from "@/components/recruiter/HiringFunnel";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axiosconfig";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  totalApplicants: number;
  activeJobs: number;
  shortlisted: number;
  interviewsScheduled: number;
  hiringSuccessRate: number;
  statusDistribution: { status: string; count: number }[];
}

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplicants: 0, activeJobs: 0, shortlisted: 0,
    interviewsScheduled: 0, hiringSuccessRate: 0, statusDistribution: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appsRes, jobsRes] = await Promise.all([
        api.get("/applications/recruiter/all"),
        api.get("/jobs/my-jobs"),
      ]);

      const apps = Array.isArray(appsRes.data) ? appsRes.data : [];
      const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];

      const shortlisted = apps.filter((a: any) => a.status === "SHORTLISTED").length;
      const finalInterview = apps.filter((a: any) => a.status === "FINAL_INTERVIEW").length;
      const offers = apps.filter((a: any) => a.status === "OFFER").length;
      const total = apps.length;

      // Build status distribution for chart
      const statusMap: Record<string, number> = {};
      apps.forEach((a: any) => {
        statusMap[a.status] = (statusMap[a.status] || 0) + 1;
      });
      const statusDistribution = Object.entries(statusMap).map(([status, count]) => ({
        status: status.replace(/_/g, " "),
        count: count as number,
      }));

      setStats({
        totalApplicants: total,
        activeJobs: jobs.length,
        shortlisted,
        interviewsScheduled: finalInterview,
        hiringSuccessRate: total > 0 ? Math.round(((shortlisted + offers) / total) * 100) : 0,
        statusDistribution,
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Welcome, <span className="text-gradient">{user?.name || "Recruiter"}</span>
        </h1>
        <p className="text-muted-foreground mt-1">AI-powered hiring command center</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Applicants" value={stats.totalApplicants} icon={Users} delay={0} variant="accent" />
        <StatCard title="Active Job Posts" value={stats.activeJobs} icon={FileText} delay={0.05} variant="default" />
        <StatCard title="Shortlisted" value={stats.shortlisted} icon={UserCheck} delay={0.1} variant="success" />
        <StatCard title="Interviews Scheduled" value={stats.interviewsScheduled} icon={Video} delay={0.15} variant="warning" />
        <StatCard title="Hiring Success" value={`${stats.hiringSuccessRate}%`} icon={TrendingUp} delay={0.2} variant="accent" />
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
          {stats.totalApplicants === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No applications yet.</p>
            </div>
          ) : (
            <HiringFunnel />
          )}
        </motion.div>

        {/* Application Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 border border-border/30"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-6">Application Status Distribution</h3>
          {stats.statusDistribution.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No data available.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }} />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
