import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  ArrowRight,
  Calendar,
  Star,
  Clock,
  PlayCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await api.get("/applications/recruiter/all");
      
      // ⚡ FIX: Include ALL applications that have a Live Interview scheduled
      // (Even if they don't have insights/results yet)
      const validApps = response.data
        .filter((app: any) => app.liveInterview != null) // Must be scheduled
        .map((app: any) => {
          
          const insights = app.liveInterview.aiInsights 
            ? JSON.parse(app.liveInterview.aiInsights) 
            : null;

          return {
            id: app.id,
            candidateName: app.candidate.name,
            jobTitle: app.job.title,
            date: app.liveInterview.scheduledAt,
            score: insights?.suggestedRating || null,
            summary: insights?.executiveSummary || "Pending Interview Completion...",
            hasInsights: !!insights
          };
        });
        
      setResults(validApps);
    } catch (error) {
      console.error("Failed to fetch results", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(r => 
    r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Reports</h1>
          <p className="text-muted-foreground">Manage transcripts and view AI insights.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search candidates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredResults.map((result) => (
          <Card key={result.id} className={cn(
            "hover:shadow-md transition-shadow border-l-4",
            result.hasInsights ? "border-l-green-500" : "border-l-amber-500"
          )}>
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
              
              {/* Candidate Info */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <Avatar className="h-12 w-12 border">
                  <AvatarFallback className={cn("font-bold", result.hasInsights ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                    {result.candidateName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{result.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{result.jobTitle}</p>
                </div>
              </div>

              {/* Status & Stats */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                 <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase mb-1">Scheduled Date</span>
                    <span className="text-sm font-medium flex items-center gap-2">
                       <Calendar className="w-3 h-3 text-muted-foreground" /> 
                       {new Date(result.date).toLocaleDateString()}
                    </span>
                 </div>
                 
                 <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase mb-1">AI Score</span>
                    {result.score !== null ? (
                        <div className="flex items-center gap-2">
                           <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                           <span className={cn("font-bold", result.score >= 70 ? 'text-green-600' : 'text-amber-600')}>
                             {result.score}/100
                           </span>
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground italic">--</span>
                    )}
                 </div>

                 <div className="hidden md:flex flex-col justify-center">
                    {result.hasInsights ? (
                        <Badge variant="outline" className="w-fit bg-green-50 text-green-700 border-green-200 gap-1">
                           <FileText className="w-3 h-3" /> Report Ready
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="w-fit bg-amber-50 text-amber-700 border-amber-200 gap-1">
                           <Clock className="w-3 h-3" /> Pending Input
                        </Badge>
                    )}
                 </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full md:w-auto">
                 {result.hasInsights ? (
                     <Button 
                       className="flex-1 md:flex-none gap-2 bg-white text-foreground border hover:bg-muted/50"
                       variant="outline"
                       onClick={() => navigate(`/recruiter/interview/${result.id}/audit`)}
                     >
                       View Report <ArrowRight className="w-4 h-4" />
                     </Button>
                 ) : (
                     <Button 
                       className="flex-1 md:flex-none gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                       onClick={() => navigate(`/recruiter/interview/${result.id}/audit`)}
                     >
                       <PlayCircle className="w-4 h-4" /> Generate Report
                     </Button>
                 )}
              </div>

            </CardContent>
          </Card>
        ))}

        {filteredResults.length === 0 && !loading && (
          <div className="text-center p-12 border-2 border-dashed rounded-xl bg-muted/5">
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