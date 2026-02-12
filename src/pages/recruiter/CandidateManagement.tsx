import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  Clock,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axiosconfig";

// Interface matching the Backend Entity
interface JobApplication {
  id: number;
  candidate: {
    id: number;
    name: string;
    username: string; // email
  };
  job: {
    id: number;
    title: string;
  };
  status: string;      
  matchScore: number;  
  aiFeedback: string; 
  aiVerdict?: "ACCEPTED" | "REJECTED"; 
  appliedAt: string;
  resumeFileName?: string;
}

const CandidateManagement = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // 1. Fetch All Applications
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/applications/recruiter/all");
      setCandidates(response.data);
    } catch (error) {
      console.error("Failed to fetch applications", error);
      toast({
        title: "Error",
        description: "Failed to load candidate applications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Secure Resume Download
  const handleDownloadResume = async (e: React.MouseEvent, appId: number, fileName?: string) => {
    e.stopPropagation();
    setIsDownloading(true);

    try {
      const response = await api.get(`/applications/${appId}/resume`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const downloadName = fileName || `resume_${appId}.pdf`;
      link.setAttribute('download', downloadName);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({ title: "Download Started", description: "Resume is downloading..." });

    } catch (error) {
      console.error("Download failed", error);
      toast({
        title: "Download Failed",
        description: "Could not download resume.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper: Get Badge
  const getVerdictBadge = (verdict?: string) => {
    switch (verdict) {
      case "ACCEPTED": 
        return <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> AI Accepted</Badge>;
      case "REJECTED": 
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> AI Rejected</Badge>;
      default: 
        return null;
    }
  };

  // Helper: Colors
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // 3. Filter Logic
  const filteredCandidates = candidates.filter(app => {
    const matchesSearch = 
      app.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      statusFilter === "ALL" || 
      (statusFilter === "ACCEPTED" && app.aiVerdict === "ACCEPTED") ||
      (statusFilter === "REJECTED" && app.aiVerdict === "REJECTED");

    return matchesSearch && matchesFilter;
  });

  // ⚡ FIX: CUSTOM SORTING LOGIC
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    
    // Priority 1: AI Verdict (ACCEPTED at the top)
    const isAcceptedA = a.aiVerdict === 'ACCEPTED';
    const isAcceptedB = b.aiVerdict === 'ACCEPTED';

    if (isAcceptedA && !isAcceptedB) return -1; // A comes first
    if (!isAcceptedA && isAcceptedB) return 1;  // B comes first

    // Priority 2: Status Hierarchy
    // Order: FINAL_INTERVIEW > SHORTLISTED > AIINTERVIEWED > SCREENING
    const getStatusWeight = (status: string) => {
        switch (status) {
            case "FINAL_INTERVIEW": return 4;
            case "SHORTLISTED": return 3;
            case "AIINTERVIEWED": return 2;
            case "SCREENING": return 1;
            default: return 0; // APPLIED, REJECTED, etc.
        }
    };

    const statusA = getStatusWeight(a.status);
    const statusB = getStatusWeight(b.status);

    if (statusA !== statusB) {
        return statusB - statusA; // Higher weight first
    }

    // Priority 3: Match Score (Highest first) as a final tie-breaker
    return b.matchScore - a.matchScore;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Candidate Management</h1>
          <p className="text-muted-foreground mt-1">Review AI-ranked applications.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search candidates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/20 border-border/30"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2">
        <Button 
          variant={statusFilter === "ALL" ? "default" : "outline"} 
          size="sm" onClick={() => setStatusFilter("ALL")}
        >
          All
        </Button>
        <Button 
          variant={statusFilter === "ACCEPTED" ? "default" : "outline"} 
          size="sm" onClick={() => setStatusFilter("ACCEPTED")}
          className={statusFilter === "ACCEPTED" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Accepted
        </Button>
        <Button 
          variant={statusFilter === "REJECTED" ? "default" : "outline"} 
          size="sm" onClick={() => setStatusFilter("REJECTED")}
          className={statusFilter === "REJECTED" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          Rejected
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
      ) : sortedCandidates.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground border border-dashed border-border/30 rounded-2xl">
          No applications found matching criteria.
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-border/30 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-border/30 bg-muted/10 font-medium text-sm text-muted-foreground">
            <div className="col-span-4">Candidate</div>
            <div className="col-span-3">Role Applied</div>
            <div className="col-span-2">Match Score</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right"></div>
          </div>

          {/* List */}
          <div className="divide-y divide-border/30">
            {sortedCandidates.map((app) => (
              <div key={app.id} className="group transition-colors hover:bg-muted/5">
                <div 
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center cursor-pointer"
                  onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                >
                  {/* Candidate */}
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border/50">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.candidate.name}`} />
                      <AvatarFallback>{app.candidate.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{app.candidate.name}</h4>
                      <p className="text-xs text-muted-foreground">{app.candidate.username}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-3">
                    <p className="text-sm font-medium">{app.job.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Score & Verdict */}
                  <div className="col-span-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${getScoreColor(app.matchScore)}`}>
                          {app.matchScore}%
                        </span>
                        {getVerdictBadge(app.aiVerdict)}
                      </div>
                      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(app.matchScore)} transition-all`}
                          style={{ width: `${app.matchScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <Badge variant={app.status === 'APPLIED' ? 'secondary' : app.status === 'SHORTLISTED' ? 'default' : 'destructive'}>
                      {app.status}
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className="col-span-1 flex justify-end">
                    <Button variant="ghost" size="icon">
                      {expandedId === app.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId === app.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-muted/5 px-4 pb-4 md:px-14"
                    >
                      <div className="p-4 rounded-xl border border-border/30 bg-background/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h5 className="text-sm font-semibold flex items-center gap-2 text-primary">
                            <BrainCircuit className="w-4 h-4" /> 
                            Resume Analysis
                          </h5>
                          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/20 p-4 rounded-lg border border-border/50">
                            {app.aiFeedback ? (
                                app.aiFeedback
                            ) : (
                                <span className="italic opacity-70 flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" /> 
                                    Analysis pending or not available for this candidate.
                                </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4 flex flex-col justify-center">
                          <div className="bg-background p-4 rounded-lg border border-border/50 text-center">
                              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Resume File</p>
                              <div className="flex items-center justify-center gap-2 mb-3">
                                <FileText className="w-8 h-8 text-primary/50" />
                                <span className="text-sm font-medium">{app.resumeFileName || "resume.pdf"}</span>
                              </div>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                disabled={isDownloading}
                                onClick={(e) => handleDownloadResume(e, app.id, app.resumeFileName)}
                              >
                                {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                Download PDF
                              </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;