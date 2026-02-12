import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Dashboard imports
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import AppliedJobs from "./pages/dashboard/AppliedJobs";
import MockInterview from "./pages/dashboard/PreInterview";
import InterviewHistory from "./pages/dashboard/InterviewHistory";
import SkillAnalysis from "./pages/dashboard/SkillAnalysis";
import ProfileSettings from "./pages/dashboard/ProfileSettings";
import CandidateJobs from "./pages/dashboard/CandidateJobs";
import CandidateLiveInterview from "./pages/dashboard/CandidateLiveInterview"; // Import added

// Recruiter imports
import { RecruiterLayout } from "./components/recruiter/RecruiterLayout";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import JobPostings from "./pages/recruiter/JobPostings";
import CandidateManagement from "./pages/recruiter/CandidateManagement";
import InterviewManagement from "./pages/recruiter/PreInterviewManagement";
import BiasAnalytics from "./pages/recruiter/BiasAnalytics";
import Reports from "./pages/recruiter/Reports";
import RecruiterSettings from "./pages/recruiter/RecruiterSettings";
import LiveInterviewManagement from "./pages/recruiter/LiveInterviewManagement";
import LiveInterviewPage from "./pages/recruiter/LiveInterviewPage";
import InterviewResults from "./pages/recruiter/InterviewResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Dashboard Routes - Candidate Only */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="CANDIDATE">
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardHome />} />
                <Route path="jobs" element={<CandidateJobs />} />
                <Route path="applications" element={<AppliedJobs />} />
                <Route path="interview" element={<MockInterview />} />
                <Route path="live-interviews" element={<CandidateLiveInterview />} /> {/* New Route */}
                <Route path="history" element={<InterviewHistory />} />
                <Route path="skills" element={<SkillAnalysis />} />
                <Route path="profile" element={<ProfileSettings />} />
              </Route>
              
              {/* Recruiter Routes - Recruiter Only */}
              <Route path="/recruiter" element={
                <ProtectedRoute requiredRole="RECRUITER">
                  <RecruiterLayout />
                </ProtectedRoute>
              }>
                <Route index element={<RecruiterDashboard />} />
                <Route path="jobs" element={<JobPostings />} />
                <Route path="candidates" element={<CandidateManagement />} />
                <Route path="interviews" element={<InterviewManagement />} />
                
                {/* ⚡ FIX: Moved LiveInterviewPage here to be Protected & Layout-wrapped */}
                <Route path="live-interviews" element={<LiveInterviewManagement />} />
                <Route path="results" element={<InterviewResults />} />
                <Route path="interview/:applicationId/audit" element={<LiveInterviewPage />} />
                <Route path="bias" element={<BiasAnalytics />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<RecruiterSettings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;