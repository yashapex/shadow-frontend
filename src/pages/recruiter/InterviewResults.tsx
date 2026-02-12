import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  ArrowRight,
  Calendar,
  Star,
  Clock,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/axiosconfig";
import { cn } from "@/lib/utils";

interface InterviewResult {
  id: number;
  candidateName: string;
  jobTitle: string;
  date: string;
  score: number | null;
  summary: string;
  hasInsights: boolean;
}

const InterviewResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchResults(); }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await api.get("/applications/recruiter/all");
      const validApps = response.data
        .filter((app: any) => app.liveInterview != null)
        .map((app: any) => {
          const insights = app.liveInterview.aiInsights ? JSON.parse(app.liveInterview.aiInsights) : null;
          return {
            id: app.id,
            candidateName: app.candidate.name,
            jobTitle: app.job.title,
            date: app.liveInterview.scheduledAt,
            score: insights?.suggestedRating || null,
            summary: insights?.executiveSummary || "Pending Interview Completion...",
            hasInsights: !!insights,
          };
        });
      setResults(validApps);
    } catch (error) {
      console.error("Failed to fetch results", error);
    } finally { setLoading(false); }
  };

  const filteredResults = results.filter(r =>
    r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Results & Reports</h1>
          <p className="text-muted-foreground mt-1">Manage transcripts and view AI insights.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search candidates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-muted/20 border-border/30" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredResults.map((result) => (
          <div
            key={result.id}
            className={cn(
              "glass-card rounded-2xl p-6 border transition-all duration-300 hover:border-accent/30",
              result.hasInsights ? "border-emerald-500/30" : "border-amber-500/30"
            )}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Candidate Info */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <Avatar className="h-12 w-12 border border-border/50">
                  <AvatarFallback className={cn(
                    "font-bold",
                    result.hasInsights ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  )}>
                    {result.candidateName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{result.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{result.jobTitle}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase mb-1">Scheduled Date</span>
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    {new Date(result.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase mb-1">AI Score</span>
                  {result.score !== null ? (
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className={cn("font-bold", result.score >= 70 ? 'text-emerald-400' : 'text-amber-400')}>
                        {result.score}/100
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">--</span>
                  )}
                </div>
                <div className="hidden md:flex flex-col justify-center">
                  {result.hasInsights ? (
                    <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1">
                      <FileText className="w-3 h-3" /> Report Ready
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="w-fit bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1">
                      <Clock className="w-3 h-3" /> Pending Input
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full md:w-auto">
                {result.hasInsights ? (
                  <Button variant="outline" className="flex-1 md:flex-none gap-2 border-border/30" onClick={() => navigate(`/recruiter/interview/${result.id}/audit`)}>
                    View Report <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="hero" className="flex-1 md:flex-none gap-2" onClick={() => navigate(`/recruiter/interview/${result.id}/audit`)}>
                    <PlayCircle className="w-4 h-4" /> Generate Report
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredResults.length === 0 && (
          <div className="text-center p-12 border-2 border-dashed rounded-2xl border-border/50 bg-muted/5">
            <FileText className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No scheduled interviews found.</p>
            <p className="text-xs text-muted-foreground mt-1">Go to "Live Interviews" to schedule one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewResults;
