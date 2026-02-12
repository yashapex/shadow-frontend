import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Loader2,
  Building2,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axiosconfig";

// --- Types ---
interface LiveInterviewDetails {
  id: number;
  scheduledAt: string;
  meetingLink: string;
  status: string;
}

interface InterviewApplication {
  id: number;
  status: string;
  job: {
    id: number;
    title: string;
    recruiter: {
      name: string;
      email: string;
    };
    location?: string;
  };
  liveInterview?: LiveInterviewDetails;
}

const CandidateLiveInterview = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<InterviewApplication[]>([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      // Fetch all applications
      const response = await api.get("/applications/my-applications");
      
      if (Array.isArray(response.data)) {
        // Filter for applications that are in 'FINAL_INTERVIEW' stage or have a live interview object attached
        const scheduled = response.data.filter(
          (app: InterviewApplication) => 
            app.status === "FINAL_INTERVIEW" || (app.liveInterview && app.liveInterview.id)
        );
        setInterviews(scheduled);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load scheduled interviews.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = (link: string) => {
    if (!link) return;
    window.open(link, '_blank');
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-foreground">Live Interviews</h1>
        <p className="text-muted-foreground mt-1">
          View and join your upcoming video interviews with recruiters.
        </p>
      </motion.div>

      {interviews.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-2xl border-border/50 bg-muted/5"
        >
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No Interviews Scheduled</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            You don't have any live interviews scheduled at the moment. Keep applying and checking your status!
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((app, index) => {
            const interviewDate = app.liveInterview 
              ? new Date(app.liveInterview.scheduledAt) 
              : null;
              
            const isToday = interviewDate && new Date().toDateString() === interviewDate.toDateString();

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-border/30 h-full flex flex-col hover:border-accent/30 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={isToday ? "default" : "outline"} className={isToday ? "bg-accent text-white" : "border-accent/30 text-accent"}>
                        {isToday ? "Today" : "Upcoming"}
                      </Badge>
                      <Badge variant="secondary" className="bg-muted/50">
                        {app.liveInterview?.status || "Scheduled"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold truncate" title={app.job.title}>
                      {app.job.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {app.job.recruiter?.name || "Tech Company"}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex-1">
                    {app.liveInterview ? (
                      <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/30">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-accent" />
                          <span className="font-medium">
                            {interviewDate?.toLocaleDateString(undefined, { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="font-medium">
                            {interviewDate?.toLocaleTimeString(undefined, { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Video className="w-4 h-4 text-accent" />
                          <span className="text-muted-foreground">Google Meet</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3 text-sm text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>Interview is being scheduled. Check back soon for details.</p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button 
                      variant="hero" 
                      className="w-full gap-2"
                      onClick={() => handleJoinMeeting(app.liveInterview?.meetingLink || "")}
                      disabled={!app.liveInterview?.meetingLink}
                    >
                      <Video className="w-4 h-4" />
                      {app.liveInterview?.meetingLink ? "Join Interview" : "Waiting for Link"}
                      {app.liveInterview?.meetingLink && <ExternalLink className="w-3 h-3 ml-1 opacity-70" />}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateLiveInterview;