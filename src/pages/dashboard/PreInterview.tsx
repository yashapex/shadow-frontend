import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  CheckCircle,
  Loader2,
  Maximize,
  AlertTriangle,
  ShieldAlert,
  Timer,
  FileCheck,
  Clock,
  Ban,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axiosconfig";

// --- Types ---
interface JobApplication {
  id: number;
  jobTitle: string;
  companyName: string;
  status: string;
  appliedDate: string;
}

interface InterviewQuestion {
  id: number;
  text: string;
}

// --- Speech Recognition Setup ---
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const PreInterview = () => {
  const { toast } = useToast();
  
  const [stage, setStage] = useState<'list' | 'setup' | 'interview' | 'completed'>('list');
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); 
  const [isProcessing, setIsProcessing] = useState(false);

  const [warningCount, setWarningCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const MAX_WARNINGS = 3;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 1. Initial Load
  useEffect(() => {
    fetchApplications();
    return () => stopMediaTracks();
  }, []);

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  // ⚡ FETCH WITH CACHE BUSTING
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/applications/my-applications?t=${Date.now()}`);
      
      const visibleApps = response.data
        .filter((app: any) => 
            ['SCREENING', 'AIINTERVIEWED', 'SHORTLISTED', 'REJECTED', 'INTERVIEWED', 'OFFER'].includes(app.status)
        )
        .map((app: any) => ({
            id: app.id,
            jobTitle: app.job.title,
            companyName: app.job.recruiter?.companyName || "Hiring Company",
            status: app.status,
            appliedDate: app.appliedAt
        }));

      console.log("Fetched Apps:", visibleApps);
      setApplications(visibleApps);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({ variant: "destructive", title: "Connection Error", description: "Could not refresh application list." });
    } finally {
      setLoading(false);
    }
  };

  // ⚡ ROBUST RETURN HANDLER
  const handleReturnToDashboard = async () => {
    stopMediaTracks();
    setSelectedApp(null);
    setQuestions([]);
    setStage('list');
    await fetchApplications();
  };

  // --- Auto-Start & Recording Logic ---
  useEffect(() => {
    if (stage === 'interview' && questions.length > 0) {
      startQuestionSession();
    }
  }, [stage, currentQuestionIndex, questions]);

  const startQuestionSession = () => {
    setIsProcessing(false);
    setTimeLeft(120);
    setTranscript(""); 
    setIsRecording(true);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
            handleNextQuestion();
            return 0;
        }
        return prev - 1;
      });
    }, 1000);

    startSpeechRecognition();
  };

  const startSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const currentText = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
        setTranscript(currentText);
      };

      recognitionRef.current.start();
    }
  };

  // --- Security Listeners ---
  useEffect(() => {
    if (stage !== 'interview') return;

    const handleVisibilityChange = () => { if (document.hidden) triggerWarning("Tab switching is prohibited."); };
    const handleBlur = () => triggerWarning("Keep the window focused.");
    const handleFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [stage]);

  const triggerWarning = (message: string) => {
    setWarningCount(prev => {
      const newCount = prev + 1;
      toast({ variant: "destructive", title: "Security Violation", description: `${message} (${newCount}/${MAX_WARNINGS})` });
      if (newCount >= MAX_WARNINGS) handleAutoFail();
      return newCount;
    });
  };

  const handleAutoFail = async () => {
    stopMediaTracks();
    await completeInterview("TERMINATED_CHEATING");
  };

  const requestFullScreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } catch (err) {
      console.error("Full-screen denied:", err);
    }
  };

  // --- Interview Flow Handlers ---
  const handleStartSetup = (app: JobApplication) => {
    setSelectedApp(app);
    setStage('setup');
  };

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      toast({ title: "Connected", description: "Microphone is ready." });
    } catch (err) {
      toast({ variant: "destructive", title: "Access Denied", description: "Microphone required." });
    }
  };

  const startInterview = async () => {
    if (!selectedApp) return;
    
    // ⚡ FIX: Status Check - only allow SCREENING status
    if (selectedApp.status !== 'SCREENING') {
        toast({ 
          variant: "destructive", 
          title: "Action Not Allowed", 
          description: "This interview is already completed or not available." 
        });
        setStage('list');
        return;
    }

    await requestFullScreen();

    if (!streamRef.current) {
        toast({ variant: "destructive", title: "Error", description: "Enable microphone first." });
        return;
    }
    
    try {
      setLoading(true);
      const response = await api.post(`/applications/interview/generate-questions/${selectedApp.id}`);
      
      if (response.data && response.data.questions) {
          const mappedQuestions = response.data.questions.map((q: string, index: number) => ({
              id: index + 1,
              text: q
          }));
          setQuestions(mappedQuestions);
          setStage('interview');
          setCurrentQuestionIndex(0);
          setWarningCount(0);
          setIsFullScreen(true);
      } else {
          throw new Error("No questions returned");
      }
    } catch (error) {
      console.error("Failed to load questions:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load questions." });
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
    setIsProcessing(true);
    
    try {
        if (selectedApp) {
            const finalAnswer = transcript.trim().length > 0 ? transcript : "No answer provided.";
            await api.post(`/applications/interview/${selectedApp.id}/answer`, {
                question: questions[currentQuestionIndex].text,
                answer: finalAnswer, 
                audioDuration: 120 - timeLeft
            });
        }
    } catch (error) {
        console.error("Failed to submit answer", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to save answer. Please try again." });
    }

    setIsProcessing(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeInterview("COMPLETED");
    }
  };

  const completeInterview = async (finalStatus: string) => {
    try {
      setLoading(true);
      if (selectedApp) {
        // ⚡ Call the finalize endpoint which will:
        // 1. Analyze all answers
        // 2. Generate summary
        // 3. Set status to AIINTERVIEWED
        await api.post(`/applications/interview/${selectedApp.id}/finalize`);
      }
      if (document.fullscreenElement) document.exitFullscreen();
      setStage('completed');
    } catch (error) {
        console.error("Interview finalization error:", error);
        toast({ variant: "destructive", title: "Failed", description: "Submission error. Please contact support." });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ⚡ HELPER: Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'SCREENING':
        return <Badge className="w-fit mb-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 animate-pulse">Action Required</Badge>;
      case 'AIINTERVIEWED':
        return <Badge className="w-fit mb-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">AI Interview Complete</Badge>;
      case 'SHORTLISTED':
      case 'INTERVIEWED':
        return <Badge className="w-fit mb-2 bg-green-500/10 text-green-600 hover:bg-green-500/20">Review Pending</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="w-fit mb-2">Application Closed</Badge>;
      case 'OFFER':
        return <Badge className="w-fit mb-2 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20">Offer Extended</Badge>;
      default:
        return <Badge variant="outline" className="w-fit mb-2">{status}</Badge>;
    }
  };

  // ⚡ HELPER: Get button for each status
  const getActionButton = (app: JobApplication) => {
    switch(app.status) {
      case 'SCREENING':
        return (
          <Button className="w-full gap-2" onClick={() => handleStartSetup(app)}>
            <Mic className="w-4 h-4" /> Start AI Interview
          </Button>
        );
      case 'AIINTERVIEWED':
        return (
          <Button variant="outline" className="w-full gap-2 cursor-not-allowed" disabled>
            <Clock className="w-4 h-4" /> Awaiting Recruiter Review
          </Button>
        );
      case 'REJECTED':
        return (
          <Button variant="outline" className="w-full gap-2 cursor-not-allowed" disabled>
            <Ban className="w-4 h-4" /> Closed
          </Button>
        );
      default:
        return (
          <Button variant="outline" className="w-full gap-2 cursor-not-allowed" disabled>
            <Clock className="w-4 h-4" /> {app.status}
          </Button>
        );
    }
  };

  // --- RENDERERS ---

  if (stage === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">AI Pre-Interview</h1>
              <p className="text-muted-foreground mt-1">Complete AI screenings to proceed to recruiter review.</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
        </div>
        
        {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : applications.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Pending Interviews</h3>
              <p className="text-muted-foreground max-w-sm mt-2">You are all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={`transition-shadow border-primary/20 ${app.status !== 'SCREENING' ? 'opacity-70 bg-muted/20' : 'hover:shadow-lg'}`}>
                  
                  <CardHeader>
                    {getStatusBadge(app.status)}
                    <CardTitle>{app.jobTitle}</CardTitle>
                    <CardDescription>{app.companyName}</CardDescription>
                  </CardHeader>
                  
                  <CardFooter>
                    {getActionButton(app)}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (stage === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setStage('list')}>&larr; Back</Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-primary" /> System Check</CardTitle>
            <CardDescription>Strict anti-cheating environment enforced.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm space-y-2 border border-destructive/20">
                <p className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Exam Rules:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Full Screen Required:</strong> Exiting locks the exam.</li>
                    <li><strong>No Tab Switching:</strong> Warnings issued immediately.</li>
                    <li><strong>2 Minutes per Question:</strong> Auto-submission on timeout.</li>
                </ul>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-primary" />
                <span>Microphone Check</span>
              </div>
              <Button variant="outline" size="sm" onClick={startMicTest} disabled={!!streamRef.current}>
                {streamRef.current ? "Connected" : "Test Mic"}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={startInterview} disabled={loading || !streamRef.current}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Enter Exam Mode & Start"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (stage === 'interview') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {!isFullScreen && (
            <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
                <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
                <h2 className="text-3xl font-bold text-destructive mb-2">Security Lockout</h2>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                    You have exited full-screen mode. Return immediately to continue.
                </p>
                <Button size="lg" onClick={requestFullScreen} variant="destructive">
                    <Maximize className="w-4 h-4 mr-2" /> Return to Full Screen
                </Button>
            </div>
        )}

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-md py-1 px-3">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-500/10 px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" /> Live
             </span>
             <span className={`font-mono text-xl font-bold flex items-center gap-2 bg-muted px-4 py-2 rounded-md border ${timeLeft < 10 ? "text-red-500 border-red-500 animate-pulse" : "text-foreground"}`}>
                <Timer className="w-5 h-5" />
                {formatTime(timeLeft)}
             </span>
          </div>
        </div>

        <Card className="border-2 border-primary/20 relative overflow-hidden min-h-[500px] flex flex-col shadow-2xl">
          {isProcessing && (
             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                <h3 className="text-2xl font-bold">Analyzing Answer...</h3>
             </div>
          )}

          <CardContent className="flex-1 p-10 flex flex-col items-center justify-between">
            <div className="flex-1 flex items-center justify-center w-full">
               <h2 className="text-3xl font-medium leading-relaxed text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {questions[currentQuestionIndex]?.text}
               </h2>
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-6 mt-8">
               {isRecording ? (
                 <div className="relative flex items-center justify-center">
                    <div className="absolute w-24 h-24 bg-primary/20 rounded-full animate-ping" />
                    <div className="absolute w-20 h-20 bg-primary/30 rounded-full animate-pulse" />
                    <div className="relative w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg z-10">
                        <Mic className="w-8 h-8" />
                    </div>
                 </div>
               ) : (
                 <div className="text-muted-foreground flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Preparing next question...
                 </div>
               )}
               
               <div className="w-full max-w-2xl min-h-[60px] p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                  {transcript ? (
                    <p className="text-lg text-foreground animate-in fade-in">{transcript}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Listening... Speak clearly into your microphone.</p>
                  )}
               </div>
            </div>
          </CardContent>

          <CardFooter className="justify-center gap-4 pb-8 pt-4 bg-muted/10 border-t border-border/10">
            <Button size="xl" variant="destructive" className="px-12 w-64 text-lg" onClick={handleNextQuestion} disabled={isProcessing}>
               <CheckCircle className="w-6 h-6 mr-2" /> Submit Answer
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (stage === 'completed') {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in zoom-in-50 duration-500">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-28 h-28 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center border-4 border-green-500/20"
          >
            <FileCheck className="w-14 h-14" />
          </motion.div>
          
          <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Interview Complete!</h2>
              <p className="text-xl text-muted-foreground font-medium">
                Your responses have been analyzed by our AI system.
              </p>
          </div>

          <div className="bg-muted/40 p-6 rounded-xl border border-border/50 max-w-md w-full">
             <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">AI Interview Complete</Badge>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Next Step</span>
                <span className="font-medium">Awaiting Recruiter Review</span>
             </div>
          </div>

          <Button size="lg" className="px-8" onClick={handleReturnToDashboard}>Return to Dashboard</Button>
        </div>
    );
  }

  return null;
};

export default PreInterview;