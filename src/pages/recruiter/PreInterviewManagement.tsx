import { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Users,
  Search,
  FileText,
  AlertTriangle,
  Clock,
  User as UserIcon,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Filter,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/axiosconfig";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- Types ---
interface InterviewAnalysis {
  id: number;
  question: string;
  candidateAnswer: string;
  technicalScore: number;
  communicationScore: number;
  aiFeedback: string;
}

interface JobApplication {
  id: number;
  status: string; // 'SCREENING', 'AIINTERVIEWED', 'SHORTLISTED', 'REJECTED'
  interviewScore: number;
  interviewSummary: string;
  keyObservation: string;
  redFlags: string;
  interviewAnalyses: InterviewAnalysis[];
  appliedAt: string;
  interviewVerdict?: string;
  job: {
    id: number;
    title: string;
    description: string;
  };
  candidate: {
    id: number;
    name: string;
    username: string;
  };
}

interface JobGroup {
  id: number;
  title: string;
  applications: JobApplication[];
}

const InterviewManagement = () => {
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State to control which Job Accordion is open
  const [openJobId, setOpenJobId] = useState<string | undefined>(undefined);

  // --- Data Fetching ---
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/applications/recruiter/all");
      if (Array.isArray(response.data)) {
        setApplications(response.data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch interviews." });
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Metrics ---
  const uniqueCandidateCount = useMemo(() => {
    // Exclude resume-rejected candidates from the count
    const validApps = applications.filter(app => app.status !== 'REJECTED' && app.status !== 'APPLIED');
    const uniqueIds = new Set(validApps.map(app => app.candidate?.id).filter(id => id !== undefined));
    return uniqueIds.size;
  }, [applications]);

  // --- Action: Update Status (Shortlist/Reject) ---
  const handleDecision = async (status: 'SHORTLISTED' | 'REJECTED') => {
    if (!selectedAppId) return;
    
    try {
      // Calls the new PATCH endpoint
      await api.patch(`/applications/${selectedAppId}/status`, null, {
        params: { status }
      });
  
      toast({ 
        title: status === 'SHORTLISTED' ? "Candidate Shortlisted" : "Candidate Rejected",
        description: `Application status updated successfully.`,
        variant: status === 'SHORTLISTED' ? "default" : "destructive"
      });
  
      // Refresh list to show new badge
      fetchApplications();
    } catch (error) {
      console.error("Status update failed:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  // --- Data Processing: Group by Job & Filter ---
  const jobGroups = useMemo(() => {
    const groups = new Map<number, JobGroup>();
    
    // 1. Filter applications
    const relevantApps = (applications || []).filter(app => {
      // Hide candidates rejected by Resume Screen (keep those rejected after interview)
      if (app.status === 'REJECTED' && !app.interviewScore) return false;
      if (app.status === 'APPLIED') return false;

      // Search Filter
      const name = (app.candidate?.name || "").toLowerCase();
      const jobTitle = (app.job?.title || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      
      return name.includes(query) || jobTitle.includes(query);
    });

    // 2. Group by Job
    relevantApps.forEach(app => {
      if (!app.job) return;
      
      if (!groups.has(app.job.id)) {
        groups.set(app.job.id, {
          id: app.job.id,
          title: app.job.title,
          applications: []
        });
      }
      groups.get(app.job.id)?.applications.push(app);
    });

    return Array.from(groups.values());
  }, [applications, searchQuery]);

  // --- Auto-Selection Logic ---
  useEffect(() => {
    if (jobGroups.length === 1 && !openJobId) {
      setOpenJobId(jobGroups[0].id.toString());
    }
  }, [jobGroups, openJobId]);

  const selectedApp = applications.find(app => app.id === selectedAppId);

  // Helper for Status Badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AIINTERVIEWED':
        return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] h-4 px-1 shadow-none">Review Ready</Badge>;
      case 'SHORTLISTED':
        return <Badge variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] h-4 px-1 shadow-none">Shortlisted</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 text-[10px] h-4 px-1 shadow-none">Rejected</Badge>;
      case 'SCREENING':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] h-4 px-1 shadow-none">Pending</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] h-4 px-1">{status}</Badge>;
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4 animate-in fade-in duration-500">
      
      {/* Header Metrics */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interview Intelligence</h1>
          <p className="text-muted-foreground text-sm">Review AI-conducted interviews.</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-full border">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="font-semibold">{jobGroups.length}</span> Active Jobs
          </div>
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-full border">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-semibold">{uniqueCandidateCount}</span> Candidates
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6 h-full min-h-0">
        
        {/* LEFT COLUMN: Jobs & Candidates (Merged) */}
        <Card className="col-span-12 lg:col-span-4 flex flex-col h-full border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="p-4 space-y-3 bg-muted/10 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Jobs & Applicants
              </CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Filter by candidate or job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-background"
              />
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              <Accordion 
                type="single" 
                collapsible 
                value={openJobId} 
                onValueChange={setOpenJobId}
                className="space-y-2"
              >
                {jobGroups.map((group) => (
                  <AccordionItem key={group.id} value={group.id.toString()} className="border rounded-lg bg-background px-0 overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 w-full text-left">
                         <div className="p-2 bg-primary/10 rounded-md">
                           <Briefcase className="w-4 h-4 text-primary" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="font-semibold text-sm truncate">{group.title}</div>
                           <div className="text-xs text-muted-foreground">{group.applications.length} Candidates</div>
                         </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-0 border-t bg-muted/5">
                      <div className="divide-y border-b">
                        {group.applications.map((app) => (
                          <button
                            key={app.id}
                            onClick={() => setSelectedAppId(app.id)}
                            className={cn(
                              "w-full text-left p-3 pl-12 transition-all flex items-center gap-3 hover:bg-muted/80",
                              selectedAppId === app.id ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                            )}
                          >
                             <Avatar className="h-8 w-8 border">
                                <AvatarFallback className="text-[10px] bg-background text-foreground font-bold">
                                  {app.candidate?.name
                                    ? app.candidate.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                                    : "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={cn("text-sm font-medium truncate", selectedAppId === app.id && "text-primary")}>
                                    {app.candidate?.name || `Candidate #${app.candidate?.id}`}
                                  </span>
                                  {app.interviewScore !== null && (
                                     <span className={cn("text-xs font-bold", app.interviewScore >= 70 ? "text-green-600" : "text-red-500")}>
                                       {app.interviewScore}%
                                     </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {getStatusBadge(app.status)}
                                  <span className="text-[10px] text-muted-foreground">ID: {app.id}</span>
                                </div>
                              </div>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {jobGroups.length === 0 && (
                <div className="p-8 text-center">
                  <Filter className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No jobs or candidates match your filter.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* RIGHT COLUMN: Interview Details (Wide) */}
        <Card className="col-span-12 lg:col-span-8 flex flex-col h-full border-border/50 shadow-sm overflow-hidden bg-muted/5">
          {selectedApp ? (
            selectedApp.status !== "SCREENING" ? (
              <>
                <CardHeader className="p-6 border-b bg-background sticky top-0 z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Avatar className="h-12 w-12 border shadow-sm">
                            <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
                                {selectedApp.candidate?.name
                                ? selectedApp.candidate.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                                : "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                {selectedApp.candidate?.name || "Unknown"}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 text-xs">
                                <UserIcon className="w-3 h-3" /> Candidate ID: {selectedApp.candidate?.id}
                                <span className="text-muted-foreground/30">•</span>
                                <Clock className="w-3 h-3" /> {selectedApp.appliedAt ? new Date(selectedApp.appliedAt).toLocaleDateString() : "N/A"}
                            </CardDescription>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                         <Badge variant={selectedApp.interviewVerdict === 'ACCEPTED' ? 'default' : 'destructive'} className="px-3 py-1 text-xs uppercase tracking-wide">
                            {selectedApp.interviewVerdict === 'ACCEPTED' ? 'AI Recommended' : 'Not Recommended'}
                          </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {/* Score Box */}
                      <div className="text-center bg-background p-3 px-5 rounded-xl border shadow-sm">
                          <div className={cn("text-4xl font-black", selectedApp.interviewScore >= 70 ? "text-green-600" : "text-red-600")}>
                            {selectedApp.interviewScore}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">AI Score</div>
                      </div>

                      {/* Decision Buttons */}
                      {selectedApp.status === 'AIINTERVIEWED' && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                            <Button 
                                size="sm" 
                                variant="outline"
                                className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive h-8 text-xs gap-1"
                                onClick={() => handleDecision('REJECTED')}
                            >
                                <XCircle className="w-3 h-3" /> Reject
                            </Button>
                            <Button 
                                size="sm" 
                                className="bg-primary hover:bg-primary/90 h-8 text-xs gap-1"
                                onClick={() => handleDecision('SHORTLISTED')}
                            >
                                <CheckCircle2 className="w-3 h-3" /> Shortlist Candidate
                            </Button>
                        </div>
                      )}
                      {selectedApp.status === 'SHORTLISTED' && (
                          <div className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                             <CheckCircle2 className="w-3 h-3" /> Shortlisted
                          </div>
                      )}
                      {selectedApp.status === 'REJECTED' && (
                          <div className="text-xs font-bold text-destructive flex items-center gap-1 bg-destructive/10 px-3 py-1 rounded-full">
                             <XCircle className="w-3 h-3" /> Rejected
                          </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <ScrollArea className="flex-1">
                  <div className="p-6 max-w-5xl mx-auto space-y-8">
                    
                    {/* Insights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Left: Summary */}
                       <div className="space-y-3">
                          <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <FileText className="w-4 h-4 text-primary" /> Executive Summary
                          </h3>
                          <div className="bg-background p-5 rounded-xl border text-sm leading-relaxed text-muted-foreground shadow-sm h-full">
                            {selectedApp.interviewSummary}
                          </div>
                       </div>

                       {/* Right: Critical Alerts */}
                       <div className="space-y-4">
                          {selectedApp.redFlags ? (
                            <Alert variant="destructive" className="bg-red-50 border-red-200">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <AlertTitle className="text-red-800 font-bold">Red Flags Detected</AlertTitle>
                              <AlertDescription className="text-xs mt-1 text-red-700/90 leading-relaxed">
                                {selectedApp.redFlags}
                              </AlertDescription>
                            </Alert>
                          ) : (
                             <Alert className="bg-green-50 border-green-200">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <AlertTitle className="text-green-800 font-bold">Clean Check</AlertTitle>
                              <AlertDescription className="text-xs mt-1 text-green-700/90">
                                No critical red flags were detected during the AI analysis.
                              </AlertDescription>
                            </Alert>
                          )}

                          {selectedApp.keyObservation && (
                            <Alert className="bg-blue-50 border-blue-200">
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                              <AlertTitle className="text-blue-800 font-bold">Key Observations</AlertTitle>
                              <AlertDescription className="text-xs mt-1 text-blue-700/90 leading-relaxed">
                                {selectedApp.keyObservation}
                              </AlertDescription>
                            </Alert>
                          )}
                       </div>
                    </div>

                    <Separator />

                    {/* Detailed Transcript */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <MessageSquare className="w-5 h-5 text-primary" /> 
                            Transcript Analysis
                        </h3>
                        <Badge variant="outline" className="font-normal text-muted-foreground">
                            {selectedApp.interviewAnalyses?.length || 0} Questions
                        </Badge>
                      </div>

                      <Accordion type="single" collapsible className="w-full space-y-3">
                        {selectedApp.interviewAnalyses?.map((analysis, index) => (
                          <AccordionItem 
                            key={analysis.id || index} 
                            value={`item-${index}`}
                            className="border rounded-xl bg-background px-2 shadow-sm overflow-hidden"
                          >
                            <AccordionTrigger className="hover:no-underline px-4 py-4">
                              <div className="flex flex-col items-start gap-1.5 text-left w-full pr-4">
                                <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                  <span className="bg-muted px-1.5 py-0.5 rounded">Q{index + 1}</span>
                                </span>
                                <span className="text-base font-medium text-foreground">{analysis.question}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-0 pb-6 px-4">
                              <div className="pl-4 border-l-2 border-primary/20 space-y-5 mt-2">
                                
                                {/* Candidate Answer */}
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Candidate Answer</p>
                                    <div className="bg-muted/30 p-4 rounded-r-xl rounded-bl-xl text-sm leading-relaxed text-foreground/90 italic">
                                    "{analysis.candidateAnswer}"
                                    </div>
                                </div>
                                
                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-6 bg-muted/10 p-4 rounded-lg border border-dashed">
                                  <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium">
                                      <span>Technical Accuracy</span>
                                      <span className={cn("font-bold", analysis.technicalScore > 7 ? "text-green-600" : "text-amber-600")}>{analysis.technicalScore}/10</span>
                                    </div>
                                    <Progress value={analysis.technicalScore * 10} className="h-2" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium">
                                      <span>Communication</span>
                                      <span className={cn("font-bold", analysis.communicationScore > 7 ? "text-green-600" : "text-amber-600")}>{analysis.communicationScore}/10</span>
                                    </div>
                                    <Progress value={analysis.communicationScore * 10} className="h-2" />
                                  </div>
                                </div>

                                {analysis.aiFeedback && (
                                  <div className="text-xs bg-primary/5 p-4 rounded-lg text-primary/80 border border-primary/10 flex gap-2 items-start">
                                    <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block mb-0.5">AI Feedback</span>
                                        {analysis.aiFeedback}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>

                      {(!selectedApp.interviewAnalyses || selectedApp.interviewAnalyses.length === 0) && (
                        <div className="flex flex-col items-center justify-center p-12 text-sm text-muted-foreground bg-muted/5 border border-dashed rounded-xl">
                          <FileText className="w-8 h-8 mb-3 opacity-20" />
                          No transcript data available for this session.
                        </div>
                      )}
                    </div>

                  </div>
                </ScrollArea>
              </>
            ) : (
              // Empty State: Pending
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/5">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6 shadow-sm border border-amber-100">
                  <Clock className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Interview Pending</h3>
                <p className="text-muted-foreground max-w-md mt-3 leading-relaxed">
                  <span className="font-medium text-foreground">{selectedApp.candidate?.name}</span> has not yet completed the AI interview. 
                  Once submitted, the AI analysis, transcript, and scores will appear here automatically.
                </p>
              </div>
            )
          ) : (
            // Empty State: No Selection
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-muted/50 to-background flex items-center justify-center mb-6 shadow-inner border">
                <Briefcase className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold">Ready to Review</h3>
              <p className="text-muted-foreground max-w-sm mt-2 text-sm">
                Select a job from the sidebar to view applicants, then click a candidate to reveal their AI interview insights.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InterviewManagement;