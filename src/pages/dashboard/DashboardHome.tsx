import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  Zap,
  Search,
  FileCheck,
  Loader2,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { CircularProgress } from "@/components/dashboard/CircularProgress";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axiosconfig";

interface ApplicationSummary {
  total: number;
  screening: number;
  aiInterviewed: number;
  shortlisted: number;
  finalInterview: number;
  offers: number;
  rejected: number;
}

const DashboardHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ApplicationSummary>({
    total: 0, screening: 0, aiInterviewed: 0, shortlisted: 0,
    finalInterview: 0, offers: 0, rejected: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/applications/my-applications");
      const apps = Array.isArray(response.data) ? response.data : [];

      const summary: ApplicationSummary = {
        total: apps.length,
        screening: apps.filter((a: any) => a.status === "SCREENING").length,
        aiInterviewed: apps.filter((a: any) => a.status === "AIINTERVIEWED").length,
        shortlisted: apps.filter((a: any) => a.status === "SHORTLISTED").length,
        finalInterview: apps.filter((a: any) => a.status === "FINAL_INTERVIEW").length,
        offers: apps.filter((a: any) => a.status === "OFFER").length,
        rejected: apps.filter((a: any) => a.status === "REJECTED").length,
      };
      setStats(summary);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const successRate = stats.total > 0
    ? Math.round(((stats.shortlisted + stats.finalInterview + stats.offers) / stats.total) * 100)
    : 0;

  const interviewsPending = stats.screening + stats.finalInterview;

  const funnelStages = [
    { label: "Applied", value: stats.total, percent: 100 },
    { label: "Screening", value: stats.screening + stats.aiInterviewed + stats.shortlisted + stats.finalInterview + stats.offers, percent: stats.total > 0 ? Math.round(((stats.total - stats.rejected) / stats.total) * 100) : 0 },
    { label: "AI Interview", value: stats.aiInterviewed + stats.shortlisted + stats.finalInterview + stats.offers, percent: stats.total > 0 ? Math.round(((stats.aiInterviewed + stats.shortlisted + stats.finalInterview + stats.offers) / stats.total) * 100) : 0 },
    { label: "Shortlisted", value: stats.shortlisted + stats.finalInterview + stats.offers, percent: stats.total > 0 ? Math.round(((stats.shortlisted + stats.finalInterview + stats.offers) / stats.total) * 100) : 0 },
    { label: "Offers", value: stats.offers, percent: stats.total > 0 ? Math.round((stats.offers / stats.total) * 100) : 0 },
  ];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-foreground">
          Welcome back, <span className="text-gradient">{user?.name || "Candidate"}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your career journey overview
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Jobs Applied" value={stats.total} icon={Briefcase} delay={0} variant="accent" />
        <StatCard title="Interviews Pending" value={interviewsPending} icon={Calendar} delay={0.05} variant="default" />
        <StatCard title="Success Rate" value={`${successRate}%`} icon={TrendingUp} delay={0.1} variant="success" />
        <StatCard title="Offers Received" value={stats.offers} icon={Zap} delay={0.15} variant="accent" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Funnel */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border border-border/30"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">
              Application Funnel
            </h3>
            {stats.total === 0 ? (
              <div className="text-center py-8">
                <Search className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No applications yet. Start exploring jobs!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {funnelStages.map((stage, index) => (
                  <div key={stage.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{stage.label}</span>
                      <span className="text-sm font-medium text-foreground">
                        {stage.value} ({stage.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.percent}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * index }}
                        className="h-full bg-gradient-to-r from-accent to-destructive rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Sidebar - Status Overview */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border border-border/30 flex flex-col items-center"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-6">
              Success Rate
            </h3>
            <CircularProgress
              value={successRate}
              label={successRate >= 50 ? "Strong" : "Growing"}
              sublabel="performance"
            />
          </motion.div>

          {/* Quick Status Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 border border-border/30"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">
              Status Breakdown
            </h3>
            <div className="space-y-3">
              {[
                { label: "Screening", count: stats.screening, color: "bg-amber-400" },
                { label: "AI Interviewed", count: stats.aiInterviewed, color: "bg-blue-400" },
                { label: "Shortlisted", count: stats.shortlisted, color: "bg-emerald-400" },
                { label: "Final Interview", count: stats.finalInterview, color: "bg-purple-400" },
                { label: "Offers", count: stats.offers, color: "bg-accent" },
                { label: "Rejected", count: stats.rejected, color: "bg-destructive" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
