import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, User, Building, MapPin, Briefcase, LinkIcon, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosconfig";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Schema matching your RecruiterProfileDTO
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
    defaultValues: {
      fullName: "",
      email: "",
      position: "",
      department: "",
      companyName: "",
      location: "",
      avatarUrl: "",
    },
  });

  // 1. Fetch Profile Data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // FIX: Removed '/api' prefix because axiosconfig already includes it
        const response = await axiosInstance.get("/profile/recruiter");
        const data = response.data;
        
        form.reset({
          fullName: data.fullName || "",
          email: data.email || "",
          position: data.position || "",
          department: data.department || "",
          companyName: data.companyName || "",
          location: data.location || "",
          avatarUrl: data.avatarUrl || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [form, toast]);

  // 2. Handle Submit (Update Profile)
  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      // FIX: Removed '/api' prefix here as well
      await axiosInstance.put("/profile/recruiter", data);
      
      toast({
        title: "Profile updated",
        description: "Your recruiter profile has been successfully updated.",
      });
      
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem saving your changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPG, PNG).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (e.g., max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true); // Re-use your loading state or make a specific one
      
      // Upload to the new endpoint
      // Note: We use 'Content-Type': 'multipart/form-data' automatically with FormData
      const response = await axiosInstance.post("/profile/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // The backend returns the full URL string directly
      const newAvatarUrl = response.data;
      
      // Update the form field immediately
      form.setValue("avatarUrl", newAvatarUrl, { shouldDirty: true });
      
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully.",
      });

    } catch (error) {
      console.error("Upload failed", error);
      toast({
        title: "Upload Failed",
        description: "Could not upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  function generateRandomAvatar(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and professional profile.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* --- Personal Information Card --- */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your identification details visible to candidates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Avatar Section */}
<div className="flex flex-col md:flex-row gap-6 items-start">
  <Avatar className="h-24 w-24 border-2 border-border shadow-sm">
    <AvatarImage 
      src={form.watch("avatarUrl") || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.watch("fullName")}`} 
      className="object-cover"
    />
    <AvatarFallback>RP</AvatarFallback>
  </Avatar>
  
  <div className="flex-1 space-y-4 w-full">
    <div className="space-y-1">
      <h3 className="font-medium">Profile Picture</h3>
      <p className="text-xs text-muted-foreground">
        Upload a custom photo or generate a random avatar.
      </p>
    </div>

    <div className="flex gap-2 items-center">
       {/* Hidden File Input */}
       <input
        type="file"
        id="avatar-upload"
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
      
      {/* Upload Button triggers the input */}
      <Button 
        type="button" 
        variant="secondary"
        onClick={() => document.getElementById("avatar-upload")?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Photo
      </Button>

      <Button 
        type="button" 
        variant="outline" 
        onClick={generateRandomAvatar}
        title="Generate Random Avatar"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Randomize
      </Button>

      {/* Optional: Clear Button if they want to remove the custom URL */}
      {form.watch("avatarUrl") && (
         <Button
           type="button"
           variant="ghost"
           size="icon"
           onClick={() => form.setValue("avatarUrl", "", { shouldDirty: true })}
           title="Remove photo"
         >
           <X className="h-4 w-4 text-muted-foreground" />
         </Button>
      )}
    </div>
    
    {/* Keep the URL input as a fallback option */}
    <FormField
      control={form.control}
      name="avatarUrl"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Or paste an image URL..." {...field} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="John Doe" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input disabled className="bg-muted" {...field} />
                        </FormControl>
                        <FormDescription>
                          Email cannot be changed directly. Contact support.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* --- Professional Details Card --- */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>
                  Information about your role and company.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="Acme Inc." {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title / Position</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="Senior Recruiter" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Human Resources" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="New York, NY" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Discard Changes
              </Button>
              <Button variant="hero" type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}