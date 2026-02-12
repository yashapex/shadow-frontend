import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted-foreground">
              AI-powered hiring platform —{" "}
              <Link to="/auth" className="text-accent hover:underline">
                Get started free
              </Link>
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Hire With{" "}
            <span className="text-gradient">Confidence</span>.
            <br />
            Trusted Skills. Trusted{" "}
            <span className="text-gradient">AI</span>.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 font-body"
          >
            Shadow gives you validated, defensible, and predictive insights, so you 
            gain the clarity and confidence to hire better and grow your business.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isAuthenticated ? (
              <Button variant="hero" size="xl" className="group" asChild>
                <Link to={user?.role === "RECRUITER" ? "/recruiter" : "/dashboard"}>
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="hero" size="xl" className="group" asChild>
                  <Link to="/auth">
                    <LayoutDashboard className="w-5 h-5" />
                    Get Started
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" className="group" asChild>
                  <Link to="/auth">
                    <Play className="w-5 h-5" />
                    Sign In
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </>
            )}
          </motion.div>
        </div>

        {/* Hero Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 relative max-w-6xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent rounded-2xl blur-3xl -z-10" />
            <div className="glass-card rounded-2xl p-2 overflow-hidden">
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="bg-primary/50 px-6 py-4 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-muted" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-muted/30 rounded-lg px-4 py-1 text-sm text-muted-foreground font-mono">
                      app.shadow.ai/dashboard
                    </div>
                  </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card rounded-xl p-6 col-span-1">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-destructive/30 mb-4 mx-auto flex items-center justify-center">
                      <span className="text-2xl font-display font-bold text-foreground">JD</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-center text-foreground">Jane Doe</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">Senior Engineer</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Skills Match</span>
                        <span className="text-accent font-semibold">94%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[94%] bg-gradient-to-r from-accent to-destructive rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-6 col-span-1 md:col-span-2">
                    <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Interview Analytics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/20 rounded-lg p-4">
                        <p className="text-3xl font-display font-bold text-gradient">847</p>
                        <p className="text-sm text-muted-foreground">Candidates Screened</p>
                      </div>
                      <div className="bg-muted/20 rounded-lg p-4">
                        <p className="text-3xl font-display font-bold text-foreground">42%</p>
                        <p className="text-sm text-muted-foreground">Faster Hiring</p>
                      </div>
                      <div className="bg-muted/20 rounded-lg p-4">
                        <p className="text-3xl font-display font-bold text-foreground">96%</p>
                        <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                      </div>
                      <div className="bg-muted/20 rounded-lg p-4">
                        <p className="text-3xl font-display font-bold text-accent">$2.4M</p>
                        <p className="text-sm text-muted-foreground">Cost Savings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
