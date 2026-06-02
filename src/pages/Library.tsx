import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, AlertTriangle, Info, ShieldAlert, ShieldCheck, BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { railwaySigns, type RailwaySign } from "@/data/railwaySigns";

const categoryIcons: Record<string, React.ElementType> = {
  Mandatory: ShieldAlert,
  Regulatory: ShieldCheck,
  Warning: AlertTriangle,
  Informational: Info,
  Prohibition: X,
};

const categoryColors: Record<string, { badge: string; glow: string }> = {
  Mandatory: { badge: "text-red-400 bg-red-400/10 border-red-400/30", glow: "border-red-400/25" },
  Regulatory: { badge: "text-orange-400 bg-orange-400/10 border-orange-400/30", glow: "border-orange-400/25" },
  Warning: { badge: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", glow: "border-yellow-400/25" },
  Informational: { badge: "text-sky-400 bg-sky-400/10 border-sky-400/30", glow: "border-sky-400/25" },
  Prohibition: { badge: "text-rose-400 bg-rose-400/10 border-rose-400/30", glow: "border-rose-400/25" },
};

function SignModal({ sign, onClose }: { sign: RailwaySign; onClose: () => void }) {
  const colors = categoryColors[sign.category] ?? categoryColors.Informational;
  const Icon = categoryIcons[sign.category] ?? Info;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      data-testid="overlay-sign-modal"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-sign-detail"
      >
        <button
          data-testid="button-close-modal"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div
            className="h-14 w-14 rounded-xl flex items-center justify-center text-2xl font-black border-2 flex-shrink-0"
            style={{
              backgroundColor: sign.color + "22",
              borderColor: sign.color + "55",
              color: sign.color,
            }}
          >
            {sign.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-black" data-testid="text-modal-sign-name">{sign.name}</h2>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium mt-1 ${colors.badge}`}>
              <Icon className="h-3 w-3" />
              {sign.category}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-xs font-mono text-muted-foreground">DESCRIPTION</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed" data-testid="text-modal-description">
              {sign.description}
            </p>
          </div>

          <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-mono text-amber-400/80">SAFETY INSTRUCTION</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-modal-safety">
              {sign.safetyInstruction}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Library() {
  const [query, setQuery] = useState("");
  const [selectedSign, setSelectedSign] = useState<RailwaySign | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return railwaySigns;
    return railwaySigns.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono text-muted-foreground mb-4">
            <BookOpen className="h-3 w-3" />
            RAILWAY SIGN DATABASE
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Sign Library</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto text-sm">
            Browse all {railwaySigns.length} railway signs. Click any card for full details and safety instructions.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mx-auto mb-8 max-w-xl"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            data-testid="input-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search signs by name or category..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm placeholder:text-muted-foreground shadow-inner shadow-black/20 transition-all focus:border-primary/40 focus:bg-primary/5 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          {query && (
            <button
              data-testid="button-clear-search"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </motion.div>

        {/* Results count */}
        <div className="mb-5 text-xs font-mono text-muted-foreground text-center">
          {filtered.length} SIGN{filtered.length !== 1 ? "S" : ""} FOUND
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map((sign) => {
                const colors = categoryColors[sign.category] ?? categoryColors.Informational;
                const Icon = categoryIcons[sign.category] ?? Info;
                return (
                  <motion.button
                    key={sign.id}
                    variants={cardVariants}
                    data-testid={`card-sign-${sign.id}`}
                    onClick={() => setSelectedSign(sign)}
                    className={`group cursor-pointer rounded-2xl border ${colors.glow} bg-card/95 p-5 text-left shadow-sm shadow-black/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-opacity-50 active:scale-[0.98]`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black border-2"
                        style={{
                          backgroundColor: sign.color + "22",
                          borderColor: sign.color + "55",
                          color: sign.color,
                        }}
                      >
                        {sign.name.charAt(0)}
                      </div>
                      <Icon className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors" data-testid={`text-sign-name-${sign.id}`}>
                      {sign.name}
                    </h3>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs mb-3 ${colors.badge}`}>
                      {sign.category}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {sign.description}
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No signs found for "{query}"</p>
              <button
                onClick={() => setQuery("")}
                className="mt-3 text-xs text-primary hover:underline"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedSign && (
          <SignModal sign={selectedSign} onClose={() => setSelectedSign(null)} />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
