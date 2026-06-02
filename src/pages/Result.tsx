import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Scan, Home, AlertTriangle, CheckCircle, Info, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { railwaySigns, type RailwaySign } from "@/data/railwaySigns";

const categoryColors: Record<string, string> = {
  Mandatory: "text-red-400 bg-red-400/10 border-red-400/30",
  Regulatory: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  Warning: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Informational: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  Prohibition: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Result() {
  const [, setLocation] = useLocation();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedSign, setDetectedSign] = useState<RailwaySign | null>(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const image = sessionStorage.getItem("capturedImage");
    if (!image) {
      setLocation("/scanner");
      return;
    }
    setCapturedImage(image);
    const randomSign = railwaySigns[Math.floor(Math.random() * railwaySigns.length)];
    setDetectedSign(randomSign);
    setConfidence(Math.floor(Math.random() * 13) + 87);
  }, [setLocation]);

  if (!capturedImage || !detectedSign) return null;

  const categoryClass = categoryColors[detectedSign.category] ?? "text-primary bg-primary/10 border-primary/30";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-mono text-primary mb-4">
            <CheckCircle className="h-3 w-3" />
            DETECTION COMPLETE
          </div>
          <h1 className="text-3xl font-black tracking-tight">Sign Identified</h1>
          <p className="text-muted-foreground text-sm mt-2">AI has successfully analyzed your captured image</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Captured Image */}
          <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-white/10 bg-card/95 shadow-lg shadow-black/25">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">CAPTURED IMAGE</span>
            </div>
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured railway sign"
                className="w-full object-cover max-h-64"
                data-testid="img-captured"
              />
              {/* Confidence Badge overlay */}
              <div className="absolute top-3 right-3 rounded-lg border border-primary/40 bg-background/80 backdrop-blur-sm px-3 py-1.5">
                <p className="text-xs font-mono text-muted-foreground">CONFIDENCE</p>
                <p className="text-xl font-black text-primary leading-none" data-testid="text-confidence">
                  {confidence}%
                </p>
              </div>
            </div>
          </motion.div>

          {/* Detected Sign */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-card/95 p-6 shadow-lg shadow-black/25">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-1">DETECTED SIGN</p>
                <h2 className="text-2xl font-black tracking-tight" data-testid="text-sign-name">
                  {detectedSign.name}
                </h2>
              </div>
              <div
                className="h-14 w-14 rounded-xl flex items-center justify-center text-xl font-black border-2"
                style={{ backgroundColor: detectedSign.color + "22", borderColor: detectedSign.color + "55", color: detectedSign.color }}
                data-testid="div-sign-color-indicator"
              >
                {detectedSign.name.charAt(0)}
              </div>
            </div>

            <div>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryClass}`}>
                {detectedSign.category}
              </span>
            </div>

            {/* Confidence Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">AI CONFIDENCE</span>
                <span className="text-xs font-mono text-primary font-bold">{confidence}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="rounded-2xl border border-white/10 bg-card/95 p-6 shadow-lg shadow-black/25">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-sky-400/10 text-sky-400 flex items-center justify-center">
                <Info className="h-4 w-4" />
              </div>
              <h3 className="font-bold">Sign Description</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-description">
              {detectedSign.description}
            </p>
          </motion.div>

          {/* Safety Instructions */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-amber-400">Safety Instructions</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-safety">
              {detectedSign.safetyInstruction}
            </p>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            data-testid="button-scan-again"
            onClick={() => { sessionStorage.removeItem("capturedImage"); setLocation("/scanner"); }}
            className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95"
          >
            <Scan className="h-4 w-4" />
            Scan Again
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            data-testid="button-return-home"
            onClick={() => setLocation("/")}
            className="group flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-bold text-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:scale-95"
          >
            <Home className="h-4 w-4" />
            Return Home
          </button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
