import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Plus,
  X,
  Edit2,
  Save,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Upload,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axiosconfig";

// ⚡ UPDATED: Matches Backend DTO exactly
interface CandidateProfile {
  userId?: number;
  name: string;        // backend sends 'name'
  username: string;    // backend sends 'username' (email)
  jobTitle: string;
  phone: string;
  location: string;
  bio: string;
  skills: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  avatarUrl?: string;  // backend now sends this
  resumeLastUpdated?: string;
}

const ProfileSettings = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file upload
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [profile, setProfile] = useState<CandidateProfile>({
    name: "",
    username: "",
    jobTitle: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    avatarUrl: "",
  });

  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/profile/candidate");
      const data = response.data;
      setProfile(data);
      
      if (data.skills && data.skills.trim() !== "") {
        setUserSkills(data.skills.split(",").map((s: string) => s.trim()));
      } else {
        setUserSkills([]);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
      toast({ title: "Error", description: "Failed to load profile data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload: CandidateProfile = {
        ...profile,
        skills: userSkills.join(","), // Convert array back to CSV
      };
      await api.put("/profile/candidate", payload);
      toast({ title: "Success", description: "Profile updated successfully" });
      setIsEditing(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // ⚡ NEW: Handle Avatar Upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      // Upload to backend
      const response = await api.post("/profile/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newAvatarUrl = response.data; // Backend returns the URL string
      
      // Update local state immediately
      setProfile((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
      
      // Optionally save the profile immediately to persist the URL link
      // await api.put("/profile/candidate", { ...profile, avatarUrl: newAvatarUrl, skills: userSkills.join(",") });

      toast({ title: "Success", description: "Profile photo updated!" });
    } catch (error) {
      console.error("Upload failed", error);
      toast({ title: "Error", description: "Failed to upload photo", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  // ⚡ NEW: Handle Resume Upload
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      // We pass "RESUME" so the backend knows how to process/vectorize it
      formData.append("docType", "RESUME"); 

      // ⚠️ Verify this endpoint matches your IngestionController
      await api.post("/profile/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "Success", description: "Resume uploaded and processed successfully!" });
      
      // Refresh profile to update the "Last Updated" date if your backend updates it
      fetchProfile(); 
    } catch (error) {
      console.error("Resume upload failed", error);
      toast({ title: "Error", description: "Failed to upload resume", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  // ... (Skill handlers remain same) ...
  const handleAddSkill = () => {
    if (newSkill && !userSkills.includes(newSkill)) {
      setUserSkills([...userSkills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setUserSkills(userSkills.filter((s) => s !== skill));
  };

  // Calculate completion
  const calculateCompletion = () => {
    let filledFields = 0;
    const totalFields = 8; 
    if (profile.name) filledFields++;
    if (profile.jobTitle) filledFields++;
    if (profile.phone) filledFields++;
    if (profile.location) filledFields++;
    if (profile.bio) filledFields++;
    if (userSkills.length > 0) filledFields++;
    if (profile.linkedinUrl) filledFields++;
    if (profile.avatarUrl) filledFields++;
    return Math.round((filledFields / totalFields) * 100);
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your candidate profile</p>
        </div>
        <Button variant={isEditing ? "hero" : "outline"} onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
        </Button>
      </motion.div>

      {/* Completion Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 border border-accent/30 bg-gradient-to-r from-accent/10 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="font-display font-semibold text-foreground">Profile Completion</h3><p className="text-sm text-muted-foreground">Complete your profile to stand out</p></div>
          <span className="text-3xl font-display font-bold text-gradient">{calculateCompletion()}%</span>
        </div>
        <Progress value={calculateCompletion()} className="h-3" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
          
          {/* Basic Info */}
          <div className="glass-card rounded-2xl p-6 border border-border/30">
            <h3 className="text-lg font-display font-semibold text-foreground mb-6 flex items-center gap-2"><User className="w-5 h-5 text-accent" /> Basic Information</h3>

            <div className="flex items-start gap-6 mb-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-accent/30">
                  <AvatarImage src={profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
                  <AvatarFallback>{profile.name?.substring(0, 2).toUpperCase() || "ME"}</AvatarFallback>
                </Avatar>
                
                {/* Upload Button */}
                {isEditing && (
                  <>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/80 transition-colors"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </button>
                  </>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                    {isEditing ? <Input value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-muted/20 border-border/30" /> : <p className="text-foreground font-medium">{profile.name || "Not set"}</p>}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Job Title</label>
                    {isEditing ? <Input value={profile.jobTitle || ""} onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })} className="bg-muted/20 border-border/30" /> : <p className="text-foreground font-medium">{profile.jobTitle || "Not set"}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
                <p className="text-foreground text-sm opacity-70 cursor-not-allowed">{profile.username}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</label>
                {isEditing ? <Input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="bg-muted/20 border-border/30" /> : <p className="text-foreground text-sm">{profile.phone || "Not set"}</p>}
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</label>
                {isEditing ? <Input value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="bg-muted/20 border-border/30" /> : <p className="text-foreground text-sm">{profile.location || "Not set"}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm text-muted-foreground mb-1 block">Bio</label>
              {isEditing ? <Textarea value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="bg-muted/20 border-border/30" rows={4} /> : <p className="text-foreground text-sm leading-relaxed">{profile.bio || "No bio added yet."}</p>}
            </div>
          </div>

          {/* Skills Section */}
          <div className="glass-card rounded-2xl p-6 border border-border/30">
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {userSkills.length > 0 ? (
                userSkills.map((skill, idx) => (
                  <motion.div key={`${skill}-${idx}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="group relative">
                    <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 pr-6">
                      {skill}
                      {isEditing && <button onClick={() => handleRemoveSkill(skill)} className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent/30 flex items-center justify-center hover:bg-accent/50"><X className="w-3 h-3" /></button>}
                    </Badge>
                  </motion.div>
                ))
              ) : <p className="text-sm text-muted-foreground italic">No skills added yet.</p>}
            </div>
            {isEditing && <div className="flex gap-2"><Input placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleAddSkill()} className="bg-muted/20 border-border/30" /><Button variant="outline" onClick={handleAddSkill}><Plus className="w-4 h-4" /></Button></div>}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border/30">
            <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-accent" /> Resume</h3>
            <div className="p-4 rounded-xl border-2 border-dashed border-border/50 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">{profile.name?.split(" ")[0] || "User"}_Resume.pdf</p>
              <p className="text-xs text-muted-foreground mb-4">Last updated: {profile.resumeLastUpdated ? new Date(profile.resumeLastUpdated).toLocaleDateString() : "Never"}</p>
              {/* ⚡ NEW: Hidden Input */}
              <input 
                type="file" 
                ref={resumeInputRef} 
                className="hidden" 
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />

              {/* ⚡ UPDATED: Button triggers the input */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                disabled={isUploading}
                onClick={() => resumeInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isUploading ? "Uploading..." : "Update Resume"}
              </Button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border/30">
            <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2"><LinkIcon className="w-5 h-5 text-accent" /> Links</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Github className="w-3 h-3" /> GitHub</label>
                {isEditing ? <Input value={profile.githubUrl || ""} onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })} className="bg-muted/20 border-border/30" /> : <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-foreground text-sm hover:underline block truncate">{profile.githubUrl || "Not set"}</a>}
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Linkedin className="w-3 h-3" /> LinkedIn</label>
                {isEditing ? <Input value={profile.linkedinUrl || ""} onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })} className="bg-muted/20 border-border/30" /> : <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-foreground text-sm hover:underline block truncate">{profile.linkedinUrl || "Not set"}</a>}
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Globe className="w-3 h-3" /> Portfolio</label>
                {isEditing ? <Input value={profile.portfolioUrl || ""} onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })} className="bg-muted/20 border-border/30" /> : <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="text-foreground text-sm hover:underline block truncate">{profile.portfolioUrl || "Not set"}</a>}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings;