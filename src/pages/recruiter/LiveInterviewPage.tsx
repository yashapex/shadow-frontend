import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  FileText,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  UploadCloud,
  CheckCircle2,
  Hash,
  BrainCircuit,
  Target,
  Share2
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axiosconfig";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- Types ---
interface InterviewInsights {
  executiveSummary: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  topicsDiscussed: string[];
  suggestedRating: number;
}

interface LiveInterviewData {
  id: number;
  scheduledAt: string;
  meetingLink: string;
  status: string;
  transcript: string;
  aiInsights: string; // JSON String
}

// --- Components ---

// 1. Animated Score Gauge
const ScoreGauge = ({ score }: { score: number }) => {
  const size = 180;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "hsl(142, 76%, 36%)"; // Green
    if (s >= 60) return "hsl(45, 93%, 47%)"; // Yellow
    return "hsl(0, 84%, 60%)"; // Red
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--muted) / 0.2)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-display font-bold text-foreground"
          >
            {score}
          </motion.span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">AI Score</span>
        </div>
      </div>
    </div>
  );
};

// 2. Main Page Component
const LiveInterviewPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [interview, setInterview] = useState<LiveInterviewData | null>(null);
  const [transcriptInput, setTranscriptInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState<InterviewInsights | null>(null);

  useEffect(() => {
    if (applicationId && applicationId !== "undefined" && !isNaN(Number(applicationId))) {
      fetchInterview();
    } else {
      setLoading(false);
    }
  }, [applicationId]);

  const fetchInterview = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/live-interviews/application/${applicationId}`);
      setInterview(res.data);
      if (res.data.transcript) setTranscriptInput(res.data.transcript);
      if (res.data.aiInsights) {
        setInsights(JSON.parse(res.data.aiInsights));
      }
    } catch (error) {
      console.error("Fetch error", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load interview." });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!interview || !transcriptInput) return;
    try {
      setAnalyzing(true);
      const res = await api.post(`/live-interviews/${interview.id}/analyze`, transcriptInput, {
        headers: { 'Content-Type': 'text/plain' }
      });
      
      setInterview(res.data);
      if (res.data.aiInsights) {
        setInsights(JSON.parse(res.data.aiInsights));
      }
      toast({ title: "Insights Generated", description: "Interview notes created successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Analysis failed." });
    } finally {
      setAnalyzing(false);
    }
  };

  // Mock data for the Radar Chart (derived from single score for visual effect)
  const getRadarData = (score: number) => [
    { subject: 'Technical', A: Math.min(100, score + 5), fullMark: 100 },
    { subject: 'Communication', A: Math.min(100, score - 5), fullMark: 100 },
    { subject: 'Problem Solving', A: Math.min(100, score + 2), fullMark: 100 },
    { subject: 'Experience', A: Math.min(100, score - 2), fullMark: 100 },
    { subject: 'Culture Fit', A: Math.min(100, score + 8), fullMark: 100 },
    { subject: 'Leadership', A: Math.min(100, score - 8), fullMark: 100 },
  ];

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  
  if (!interview) return (
    <div className="p-10 text-center space-y-4">
        <h3 className="text-lg font-medium">Interview Not Found</h3>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-border/40 pb-6">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-muted/50">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground/50">
                    Live Interview Intelligence
                </h1>
                <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                    <BrainCircuit className="w-3 h-3" /> AI-Powered Post-Interview Analysis
                </p>
            </div>
        </div>
        <div className="flex gap-3">
            {interview.meetingLink && (
                <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary" onClick={() => window.open(interview.meetingLink, '_blank')}>
                    <Video className="w-4 h-4" /> Join Google Meet
                </Button>
            )}
            <Button className="gap-2" onClick={() => window.print()}>
                <Share2 className="w-4 h-4" /> Export Report
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
        
        {/* LEFT PANEL: Transcript Input (3 cols) */}
        <div className="xl:col-span-3 h-full flex flex-col gap-4">
          <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-sm glass-card">
            <CardHeader className="pb-3 bg-muted/5 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <FileText className="w-4 h-4 text-primary" /> 
                Transcript Source
              </CardTitle>
              <CardDescription className="text-xs">Paste text from Google Meet or Otter.ai</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative group">
              <Textarea 
                className="w-full h-full min-h-[400px] resize-none border-0 focus-visible:ring-0 p-4 font-mono text-xs leading-relaxed bg-transparent text-muted-foreground/80 placeholder:text-muted-foreground/30"
                placeholder="[00:00] Recruiter: Welcome to the interview...
[00:05] Candidate: Thank you, I'm excited to be here..."
                value={transcriptInput}
                onChange={(e) => setTranscriptInput(e.target.value)}
              />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    className="w-full shadow-lg bg-primary/90 hover:bg-primary backdrop-blur-sm" 
                    onClick={handleAnalyze} 
                    disabled={analyzing || !transcriptInput}
                  >
                    {analyzing ? (
                       <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                    ) : (
                       <><UploadCloud className="w-4 h-4 mr-2" /> Generate AI Insights</>
                    )}
                  </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL: Dashboard (9 cols) */}
        <div className="xl:col-span-9 h-full overflow-y-auto pr-2 space-y-6 scrollbar-hide">
          {insights ? (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
              
              {/* TOP ROW: Score & Radar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Score Card */}
                <Card className="col-span-1 border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Candidate Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <ScoreGauge score={insights.suggestedRating} />
                    <div className="mt-4 text-center">
                        <Badge variant={insights.suggestedRating >= 70 ? "default" : "destructive"} className="px-3 py-1 text-xs">
                            {insights.suggestedRating >= 70 ? "Recommended" : "Needs Review"}
                        </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Executive Summary */}
                <Card className="col-span-2 border-border/50 shadow-sm flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-primary" /> Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm leading-7 text-muted-foreground/90 bg-muted/10 p-5 rounded-xl border border-border/50">
                      {insights.executiveSummary}
                    </p>
                    
                    {/* Topics Cloud */}
                    <div className="mt-6">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                            <Hash className="w-3 h-3" /> Topics Covered
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {insights.topicsDiscussed.map((topic, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Badge variant="secondary" className="px-3 py-1.5 font-normal text-xs bg-accent/5 text-accent-foreground border-accent/20 hover:bg-accent/10 transition-colors cursor-default">
                                        {topic}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* MIDDLE ROW: Strengths vs Weaknesses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Strengths */}
                 <Card className="border-border/50 shadow-sm overflow-hidden group">
                    <CardHeader className="bg-gradient-to-r from-emerald-500/5 to-transparent border-b border-emerald-500/10">
                        <CardTitle className="text-base flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-4 h-4" /> Key Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        {insights.keyStrengths.map((str, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-500/5 transition-colors border border-transparent hover:border-emerald-500/10"
                            >
                                <div className="p-1 rounded-full bg-emerald-500/10 mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                </div>
                                <span className="text-sm text-foreground/80 leading-relaxed">{str}</span>
                            </motion.div>
                        ))}
                    </CardContent>
                 </Card>

                 {/* Weaknesses */}
                 <Card className="border-border/50 shadow-sm overflow-hidden group">
                    <CardHeader className="bg-gradient-to-r from-amber-500/5 to-transparent border-b border-amber-500/10">
                        <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        {insights.areasForImprovement.map((weak, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-amber-500/5 transition-colors border border-transparent hover:border-amber-500/10"
                            >
                                <div className="p-1 rounded-full bg-amber-500/10 mt-0.5">
                                    <Target className="w-3.5 h-3.5 text-amber-600" />
                                </div>
                                <span className="text-sm text-foreground/80 leading-relaxed">{weak}</span>
                            </motion.div>
                        ))}
                    </CardContent>
                 </Card>
              </div>
              
              {/* BOTTOM: Skill Radar (Visual Aid) */}
              <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                      <CardTitle className="text-sm font-medium uppercase text-muted-foreground flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4" /> Competency Profile (Projected)
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarData(insights.suggestedRating)}>
                                <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Candidate"
                                    dataKey="A"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary))"
                                    fillOpacity={0.3}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                     </div>
                  </CardContent>
              </Card>

            </motion.div>
          ) : (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/50 rounded-2xl bg-muted/5 text-muted-foreground/50">
              <div className="bg-background p-6 rounded-full shadow-sm mb-6 animate-pulse">
                <BrainCircuit className="w-16 h-16 text-muted-foreground/20" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Waiting for Transcript</h3>
              <p className="max-w-md text-center mt-3 leading-relaxed">
                Paste the interview conversation on the left and click <span className="font-bold text-primary">Generate AI Insights</span> to create this report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveInterviewPage;