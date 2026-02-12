import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/lib/axiosconfig";
import { useToast } from "@/hooks/use-toast";

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
  job: { id: number; title: string };
  candidate: { id: number; name: string; username: string };
}

const LiveInterviewManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [meetLink, setMeetLink] = useState("");

  useEffect(() => { fetchCandidates(); }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.get("/applications/recruiter/all");
      if (Array.isArray(response.data)) {
        const validStatuses = ["SHORTLISTED", "FINAL_INTERVIEW"];
        setApplications(response.data.filter((app: JobApplication) => validStatuses.includes(app.status)));
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to load candidates." });
    } finally { setLoading(false); }
  };

  const openScheduleDialog = (app: JobApplication) => { setSelectedApp(app); setIsScheduleOpen(true); };

  const handleGenerateGoogleLink = () => {
    if (!scheduleDate || !scheduleTime || !selectedApp) return;
    const startDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    const formatGoogleDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = encodeURIComponent(`Interview: ${selectedApp.candidate.name} - ${selectedApp.job.title}`);
    const details = encodeURIComponent(`Live Interview.\nCandidate: ${selectedApp.candidate.name}\nJob: ${selectedApp.job.title}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${details}&location=Google%20Meet`, '_blank');
  };

  const handleScheduleSubmit = async () => {
    if (!selectedApp || !scheduleDate || !scheduleTime || !meetLink) return;
    try {
      await api.post(`/applications/${selectedApp.id}/schedule`, {
        interviewDate: `${scheduleDate}T${scheduleTime}:00`,
        interviewLink: meetLink,
      });
      toast({ title: "Success", description: "Interview scheduled successfully." });
      setIsScheduleOpen(false);
      fetchCandidates();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to schedule." });
    }
  };

  const filteredApps = applications.filter(app =>
    app.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Live Interviews</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage Google Meet interviews for shortlisted candidates.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search candidates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-muted/20 border-border/30" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div key={app.id} className="glass-card rounded-2xl p-6 border border-border/30 hover:border-accent/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border/50">
                  <AvatarFallback className="bg-accent/10 text-accent font-bold">{app.candidate.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{app.candidate.name}</h3>
                  <p className="text-xs text-muted-foreground">{app.job.title}</p>
                </div>
              </div>
              {app.status === 'FINAL_INTERVIEW' ?
                <Badge className="bg-accent/10 text-accent border-accent/30">Scheduled</Badge> :
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Shortlisted</Badge>
              }
            </div>

            {app.status === 'FINAL_INTERVIEW' && app.liveInterview ? (
              <div className="space-y-4">
                <div className="bg-muted/20 p-3 rounded-xl text-sm space-y-2 border border-border/20">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(app.liveInterview.scheduledAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(app.liveInterview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 text-xs gap-1 border-border/30" onClick={() => window.open(app.liveInterview!.meetingLink, '_blank')}>
                    <Video className="w-3 h-3" /> Join Meet
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs gap-1 border-border/30" disabled>
                    <CalendarIcon className="w-3 h-3" /> Scheduled
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <p className="text-xs text-muted-foreground text-center">Ready for interview scheduling.</p>
                <Button variant="hero" className="w-full gap-2" onClick={() => openScheduleDialog(app)}>
                  <CalendarIcon className="w-4 h-4" /> Schedule Interview
                </Button>
              </div>
            )}
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="col-span-full text-center p-12 border-2 border-dashed rounded-2xl border-border/50 bg-muted/5">
            <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No shortlisted candidates found.</p>
          </div>
        )}
      </div>

      {/* Scheduling Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-[425px] glass-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display">Schedule Interview</DialogTitle>
            <DialogDescription>Set up a Google Meet session.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-muted/20 border-border/30" /></div>
              <div className="space-y-2"><Label>Time</Label><Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-muted/20 border-border/30" /></div>
            </div>
            <Button variant="outline" onClick={handleGenerateGoogleLink} disabled={!scheduleDate || !scheduleTime} className="border-border/30">
              <CalendarIcon className="w-4 h-4 mr-2" /> Open Google Calendar
            </Button>
            <div className="space-y-2"><Label>Paste Meet Link</Label><Input placeholder="https://meet.google.com/..." value={meetLink} onChange={(e) => setMeetLink(e.target.value)} className="bg-muted/20 border-border/30" /></div>
          </div>
          <DialogFooter><Button variant="hero" onClick={handleScheduleSubmit} disabled={!meetLink}>Confirm Schedule</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveInterviewManagement;
