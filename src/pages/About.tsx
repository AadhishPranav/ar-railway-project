import { motion } from "framer-motion";
import { Train, Target, Cpu, Shield, Users, ChevronRight, BookOpen, Zap, Eye, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const objectives = [
  "Improve railway safety by enabling instant sign identification for field personnel",
  "Reduce human error in sign interpretation through AI-assisted detection",
  "Provide accessible safety information to railway staff at all experience levels",
  "Create a scalable platform for expanding railway sign databases globally",
  "Support proactive safety culture across railway networks",
];

const technologies = [
  { name: "React.js", role: "UI Framework", icon: Cpu, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { name: "Vite", role: "Build Tooling", icon: Zap, color: "text-violet-400", bg: "bg-violet-400/10" },
  { name: "TypeScript", role: "Type Safety", icon: Shield, color: "text-blue-400", bg: "bg-blue-400/10" },
  { name: "Tailwind CSS", role: "Styling System", icon: Eye, color: "text-teal-400", bg: "bg-teal-400/10" },
  { name: "Framer Motion", role: "Animations", icon: Globe, color: "text-pink-400", bg: "bg-pink-400/10" },
  { name: "Browser Camera API", role: "Camera Access", icon: Eye, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { name: "Wouter", role: "Client Routing", icon: ChevronRight, color: "text-amber-400", bg: "bg-amber-400/10" },
  { name: "Local JSON Data", role: "Sign Database", icon: BookOpen, color: "text-sky-400", bg: "bg-sky-400/10" },
];

const benefits = [
  {
    icon: Shield,
    title: "Enhanced Safety",
    description: "Instant access to safety instructions for any identified railway sign reduces the risk of misinterpretation in critical situations.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    icon: Zap,
    title: "Speed of Response",
    description: "AI detection completes in under 2 seconds, providing critical safety information precisely when it's needed most.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "Supports personnel at all experience levels, acting as an instant reference guide for new and experienced staff alike.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: Globe,
    title: "Scalable Platform",
    description: "The architecture supports expanding the sign library to cover international railway standards and regional variations.",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono text-muted-foreground mb-4">
            <Train className="h-3 w-3" />
            ABOUT THE PROJECT
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl mb-4">
            AI-Driven AR Railway
            <br />
            <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">
              Sign Interpretation
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A cutting-edge safety tool that combines computer vision, augmented reality, and AI to make
            railway sign identification instant, accurate, and accessible to everyone in the field.
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 rounded-2xl border border-white/10 bg-card/90 p-8 shadow-lg shadow-black/25"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Train className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black">Project Overview</h2>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              The AI-Driven AR Railway Sign Interpretation System is a progressive web application designed to
              assist railway personnel, trainees, and safety inspectors in rapidly identifying and understanding
              railway signs encountered in the field.
            </p>
            <p>
              By leveraging the device camera and simulated AI detection, the system provides an immersive
              augmented reality experience that overlays critical safety information directly onto the live
              camera feed — transforming any smartphone or tablet into a professional safety tool.
            </p>
            <p>
              The application maintains a comprehensive database of 15 core railway signs, each with detailed
              descriptions and precise safety instructions, accessible both through live scanning and a
              searchable reference library.
            </p>
          </div>
        </motion.section>

        {/* Objectives */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-violet-400/10 text-violet-400 flex items-center justify-center">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black">Objectives</h2>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-card/90 px-4 py-3 shadow-sm shadow-black/20"
                data-testid={`item-objective-${i}`}
              >
                <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-black">
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{obj}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Technologies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black">Technologies Used</h2>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {technologies.map((tech) => (
              <motion.div
                key={tech.name}
                variants={itemVariants}
                className="rounded-xl border border-white/10 bg-card/90 p-4 text-center shadow-sm shadow-black/20"
                data-testid={`card-tech-${tech.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`mx-auto mb-3 h-10 w-10 rounded-xl ${tech.bg} ${tech.color} flex items-center justify-center`}>
                  <tech.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold">{tech.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tech.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Benefits */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black">Benefits of Railway Sign Interpretation</h2>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className={`rounded-2xl border ${benefit.border} ${benefit.bg} p-6 shadow-sm shadow-black/20`}
                data-testid={`card-benefit-${benefit.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`mb-4 h-10 w-10 rounded-xl ${benefit.bg} ${benefit.color} flex items-center justify-center`}>
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}
