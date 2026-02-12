import { motion } from "framer-motion";

const companies = [
  "ACME Corp",
  "TechFlow",
  "Innovate Inc",
  "DataPrime",
  "CloudScale",
  "FutureWorks",
  "NexGen AI",
  "Quantum Labs",
];

export function TrustedBySection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-muted-foreground mb-12 font-display text-lg tracking-wide"
        >
          TRUSTED BY THE BEST
        </motion.p>

        {/* Infinite scrolling logos */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex gap-16 overflow-hidden"
          >
            <div className="flex gap-16 animate-[slide-left_30s_linear_infinite]">
              {[...companies, ...companies].map((company, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 glass-card px-8 py-4 rounded-lg"
                >
                  <span className="font-display font-semibold text-muted-foreground whitespace-nowrap">
                    {company}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes slide-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
