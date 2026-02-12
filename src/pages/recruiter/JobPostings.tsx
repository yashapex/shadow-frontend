import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye, MapPin, Upload, X, Loader2, FileText, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axiosconfig";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// 1. Update Interface to include the full text field
interface Job {
  id: number;
  title: string;
  location: string;
  salaryRange: string;
  experienceLevel: string;
  requiredSkills: string; 
  interviewType: string;
  description: string;       // Short description
  fullTextFromPdf?: string;  // <--- RAW CONTENT from DB
  status?: string; 
  hasPdf?: boolean; // We added this helper in the entity
  applicants?: number; 
  createdAt?: string;
}

const JobPostings = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // 2. New State for the View Modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salaryRange: "",
    experienceLevel: "",
    requiredSkills: "",
    interviewType: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch Jobs
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/jobs/my-jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast({ title: "Error", description: "Failed to load job postings.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreateJob = async () => {
    if (!formData.title || !formData.location) {
      toast({ title: "Validation Error", description: "Title and Location are required.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));
      if (selectedFile) payload.append("file", selectedFile);

      await axiosInstance.post("/jobs", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "Success", description: "Job posted successfully!" });
      setShowCreateForm(false);
      setFormData({
        title: "",
        location: "",
        salaryRange: "",
        experienceLevel: "",
        requiredSkills: "",
        interviewType: "",
        description: "",
      });
      setSelectedFile(null);
      fetchJobs();

    } catch (error) {
      console.error("Create job failed:", error);
      toast({ title: "Error", description: "Failed to create job posting.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if(!confirm("Are you sure you want to delete this job?")) return;
    try {
        await axiosInstance.delete(`/jobs/${id}`);
        setJobs(prev => prev.filter(j => j.id !== id));
        toast({ title: "Deleted", description: "Job removed." });
    } catch (error) {
        toast({ title: "Error", description: "Could not delete job.", variant: "destructive" });
    }
  }

  const filtered = jobs.filter((j) => j.title.toLowerCase().includes(search.toLowerCase()));

  // Add this function inside the component
  const handleViewPdf = async (job: Job) => {
    try {
      // 1. Fetch the file securely using your axios instance (sends the token)
      const response = await axiosInstance.get(`/jobs/${job.id}/file`, {
        responseType: 'blob', // ⚡ Important: Tell axios this is a file, not JSON
      });

      // 2. Create a temporary URL for the file
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);

      // 3. Open that URL in a new tab
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error("Download failed", error);
      toast({
        title: "Error",
        description: "Could not open the PDF file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Job Postings</h1>
          <p className="text-muted-foreground mt-1">Manage and create job listings</p>
        </div>
        <Button variant="hero" onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
          {showCreateForm ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4" />}
          {showCreateForm ? "Cancel" : "Create Job"}
        </Button>
      </div>

      {/* ... (Create Form Code remains the same) ... */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-card rounded-2xl p-6 border border-border/30 space-y-6 mb-6"
        >
          {/* Paste your existing form JSX here if you need to re-copy it, 
              otherwise just keep the existing form code. */}
           <div className="flex justify-between items-center">
             <h3 className="font-display text-lg font-bold text-foreground">New Job Posting</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Job Title</label>
              <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior Frontend Developer" className="bg-muted/20 border-border/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Location</label>
              <Input name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Remote" className="bg-muted/20 border-border/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Salary Range</label>
              <Input name="salaryRange" value={formData.salaryRange} onChange={handleInputChange} placeholder="e.g. $120K-$160K" className="bg-muted/20 border-border/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Experience Level</label>
              <Input name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} placeholder="e.g. 5+ years" className="bg-muted/20 border-border/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Required Skills</label>
              <Input name="requiredSkills" value={formData.requiredSkills} onChange={handleInputChange} placeholder="e.g. React, TypeScript" className="bg-muted/20 border-border/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Interview Type</label>
              <Input name="interviewType" value={formData.interviewType} onChange={handleInputChange} placeholder="e.g. AI + Panel" className="bg-muted/20 border-border/30" />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Short Description</label>
            <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
                className="w-full h-24 rounded-xl bg-muted/20 border border-border/30 p-3 text-sm text-foreground resize-none focus:border-accent/50 focus:outline-none" 
                placeholder="Brief summary of the role..." 
            />
          </div>

          <div className="border-2 border-dashed border-border/40 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/5 transition-colors">
            <input 
                type="file" 
                id="jd-upload" 
                className="hidden" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
            />
            <label htmlFor="jd-upload" className="cursor-pointer flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                    <Upload className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm font-medium text-foreground">Upload Full Job Description (PDF)</p>
                <p className="text-xs text-muted-foreground mt-1">
                    {selectedFile ? selectedFile.name : "Our AI will parse requirements from this file"}
                </p>
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="glass" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleCreateJob} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Publish Job
            </Button>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/20 border-border/30" />
      </div>

      {/* Jobs Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl border border-border/30 overflow-hidden">
        {isLoading ? (
             <div className="p-12 flex justify-center text-muted-foreground">
                 <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading jobs...
             </div>
        ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
                No jobs found.
            </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="border-b border-border/30 bg-muted/5">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Job Title</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Location</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Salary</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Applicants</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((job, i) => (
                    <motion.tr
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/20 hover:bg-muted/10 transition-colors"
                    >
                    <td className="p-4">
                        <div>
                        <p className="font-medium text-foreground text-sm">{job.title}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                            {job.requiredSkills.split(',').slice(0, 3).map((s) => (
                            <Badge key={s} variant="outline" className="text-xs border-border/30 text-muted-foreground">{s.trim()}</Badge>
                            ))}
                        </div>
                        </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">{job.location}</td>
                    <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">{job.salaryRange}</td>
                    <td className="p-4 text-sm font-medium text-foreground">{job.applicants || 0}</td>
                    <td className="p-4">
                        <div className="flex gap-2">
                        {/* 3. Updated "Eye" Button */}
                        <button 
                          className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors" 
                          onClick={() => setSelectedJob(job)}
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"><Edit className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" onClick={() => handleDeleteJob(job.id)}><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </motion.div>

      {/* 4. New Dialog for Viewing Details */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">{selectedJob?.title}</DialogTitle>
            <DialogDescription>
              {selectedJob?.location} • {selectedJob?.salaryRange}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[50vh] mt-4 pr-4">
  <div className="space-y-6">
    {/* Short Description */}
    <div>
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-primary" />
        Role Summary
      </h4>
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {selectedJob?.description}
      </p>
    </div>

    {/* ⚡ NEW: PDF View Button */}
    {selectedJob?.hasPdf ? (
      <div className="bg-muted/30 p-4 rounded-xl border border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Original Job Description</p>
            <p className="text-xs text-muted-foreground">PDF Document</p>
          </div>
        </div>
        
        <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={() => handleViewPdf(selectedJob)} // <--- NEW: Uses the secure handler
        >
        <Eye className="w-4 h-4" />
        View PDF
      </Button>
      </div>
    ) : (
      <div className="text-xs text-muted-foreground italic">
        No PDF was uploaded for this job.
      </div>
    )}
  </div>
</ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPostings;