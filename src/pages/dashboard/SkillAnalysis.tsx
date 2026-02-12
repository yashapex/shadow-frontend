import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Brain,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import api from "@/lib/axiosconfig";
import { useToast } from "@/hooks/use-toast";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from "recharts";

// --- Types ---
interface SkillProficiency {
  name: string;
  category: string;
  proficiency: number;
}

interface Strength {
  title: string;
  description: string;
}

interface GrowthArea {
  title: string;
  description: string;
}

interface CareerMatch {
  role: string;
  match: number;
}

interface SkillAnalysisData {
  skills: SkillProficiency[];
  strengths: Strength[];
  growthAreas: GrowthArea[];
  careerMatches: CareerMatch[];
  radarChartData: {
    category: string;
    value: number;
  }[];
}

const SkillAnalysis = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<SkillAnalysisData | null>(null);

  // --- Helper: Get color based on proficiency ---
  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return "text-emerald-500";
    if (proficiency >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getProficiencyBarColor = (proficiency: number) => {
    if (proficiency >= 80) return "bg-emerald-500";
    if (proficiency >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getMatchColor = (match: number) => {
    if (match >= 80) return "bg-red-500";
    if (match >= 70) return "bg-emerald-500";
    return "bg-blue-500";
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile/candidate/analysis/skills");
      
      // If the backend returns empty or null, we stay in "Ready to Analyze" state
      if (response.data && response.data.skills) {
         setAnalysisData(response.data);
      }
    } catch (error) {
      console.log("No existing analysis found or fetch failed.");
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    try {
      setLoading(true);
      
      // ⚡ CALL THE REAL ENDPOINT
      const response = await api.get("/profile/candidate/analysis/skills");
      
      setAnalysisData(response.data);
      toast({ title: "Analysis Complete", description: "AI has analyzed your resume." });
    } catch (error) {
      console.error("Analysis failed", error);
      toast({ 
        title: "Error", 
        description: "Could not analyze resume. Ensure you have uploaded one.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Skill Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights to boost your career
          </p>
        </div>

        <Button
          onClick={runAnalysis}
          disabled={loading}
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold px-6"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Run Full Analysis
            </>
          )}
        </Button>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-12 border border-border/30"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative">
              <Brain className="w-16 h-16 text-primary animate-pulse" />
              <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-ping" />
            </div>
            <h3 className="text-xl font-semibold mt-4">Analyzing Your Skills</h3>
            <p className="text-muted-foreground mt-2">
              AI is processing your resume and generating insights...
            </p>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !analysisData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-12 border-2 border-dashed border-border/50"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <BarChart3 className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold">No Analysis Yet</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Click the "Run Full Analysis" button to get AI-powered insights about your
              skills, strengths, and career opportunities.
            </p>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Skill Overview & Career Match - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skill Overview - Radar Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6 border border-border/30"
              >
                <h2 className="text-xl font-display font-bold mb-6">
                  Skill Overview
                </h2>
                
                {/* Hexagonal Radar Chart Visualization */}
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analysisData.radarChartData}>
                      {/* ⚡ UPDATED: Red Gradient Definition */}
                      <defs>
                        <linearGradient id="radarThemeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="category"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Candidate"
                        dataKey="value"
                        stroke="#ef4444" 
                        fill="url(#radarThemeGradient)"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          backgroundColor: 'hsl(var(--popover))',
                          color: 'hsl(var(--popover-foreground))'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Career Match */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6 border border-border/30"
              >
                <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  Career Match
                </h2>
                
                <div className="space-y-4">
                  {analysisData.careerMatches.map((career, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {career.role}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-bold",
                            career.match >= 80 ? "text-red-500" : 
                            career.match >= 70 ? "text-emerald-500" : 
                            "text-blue-500"
                          )}
                        >
                          {career.match}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${career.match}%` }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                          className={cn(
                            "h-full rounded-full",
                            getMatchColor(career.match)
                          )}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Skill Proficiency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 border border-border/30"
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-display font-bold">
                  Skill Proficiency
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisData.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {skill.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs bg-muted/30 border-border/30"
                        >
                          {skill.category}
                        </Badge>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          getProficiencyColor(skill.proficiency)
                        )}
                      >
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                        className={cn(
                          "h-full rounded-full",
                          getProficiencyBarColor(skill.proficiency)
                        )}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Strengths & Growth Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl p-6 border border-border/30 bg-gradient-to-br from-emerald-500/5 to-transparent"
              >
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-xl font-display font-bold">
                    Your Strengths
                  </h2>
                </div>

                <div className="space-y-4">
                  {analysisData.strengths.map((strength, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {strength.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {strength.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Growth Areas */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-2xl p-6 border border-border/30 bg-gradient-to-br from-amber-500/5 to-transparent"
              >
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-display font-bold">
                    Areas for Growth
                  </h2>
                </div>

                <div className="space-y-4">
                  {analysisData.growthAreas.map((area, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex gap-3"
                    >
                      <Target className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {area.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {area.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillAnalysis;