import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  Zap,
  Video,
  Target,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { CircularProgress } from "@/components/dashboard/CircularProgress";
import { SkillRadarChart } from "@/components/dashboard/SkillRadarChart";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { Button } from "@/components/ui/button";

const statsData = [
  {
    title: "Total Jobs Applied",
    value: 24,
    icon: Briefcase,
    trend: { value: 12, isPositive: true },
    variant: "accent" as const,
  },
  {
    title: "Upcoming Interviews",
    value: 3,
    icon: Calendar,
    subtitle: "Next: Tomorrow at 2PM",
    variant: "default" as const,
  },
  {
    title: "Success Rate",
    value: "68%",
    icon: TrendingUp,
    trend: { value: 5, isPositive: true },
    variant: "success" as const,
  },
  {
    title: "AI Readiness Score",
    value: 87,
    icon: Zap,
    trend: { value: 8, isPositive: true },
    variant: "accent" as const,
  },
];

const skillsData = [
  { skill: "Communication", value: 85, fullMark: 100 },
  { skill: "Technical", value: 92, fullMark: 100 },
  { skill: "Problem Solving", value: 78, fullMark: 100 },
  { skill: "Leadership", value: 65, fullMark: 100 },
  { skill: "Creativity", value: 88, fullMark: 100 },
  { skill: "Teamwork", value: 90, fullMark: 100 },
];

const progressData = [
  { name: "Week 1", value: 45, target: 60 },
  { name: "Week 2", value: 52, target: 65 },
  { name: "Week 3", value: 61, target: 70 },
  { name: "Week 4", value: 68, target: 75 },
  { name: "Week 5", value: 75, target: 80 },
  { name: "Week 6", value: 87, target: 85 },
];

const upcomingActivities = [
  {
    title: "Technical Interview - Google",
    description: "Frontend Engineer position - System design round",
    date: "Tomorrow",
    time: "2:00 PM",
    icon: Video,
    type: "interview" as const,
  },
  {
    title: "Practice Mock Interview",
    description: "AI suggests preparing for behavioral questions",
    date: "Today",
    time: "5:00 PM",
    icon: Target,
    type: "reminder" as const,
  },
  {
    title: "Improve React Skills",
    description: "Complete React hooks advanced tutorial to boost your score",
    date: "This Week",
    time: "Flexible",
    icon: Lightbulb,
    type: "suggestion" as const,
  },
];

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, <span className="text-gradient">Alex</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your career journey overview
          </p>
        </div>
        {/* <Button variant="hero" size="lg" className="gap-2">
          Start Mock Interview
          <ArrowUpRight className="w-5 h-5" />
        </Button> */}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          <ProgressChart
            data={progressData}
            title="Skill Growth Over Time"
            subtitle="Your interview performance improvement"
            showTarget
          />

          {/* Application Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 border border-border/30"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">
              Application Funnel
            </h3>
            <div className="space-y-4">
              {[
                { label: "Applied", value: 24, percent: 100 },
                { label: "Screening", value: 18, percent: 75 },
                { label: "Interview", value: 12, percent: 50 },
                { label: "Final Round", value: 5, percent: 21 },
                { label: "Offers", value: 2, percent: 8 },
              ].map((stage, index) => (
                <div key={stage.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {stage.label}
                    </span>
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
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Readiness Meter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border border-border/30 flex flex-col items-center"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-6">
              AI Readiness Score
            </h3>
            <CircularProgress
              value={87}
              label="Ready"
              sublabel="for interviews"
            />
            <p className="text-sm text-muted-foreground text-center mt-4">
              You're in the top 15% of candidates!
            </p>
          </motion.div>

          {/* Skill Radar */}
          <SkillRadarChart data={skillsData} title="Skill Overview" />
        </div>
      </div>

      {/* Upcoming Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6 border border-border/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-semibold text-foreground">
            Upcoming Activities
          </h3>
          <Button variant="ghost" size="sm">
            View All
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {upcomingActivities.map((activity, index) => (
            <ActivityCard
              key={activity.title}
              {...activity}
              delay={0.5 + index * 0.1}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
