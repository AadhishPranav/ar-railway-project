import { motion } from "framer-motion";

export function AROverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Corner Brackets */}
      <motion.div
        className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-xl opacity-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-xl opacity-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      <motion.div
        className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-xl opacity-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.div
        className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-xl opacity-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* Scanning Line */}
      <motion.div
        className="absolute left-8 right-8 h-[2px] bg-primary shadow-[0_0_15px_rgba(6,182,212,0.8)]"
        animate={{ top: ["15%", "85%", "15%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Center Target */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
        <motion.div
          className="w-1 h-1 bg-primary rounded-full"
          animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div className="absolute inset-0 border border-primary/30 rounded-full animate-ping" />
      </div>

      {/* Floating Info Boxes */}
      <motion.div
        className="absolute top-1/4 left-12 bg-background/80 backdrop-blur-sm border border-primary/30 p-2 rounded-md font-mono text-[10px] text-primary/80 hidden md:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        LENS_CALIBRATION: OK
        <br />
        EXPOSURE: AUTO
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-12 bg-background/80 backdrop-blur-sm border border-primary/30 p-2 rounded-md font-mono text-[10px] text-primary/80 hidden md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        AI_MODEL: ACTIVE
        <br />
        CONFIDENCE: --%
      </motion.div>
    </div>
  );
}
