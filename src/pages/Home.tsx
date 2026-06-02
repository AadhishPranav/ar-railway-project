import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Scan, BookOpen, Shield, Zap, Eye, Train, ChevronRight, Activity } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const features = [
  {
    icon: Scan,
    title: "Live Camera Scanning",
    description: "Point your device camera at any railway sign for instant AI-powered identification in real time.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
  },
  {
    icon: Eye,
    title: "AR-Style Overlay",
    description: "Augmented reality interface projects detection data directly over the live camera feed.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: Shield,
    title: "Safety Instructions",
    description: "Instant access to critical safety protocols and procedures for every identified sign.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    icon: Zap,
    title: "Instant Detection",
    description: "Advanced AI model processes sign imagery in seconds with high confidence scoring.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: BookOpen,
    title: "Sign Library",
    description: "Comprehensive database of 15+ railway signs with detailed descriptions and safety information.",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
  },
  {
    icon: Activity,
    title: "Confidence Scoring",
    description: "Each detection includes an AI confidence percentage so you know exactly how reliable the result is.",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:pt-24 sm:pb-28">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-20 -right-40 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-mono font-medium text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            AI MODEL ACTIVE — SYSTEM READY
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            AI-Driven{" "}
            <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">
              AR Railway
            </span>
            <br />
            Sign Interpretation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-10 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed"
          >
            Point. Capture. Know. Our AI-powered system identifies railway signs instantly and delivers
            critical safety information through an immersive augmented reality interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              data-testid="button-start-scanning"
              onClick={() => setLocation("/scanner")}
              className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 hover:shadow-xl active:scale-95"
            >
              <Scan className="h-5 w-5" />
              Start Scanning
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              data-testid="button-sign-library"
              onClick={() => setLocation("/library")}
              className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-bold text-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:scale-95"
            >
              <BookOpen className="h-5 w-5" />
              Sign Library
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
          >
            {[
              { label: "Signs in Library", value: "15+" },
              { label: "Detection Accuracy", value: "97%" },
              { label: "Response Time", value: "<2s" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
              >
                <div className="text-2xl font-black text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono text-muted-foreground mb-4">
              <Train className="h-3 w-3" />
              SYSTEM CAPABILITIES
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Built for the Field
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Every feature is designed for real railway environments — fast, reliable, and safety-first.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`rounded-2xl border ${feature.border} ${feature.bg} p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20`}
                data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg} ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl rounded-3xl border border-primary/20 bg-primary/5 p-10 text-center backdrop-blur-sm"
        >
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary mx-auto">
            <Scan className="h-7 w-7" />
          </div>
          <h2 className="mb-3 text-2xl font-black">Ready to Start Scanning?</h2>
          <p className="mb-6 text-muted-foreground">
            Grant camera access and start identifying railway signs in seconds.
          </p>
          <button
            data-testid="button-cta-start-scanning"
            onClick={() => setLocation("/scanner")}
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95"
          >
            <Scan className="h-5 w-5" />
            Launch Scanner
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
