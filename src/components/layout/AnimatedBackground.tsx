import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40" />

      {/* Gradient Orbs */}
      <motion.div
        className="orb orb-crimson w-[600px] h-[600px] -top-48 -right-48"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="orb orb-navy w-[500px] h-[500px] top-1/3 -left-48"
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="orb orb-crimson w-[400px] h-[400px] bottom-0 right-1/4"
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      <motion.div
        className="orb orb-navy w-[350px] h-[350px] top-1/2 right-0"
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 20, -35, 0],
          scale: [1, 0.98, 1.08, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Subtle scan line effect overlay */}
      <div className="absolute inset-0 scan-line opacity-30" />
    </div>
  );
}
