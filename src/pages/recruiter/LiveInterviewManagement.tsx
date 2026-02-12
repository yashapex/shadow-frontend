import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  ShieldAlert,
  Users,
  Search,
  Filter,
  CheckCircle2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/lib/axiosconfig";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- Types ---
interface LiveInterview {
  id: number;
  scheduledAt: string;
  meetingLink: string;
  status: string;
}

interface JobApplication {
  id: number;
  status: string;
  interviewScore: number;
  liveInterview?: LiveInterview;
  job: {
    id: number;
    title: string;
  };
  candidate: {
    id: number;
    name: string;
    username: string;
  };
}

const LiveInterviewManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Scheduling State
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [meetLink, setMeetLink] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.get("/applications/recruiter/all");
      if (Array.isArray(response.data)) {
        // ⚡ Filter only Shortlisted or Scheduled candidates
        const validStatuses = ["SHORTLISTED", "FINAL_INTERVIEW"];
        const filtered = response.data.filter((app: JobApplication) => validStatuses.includes(app.status));
        setApplications(filtered);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load candidates." });
    } finally {
      setLoading(false);
    }
  };

  const openScheduleDialog = (app: JobApplication) => {
    setSelectedApp(app);
    setIsScheduleOpen(true);
  };

  const handleGenerateGoogleLink = () => {
    if (!scheduleDate || !scheduleTime || !selectedApp) return;
    const startDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); 
    const formatGoogleDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = encodeURIComponent(`Interview: ${selectedApp.candidate.name} - ${selectedApp.job.title}`);
    const details = encodeURIComponent(`Live Interview.\nCandidate: ${selectedApp.candidate.name}\nJob: ${selectedApp.job.title}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${details}&location=Google%20Meet`;
    window.open(url, '_blank');
  };

  const handleScheduleSubmit = async () => {
    if (!selectedApp || !scheduleDate || !scheduleTime || !meetLink) return;
    try {
      await api.post(`/applications/${selectedApp.id}/schedule`, {
        interviewDate: `${scheduleDate}T${scheduleTime}:00`,
        interviewLink: meetLink
      });
      toast({ title: "Success", description: "Interview scheduled successfully." });
      setIsScheduleOpen(false);
      fetchCandidates();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to schedule." });
    }
  };

  const filteredApps = applications.filter(app => 
    app.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Interviews</h1>
          <p className="text-muted-foreground">Schedule and manage Google Meet interviews for shortlisted candidates.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search candidates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <Card key={app.id} className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border"><AvatarFallback>{app.candidate.name[0]}</AvatarFallback></Avatar>
                  <div>
                    <CardTitle className="text-base">{app.candidate.name}</CardTitle>
                    <CardDescription className="text-xs">{app.job.title}</CardDescription>
                  </div>
                </div>
                {app.status === 'FINAL_INTERVIEW' ? 
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">Scheduled</Badge> : 
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Shortlisted</Badge>
                }
              </div>
            </CardHeader>
            <CardContent>
              {app.status === 'FINAL_INTERVIEW' && app.liveInterview ? (
                <div className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-lg text-sm space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(app.liveInterview.scheduledAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(app.liveInterview.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-xs gap-1" onClick={() => window.open(app.liveInterview!.meetingLink, '_blank')}>
                      <Video className="w-3 h-3" /> Join Meet
                    </Button>
                    {/* <Button 
                      className="flex-1 text-xs gap-1 bg-purple-600 hover:bg-purple-700" 
                      onClick={() => {
                        // ⚡ FIX: Add this safety check
                        if (app && app.id) {
                            navigate(`/recruiter/interview/${app.id}/audit`);
                        } else {
                            console.error("Missing ID for app:", app);
                            toast({ variant: "destructive", title: "Navigation Error", description: "Application ID is missing." });
                        }
                      }}
                    >
                      <ShieldAlert className="w-3 h-3" /> Audit
                    </Button> */}
                    <Button 
                      variant="secondary"
                      className="flex-1 text-xs gap-1"
                      disabled={true}
                    >
                      <CalendarIcon className="w-3 h-3" /> Scheduled
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <p className="text-xs text-muted-foreground text-center">Ready for interview scheduling.</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => openScheduleDialog(app)}>
                    <CalendarIcon className="w-4 h-4" /> Schedule Interview
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredApps.length === 0 && (
          <div className="col-span-full text-center p-12 border-2 border-dashed rounded-xl bg-muted/10">
            <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No shortlisted candidates found.</p>
          </div>
        )}
      </div>

      {/* Scheduling Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Schedule Interview</DialogTitle><DialogDescription>Set up a Google Meet.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>Time</Label><Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} /></div>
            </div>
            <Button variant="secondary" onClick={handleGenerateGoogleLink} disabled={!scheduleDate || !scheduleTime}><CalendarIcon className="w-4 h-4 mr-2" /> Open Google Calendar</Button>
            <div className="space-y-2"><Label>Paste Meet Link</Label><Input placeholder="https://meet.google.com/..." value={meetLink} onChange={(e) => setMeetLink(e.target.value)} /></div>
          </div>
          <DialogFooter><Button onClick={handleScheduleSubmit} disabled={!meetLink}>Confirm Schedule</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveInterviewManagement;