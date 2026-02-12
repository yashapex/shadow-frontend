import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  FileText,
  TrendingUp,
  Calendar,
  X,
  Loader2,
  BrainCircuit,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import api from "@/lib/axiosconfig";
import { useToast } from "@/hooks/use-toast";

// --- Types ---

interface BackendJob {
  id: number;
  title: string;
  location: string;
  salaryRange: string;
  description: string;
  requiredSkills: string;
  experienceLevel: string;
  recruiter: {
    id: number;
    name: string;
    email: string;
  };
}

interface BackendApplication {
  id: number;
  status: string;
  matchScore: number;
  appliedAt: string;
  job: BackendJob;
  aiFeedback: string;
  aiVerdict: string;
  interviewScore: number;
  interviewSummary: string;
  keyObservation: string;
  redFlags: string;
  interviewVerdict: string;
}

interface JobUI {
  id: string;
  appId: number;
  company: string;
  role: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: string;
  matchScore: number;
  logo: string;
  description: string;
  skills: string[];
  experienceLevel: string;
  timeline: { 
    event: string; 
    status: "completed" | "current" | "pending" 
  }[];
  aiFeedback?: string;
  aiVerdict?: string;
  interviewScore?: number;
  interviewSummary?: string;
  keyObservation?: string;
  redFlags?: string;
}

// --- Configuration ---
const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  APPLIED: { 
    label: "Applied", 
    icon: Clock, 
    color: "text-amber-400 bg-amber-400/10 border-amber-400/30" 
  },
  SCREENING: { 
    label: "Screening", 
    icon: FileText, 
    color: "text-blue-400 bg-blue-400/10 border-blue-400/30" 
  },
  AIINTERVIEWED: { 
    label: "AI Interview", 
    icon: BrainCircuit, 
    color: "text-purple-400 bg-purple-400/10 border-purple-400/30" 
  },
  SHORTLISTED: { 
    label: "Shortlisted", 
    icon: CheckCircle2, 
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" 
  },
  FINAL_INTERVIEW: { 
    label: "Interview", 
    icon: Calendar, 
    color: "text-accent bg-accent/10 border-accent/30" 
  },
  OFFER: { 
    label: "Offer", 
    icon: CheckCircle2, 
    color: "text-green-500 bg-green-500/10 border-green-500/30" 
  },
  REJECTED: { 
    label: "Rejected", 
    icon: XCircle, 
    color: "text-red-400 bg-red-400/10 border-red-400/30" 
  },
};

// --- Helpers ---
const generateTimeline = (status: string, appliedAt: string) => {
  // const timeline = [
  //   { event: "Application Submitted", status: "completed" as const }
  // ];

  const levels = ["APPLIED", "SCREENING", "AIINTERVIEWED", "SHORTLISTED", "FINAL_INTERVIEW", "OFFER"];
  const currentIdx = levels.indexOf(status);

  type TimelineStatus = "completed" | "current" | "pending";
  type TimelineItem = {
  event: string;
  status: TimelineStatus;
};

const timeline: TimelineItem[] = [];

  if (currentIdx >= 1) {
    timeline.push({ 
      event: "Resume Screening Passed", 
      status: "completed" as const 
    });
  }
  
  if (currentIdx >= 2) {
    timeline.push({ 
      event: "AI Interview Completed", 
      status: "completed" as const 
    });
  }
  
  if (currentIdx >= 3) {
    timeline.push({ 
      event: "Shortlisted by Recruiter", 
      status: "completed" as const 
    });
  }
  
  if (currentIdx >= 4) {
    timeline.push({ 
      event: "Final Interview Scheduled", 
      status: "current" as const 
    });
  }
  
  if (currentIdx >= 5) {
    timeline.push({ 
      event: "Offer Received!", 
      status: "current" as const 
    });
  }

  if (status === "REJECTED") {
    timeline.push({ 
      event: "Application Not Selected", 
      status: "current" as const 
    });
  }

  return timeline;
};

const parseSkills = (skillsStr: string): string[] => {
  if (!skillsStr) return [];
  // Handle comma-separated or newline-separated skills
  return skillsStr
    .split(/[,\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .slice(0, 8); // Limit to 8 skills for display
};

const AppliedJobs = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<JobUI[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobUI | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Fetch Real Data ---
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/applications/my-applications");
      
      if (Array.isArray(response.data)) {
        const mappedApps: JobUI[] = response.data.map((app: BackendApplication) => ({
          id: app.id.toString(),
          appId: app.id,
          company: app.job.recruiter?.name || "Tech Company",
          role: app.job.title,
          location: app.job.location || "Remote",
          salary: app.job.salaryRange || "Not Disclosed",
          appliedDate: new Date(app.appliedAt).toLocaleDateString(),
          status: app.status,
          matchScore: app.matchScore || 0,
          logo: `https://api.dicebear.com/7.x/initials/svg?seed=${app.job.recruiter?.name || app.job.title}`,
          description: app.job.description,
          skills: parseSkills(app.job.requiredSkills),
          experienceLevel: app.job.experienceLevel || "",
          timeline: generateTimeline(app.status, app.appliedAt),
          aiFeedback: app.aiFeedback,
          aiVerdict: app.aiVerdict,
          interviewScore: app.interviewScore,
          interviewSummary: app.interviewSummary,
          keyObservation: app.keyObservation,
          redFlags: app.redFlags,
        }));
        
        setApplications(mappedApps);
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Could not load applications. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Filter Applications ---
  const filteredJobs = applications.filter((job) => {
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesSearch =
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // --- Stats ---
  const stats = {
    total: applications.length,
    pending: applications.filter(a => ["APPLIED", "SCREENING"].includes(a.status)).length,
    interview: applications.filter(a => ["AIINTERVIEWED", "SHORTLISTED", "FINAL_INTERVIEW"].includes(a.status)).length,
    offers: applications.filter(a => a.status === "OFFER").length,
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            Applied Jobs
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your job applications
          </p>
        </div>
        
        {/* Stats Pills */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Briefcase className="w-3 h-3" />
            {stats.total} Total
          </Badge>
          <Badge variant="outline" className="gap-1 border-blue-400/30 text-blue-400">
            <Clock className="w-3 h-3" />
            {stats.pending} Pending
          </Badge>
          <Badge variant="outline" className="gap-1 border-purple-400/30 text-purple-400">
            <Calendar className="w-3 h-3" />
            {stats.interview} Interview
          </Badge>
          <Badge variant="outline" className="gap-1 border-green-400/30 text-green-400">
            <CheckCircle2 className="w-3 h-3" />
            {stats.offers} Offers
          </Badge>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-4 border border-border/30"
      >
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search companies, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/20 border-border/30"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-muted/20 border-border/30">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="SCREENING">Screening</SelectItem>
              <SelectItem value="AIINTERVIEWED">AI Interview</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="FINAL_INTERVIEW">Interview</SelectItem>
              <SelectItem value="OFFER">Offer</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl border-border/50 bg-muted/5">
          <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <h3 className="text-lg font-semibold">No applications found</h3>
          <p className="text-muted-foreground">
            {statusFilter !== "all" 
              ? "Try changing the filter or search criteria" 
              : "Start applying to jobs to see them here!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJobs.map((job, index) => {
            const statusInfo = statusConfig[job.status] || statusConfig.APPLIED;
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => setSelectedJob(job)}
                className={cn(
                  "glass-card rounded-2xl p-5 border border-border/30 cursor-pointer group transition-all duration-300",
                  selectedJob?.id === job.id && "border-accent/50 ring-1 ring-accent/20"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <div className="w-14 h-14 rounded-xl bg-muted/30 border border-border/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-10 h-10"
                    />
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {job.role}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground truncate">
                            {job.company}
                          </span>
                        </div>
                      </div>

                      {/* Match Score */}
                      {job.matchScore > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/30 flex-shrink-0">
                          <TrendingUp className="w-3 h-3 text-accent" />
                          <span className="text-xs font-medium text-accent">
                            {job.matchScore}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      {job.salary && job.salary !== "Not Disclosed" && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <DollarSign className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{job.salary}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 gap-2">
                      {/* Status Badge */}
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
                          statusInfo.color
                        )}
                      >
                        <StatusIcon className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{statusInfo.label}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">{job.appliedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Job Detail Panel */}
      <AnimatePresence>
        {selectedJob && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-0 right-0 h-screen w-full md:w-[500px] glass-card border-l border-border/30 z-[100] overflow-y-auto pt-20"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-muted/30 border border-border/30 flex items-center justify-center">
                      <img
                        src={selectedJob.logo}
                        alt={selectedJob.company}
                        className="w-12 h-12"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground">
                        {selectedJob.role}
                      </h2>
                      <p className="text-muted-foreground">{selectedJob.company}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Match Score */}
                {selectedJob.matchScore > 0 && (
                  <div className="glass-card rounded-xl p-4 border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Resume Match Score
                      </span>
                      <span className="text-2xl font-display font-bold text-gradient">
                        {selectedJob.matchScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted/30 rounded-full mt-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedJob.matchScore}%` }}
                        className="h-full bg-gradient-to-r from-accent to-destructive rounded-full"
                      />
                    </div>
                    
                    {selectedJob.aiVerdict && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <p className="text-xs text-muted-foreground mb-1">AI Verdict</p>
                        <Badge 
                          variant={selectedJob.aiVerdict === "PASSED" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {selectedJob.aiVerdict}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Feedback */}
                {selectedJob.aiFeedback && (
                  <div className="mb-6 glass-card rounded-xl p-4 border border-blue-400/30 bg-blue-400/5">
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-400" />
                      AI Insights
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedJob.aiFeedback}
                    </p>
                  </div>
                )}

                {/* Job Details */}
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      About the Role
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Experience Level */}
                  {selectedJob.experienceLevel && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">
                        Experience Required
                      </h3>
                      <Badge variant="outline" className="bg-muted/30 border-border/30">
                        {selectedJob.experienceLevel}
                      </Badge>
                    </div>
                  )}

                  {/* Required Skills */}
                  {selectedJob.skills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-muted/30 border-border/30"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Application Timeline */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4">
                      Application Timeline
                    </h3>
                    <div className="relative pl-4 border-l-2 border-border/30 space-y-4">
                      {selectedJob.timeline.map((event, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          <div 
                            className={cn(
                              "absolute -left-[21px] w-3 h-3 rounded-full border-2 border-background",
                              event.status === "completed" 
                                ? "bg-accent" 
                                : event.status === "current" 
                                ? "bg-blue-500 animate-pulse" 
                                : "bg-muted"
                            )} 
                          />
                          <p className={cn(
                            "text-sm font-medium", 
                            event.status === "current" ? "text-primary" : "text-foreground"
                          )}>
                            {event.event}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-border/30">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setSelectedJob(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppliedJobs;