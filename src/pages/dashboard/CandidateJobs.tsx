import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Search,
  Eye,
  FileText,
  Building2,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axiosconfig";

// Interface matching your Backend Job Entity
interface Job {
  id: number;
  title: string;
  location: string;
  salaryRange: string;
  experienceLevel: string;
  requiredSkills: string;
  interviewType: string;
  description: string;
  hasPdf: boolean; // Computed helper from backend
  applicants?: number;
  createdAt?: string;
  recruiter?: {
    name: string;
    companyName?: string;
  };
}

const CandidateJobs = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // 1. Fetch All Jobs on Load
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/jobs/all"); // Hits the public endpoint
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load job listings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // 2. Handle PDF View
  const handleViewPdf = async (job: Job) => {
    try {
      const response = await api.get(`/jobs/${job.id}/file`, {
        responseType: 'blob',
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not open the PDF file.",
        variant: "destructive",
      });
    }
  };

  // 3. ⚡ REAL ONE-CLICK APPLY LOGIC
  const handleApply = async (jobId: number) => {
    setIsApplying(true);
    try {
      // Calls the new endpoint: POST /api/applications/{jobId}/apply
      await api.post(`/applications/${jobId}/apply`);

      toast({
        title: "Application Submitted!",
        description: "Your profile has been sent to the recruiter. AI Analysis in progress...",
        className: "bg-green-600 text-white border-none",
      });

      setSelectedJob(null); // Close modal
    } catch (error: any) {
      console.error("Apply failed", error);
      const msg = error.response?.data || "Failed to apply.";
      
      toast({
        title: "Application Failed",
        description: msg,
        variant: "destructive",
      });

      // If it's a resume error, maybe guide them to profile settings?
      if (typeof msg === 'string' && msg.toLowerCase().includes("resume")) {
         // You could add navigation here: window.location.href = "/dashboard/profile";
      }
    } finally {
      setIsApplying(false);
    }
  };

  // Filter Logic
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Explore Jobs
          </h1>
          <p className="text-muted-foreground mt-1">
            One-click apply to top tech roles.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by role or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/20 border-border/30"
          />
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground bg-muted/10 rounded-2xl border border-border/30">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-2xl p-6 border border-border/30 hover:border-accent/30 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </div>
                  </div>
                </div>
                {job.hasPdf && (
                  <div className="p-2 bg-muted/20 rounded-full" title="PDF Description Available">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.requiredSkills.split(",").slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-muted/30">
                    {skill.trim()}
                  </Badge>
                ))}
                {job.requiredSkills.split(",").length > 3 && (
                  <Badge variant="outline" className="text-muted-foreground">
                    +{job.requiredSkills.split(",").length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
                <div className="text-sm font-medium text-foreground">
                  {job.salaryRange}
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col glass-card border-border/50">
          <DialogHeader>
            <div className="flex justify-between items-start pr-4">
              <div>
                <DialogTitle className="text-2xl font-display font-bold">
                  {selectedJob?.title}
                </DialogTitle>
                <DialogDescription className="mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {selectedJob?.recruiter?.companyName || "Hiring Company"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedJob?.location}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4 mt-4 -mr-4">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Salary Range</p>
                  <p className="font-medium text-foreground">{selectedJob?.salaryRange || "Not Disclosed"}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Experience</p>
                  <p className="font-medium text-foreground">{selectedJob?.experienceLevel || "Not Specified"}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold mb-2">About the Role</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedJob?.description}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob?.requiredSkills.split(",").map((s) => (
                    <Badge key={s} variant="outline" className="border-accent/30 text-accent bg-accent/5">
                      {s.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* PDF Document Section */}
              {selectedJob?.hasPdf && (
                <div className="bg-muted/30 p-4 rounded-xl border border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Full Job Description</p>
                      <p className="text-xs text-muted-foreground">Original PDF Document</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 text-accent hover:text-accent hover:bg-accent/10"
                    onClick={() => selectedJob && handleViewPdf(selectedJob)}
                  >
                    <Eye className="w-4 h-4" /> View PDF
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="pt-4 mt-2 border-t border-border/30 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setSelectedJob(null)}>
              Cancel
            </Button>
            {/* ⚡ THE BUTTON THAT TRIGGERS APPLY */}
            <Button 
              variant="hero" 
              className="flex-1" 
              disabled={isApplying}
              onClick={() => selectedJob && handleApply(selectedJob.id)}
            >
              {isApplying ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Applying...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> One-Click Apply</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateJobs;