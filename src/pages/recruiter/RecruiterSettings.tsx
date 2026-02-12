import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, User, Building, MapPin, Briefcase, LinkIcon, RefreshCw, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosconfig";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  position: z.string().min(2, "Position is required"),
  department: z.string().min(2, "Department is required"),
  companyName: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  avatarUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function RecruiterSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", email: "", position: "", department: "", companyName: "", location: "", avatarUrl: "" },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/profile/recruiter");
        const data = response.data;
        form.reset({
          fullName: data.fullName || "", email: data.email || "", position: data.position || "",
          department: data.department || "", companyName: data.companyName || "", location: data.location || "",
          avatarUrl: data.avatarUrl || "",
        });
      } catch {
        toast({ title: "Error", description: "Failed to load profile settings.", variant: "destructive" });
      } finally { setIsLoading(false); }
    };
    fetchProfile();
  }, [form, toast]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      await axiosInstance.put("/profile/recruiter", data);
      toast({ title: "Profile updated", description: "Your recruiter profile has been successfully updated." });
    } catch {
      toast({ title: "Update failed", description: "There was a problem saving your changes.", variant: "destructive" });
    } finally { setIsSaving(false); }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" }); return; }
    if (file.size > 2 * 1024 * 1024) { toast({ title: "File too large", description: "Image must be smaller than 2MB.", variant: "destructive" }); return; }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/profile/upload-avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
      form.setValue("avatarUrl", response.data, { shouldDirty: true });
      toast({ title: "Success", description: "Profile picture uploaded successfully." });
    } catch {
      toast({ title: "Upload Failed", description: "Could not upload image.", variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and professional profile.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="glass-card rounded-2xl p-6 border border-border/30 space-y-6">
            <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-accent" /> Personal Information
            </h3>

            {/* Avatar */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24 border-4 border-accent/30">
                <AvatarImage src={form.watch("avatarUrl") || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.watch("fullName")}`} className="object-cover" />
                <AvatarFallback className="bg-accent/10 text-accent text-xl font-bold">RP</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">Profile Picture</h4>
                  <p className="text-xs text-muted-foreground">Upload a custom photo.</p>
                </div>
                <div className="flex gap-2 items-center">
                  <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <Button type="button" variant="outline" className="border-border/30" onClick={() => document.getElementById("avatar-upload")?.click()}>
                    <Upload className="h-4 w-4 mr-2" /> Upload Photo
                  </Button>
                  {form.watch("avatarUrl") && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => form.setValue("avatarUrl", "", { shouldDirty: true })}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
                <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                  <FormItem><FormControl>
                    <div className="relative"><LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9 bg-muted/20 border-border/30" placeholder="Or paste an image URL..." {...field} /></div>
                  </FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl>
                  <div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9 bg-muted/20 border-border/30" placeholder="John Doe" {...field} /></div>
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input disabled className="bg-muted/20 border-border/30 opacity-60" {...field} /></FormControl>
                <FormDescription className="text-xs">Email cannot be changed directly.</FormDescription><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          {/* Professional Details */}
          <div className="glass-card rounded-2xl p-6 border border-border/30 space-y-6">
            <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" /> Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem><FormLabel>Company Name</FormLabel><FormControl>
                  <div className="relative"><Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9 bg-muted/20 border-border/30" placeholder="Acme Inc." {...field} /></div>
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="position" render={({ field }) => (
                <FormItem><FormLabel>Job Title</FormLabel><FormControl>
                  <div className="relative"><Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9 bg-muted/20 border-border/30" placeholder="Senior Recruiter" {...field} /></div>
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="department" render={({ field }) => (
                <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="Human Resources" className="bg-muted/20 border-border/30" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Location</FormLabel><FormControl>
                  <div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9 bg-muted/20 border-border/30" placeholder="New York, NY" {...field} /></div>
                </FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" className="border-border/30" onClick={() => form.reset()}>Discard Changes</Button>
            <Button variant="hero" type="submit" disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
