import { motion } from "framer-motion";
import { Brain, MessageSquare, Target, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Validate Role-Specific Skills",
    description: "Assess candidates with validated, job-relevant assessments that predict on-the-job success.",
  },
  {
    icon: MessageSquare,
    title: "Interview Smarter, Hire Better",
    description: "AI-powered video interviews with structured scoring that eliminates bias and saves time.",
  },
  {
    icon: Brain,
    title: "Engage Talent 24/7",
    description: "AI recruiting assistant provides instant responses and schedules interviews automatically.",
  },
  {
    icon: Shield,
    title: "Defensible & Compliant",
    description: "Every assessment is validated by I/O psychologists and meets EEOC guidelines.",
  },
  {
    icon: Zap,
    title: "Accelerate Time-to-Hire",
    description: "Reduce hiring time by up to 90% with automated screening and intelligent ranking.",
  },
  {
    icon: Users,
    title: "Improve Quality of Hire",
    description: "Make data-driven decisions that lead to better retention and performance.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function FeaturesSection() {
  return (
    <section id="solutions" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Hire Smarter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete suite of AI-powered tools designed to transform your hiring process
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card rounded-2xl p-8 group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-destructive/20 flex items-center justify-center mb-6 group-hover:from-accent/30 group-hover:to-destructive/30 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
