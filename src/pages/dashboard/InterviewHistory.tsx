import { useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  Calendar,
  Clock,
  Play,
  FileText,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Search,
  Filter,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ProgressChart } from "@/components/dashboard/ProgressChart";

interface InterviewRecord {
  id: string;
  title: string;
  company: string;
  date: string;
  duration: string;
  score: number;
  type: "technical" | "behavioral" | "system-design";
  trend: "up" | "down" | "stable";
  transcript?: string;
}

const interviewHistory: InterviewRecord[] = [
  {
    id: "1",
    title: "Frontend Technical Interview",
    company: "Google",
    date: "Jan 28, 2024",
    duration: "45 min",
    score: 85,
    type: "technical",
    trend: "up",
  },
  {
    id: "2",
    title: "Behavioral Interview",
    company: "Meta",
    date: "Jan 25, 2024",
    duration: "30 min",
    score: 72,
    type: "behavioral",
    trend: "stable",
  },
  {
    id: "3",
    title: "System Design Session",
    company: "Practice",
    date: "Jan 22, 2024",
    duration: "60 min",
    score: 78,
    type: "system-design",
    trend: "up",
  },
  {
    id: "4",
    title: "Technical Mock Interview",
    company: "Practice",
    date: "Jan 18, 2024",
    duration: "40 min",
    score: 68,
    type: "technical",
    trend: "down",
  },
  {
    id: "5",
    title: "Full Stack Interview",
    company: "Stripe",
    date: "Jan 15, 2024",
    duration: "55 min",
    score: 92,
    type: "technical",
    trend: "up",
  },
];

const performanceTrend = [
  { name: "Jan 10", value: 65 },
  { name: "Jan 15", value: 72 },
  { name: "Jan 18", value: 68 },
  { name: "Jan 22", value: 78 },
  { name: "Jan 25", value: 72 },
  { name: "Jan 28", value: 85 },
];

const InterviewHistory = () => {
  const [selectedInterview, setSelectedInterview] = useState<InterviewRecord | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredHistory = interviewHistory.filter(
    (interview) => typeFilter === "all" || interview.type === typeFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Interview History
          </h1>
          <p className="text-muted-foreground mt-1">
            Review your past interviews and track improvement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <History className="w-3 h-3" />
            {interviewHistory.length} Sessions
          </Badge>
        </div>
      </motion.div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <ProgressChart
            data={performanceTrend}
            title="Performance Trend"
            subtitle="Your interview scores over time"
          />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-6 border border-border/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-destructive/10 flex items-center justify-center">
                <Award className="w-7 h-7 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-foreground">
                  78%
                </p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 border border-border/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-foreground">
                  +12%
                </p>
                <p className="text-sm text-muted-foreground">Improvement</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border border-border/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-foreground">
                  4.2h
                </p>
                <p className="text-sm text-muted-foreground">Total Practice</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-4 border border-border/30"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search interviews..."
              className="pl-10 bg-muted/20 border-border/30"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] bg-muted/20 border-border/30">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="behavioral">Behavioral</SelectItem>
              <SelectItem value="system-design">System Design</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Interview Timeline */}
      <div className="glass-card rounded-2xl p-6 border border-border/30">
        <h3 className="text-lg font-display font-semibold text-foreground mb-6">
          Recent Sessions
        </h3>
        <div className="space-y-4">
          {filteredHistory.map((interview, index) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
              onClick={() => setSelectedInterview(interview)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300",
                selectedInterview?.id === interview.id
                  ? "bg-accent/10 border-accent/30"
                  : "bg-muted/10 border-border/30 hover:border-accent/20"
              )}
            >
              {/* Score Circle */}
              <div
                className={cn(
                  "w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0",
                  interview.score >= 80
                    ? "bg-emerald-500/20 text-emerald-400"
                    : interview.score >= 60
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-red-500/20 text-red-400"
                )}
              >
                <span className="text-xl font-display font-bold">
                  {interview.score}
                </span>
                <span className="text-[10px] uppercase tracking-wider">Score</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground truncate">
                      {interview.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {interview.company}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "shrink-0",
                      interview.type === "technical"
                        ? "bg-accent/20 text-accent border-accent/30"
                        : interview.type === "behavioral"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                    )}
                  >
                    {interview.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {interview.date}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {interview.duration}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      interview.trend === "up"
                        ? "text-emerald-400"
                        : interview.trend === "down"
                        ? "text-red-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {interview.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : interview.trend === "down" ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    {interview.trend === "up"
                      ? "Improved"
                      : interview.trend === "down"
                      ? "Needs Work"
                      : "Stable"}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm">
                  <Play className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <FileText className="w-4 h-4" />
                </Button>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Score Comparison */}
      <div className="glass-card rounded-2xl p-6 border border-border/30">
        <h3 className="text-lg font-display font-semibold text-foreground mb-6">
          Category Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { category: "Technical", score: 82, total: 3, color: "from-accent to-destructive" },
            { category: "Behavioral", score: 72, total: 1, color: "from-blue-500 to-blue-600" },
            { category: "System Design", score: 78, total: 1, color: "from-purple-500 to-purple-600" },
          ].map((cat, index) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {cat.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  {cat.total} sessions
                </span>
              </div>
              <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.score}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
                    cat.color
                  )}
                />
              </div>
              <div className="text-center">
                <span className="text-2xl font-display font-bold text-foreground">
                  {cat.score}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewHistory;
