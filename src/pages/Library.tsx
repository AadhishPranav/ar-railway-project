import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  AlertTriangle,
  Info,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignImage, SignImageBadge } from "@/components/SignImage";
import { railwaySigns, type RailwaySign } from "@/data/railwaySigns";

const categoryIcons: Record<string, React.ElementType> = {
  Mandatory: ShieldAlert,
  Regulatory: ShieldCheck,
  Warning: AlertTriangle,
  Informational: Info,
  Prohibition: X,
};

const categoryColors: Record<string, { badge: string; ring: string; glow: string }> = {
  Mandatory: {
    badge: "text-red-400 bg-red-400/10 border-red-400/30",
    ring: "group-hover:ring-red-400/40",
    glow: "border-red-400/20 hover:border-red-400/40",
  },
  Regulatory: {
    badge: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    ring: "group-hover:ring-orange-400/40",
    glow: "border-orange-400/20 hover:border-orange-400/40",
  },
  Warning: {
    badge: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    ring: "group-hover:ring-yellow-400/40",
    glow: "border-yellow-400/20 hover:border-yellow-400/40",
  },
  Informational: {
    badge: "text-sky-400 bg-sky-400/10 border-sky-400/30",
    ring: "group-hover:ring-sky-400/40",
    glow: "border-sky-400/20 hover:border-sky-400/40",
  },
  Prohibition: {
    badge: "text-rose-400 bg-rose-400/10 border-rose-400/30",
    ring: "group-hover:ring-rose-400/40",
    glow: "border-rose-400/20 hover:border-rose-400/40",
  },
};

function SignModal({ sign, onClose }: { sign: RailwaySign; onClose: () => void }) {
  const colors = categoryColors[sign.category] ?? categoryColors.Informational;
  const Icon = categoryIcons[sign.category] ?? Info;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      data-testid="overlay-sign-modal"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 24 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-card shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-sign-detail"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
          <SignImage
            sign={sign}
            preferPhoto
            className="h-full w-full"
            imgClassName="transition-transform duration-500"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <button
            data-testid="button-close-modal"
            onClick={onClose}
            className="absolute top-3 right-3 rounded-lg bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-white drop-shadow-md" data-testid="text-modal-sign-name">
                {sign.name}
              </h2>
              <span
                className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${colors.badge}`}
              >
                <Icon className="h-3 w-3" />
                {sign.category}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-xs font-mono text-muted-foreground">DESCRIPTION</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground" data-testid="text-modal-description">
              {sign.description}
            </p>
          </div>

          <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-mono text-amber-400/80">SAFETY INSTRUCTION</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground" data-testid="text-modal-safety">
              {sign.safetyInstruction}
            </p>
          </div>

          {sign.imageCredit && (
            <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground/80">
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
              Image: {sign.imageCredit}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Library() {
  const [query, setQuery] = useState("");
  const [selectedSign, setSelectedSign] = useState<RailwaySign | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return railwaySigns;
    return railwaySigns.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            RAILWAY SIGN DATABASE
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Sign Library</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Browse all {railwaySigns.length} railway signs with photo previews. Tap a card for full
            details and safety instructions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mx-auto mb-8 max-w-xl"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            data-testid="input-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search signs by name or category..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm shadow-inner shadow-black/20 transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:bg-primary/5 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          {query && (
            <button
              data-testid="button-clear-search"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </motion.div>

        <div className="mb-6 text-center text-xs font-mono text-muted-foreground">
          {filtered.length} SIGN{filtered.length !== 1 ? "S" : ""} FOUND
        </div>

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`grid-${query}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card/95 text-left shadow-md shadow-black/25 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40 active:scale-[0.98] ${colors.glow} ${colors.ring}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/30">
                      <SignImage
                        sign={sign}
                        preferPhoto
                        className="h-full w-full"
                        imgClassName="transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
                      <div className="absolute left-3 top-3">
                        <SignImageBadge sign={sign} />
                      </div>
                      <div className="absolute right-3 top-3 rounded-lg bg-black/40 p-1.5 backdrop-blur-sm">
                        <Icon className="h-4 w-4 text-white/80" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3
                          className="text-base font-bold text-white drop-shadow-sm transition-colors group-hover:text-primary"
                          data-testid={`text-sign-name-${sign.id}`}
                        >
                          {sign.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-4 pt-3">
                      <span
                        className={`mb-2 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs ${colors.badge}`}
                      >
                        {sign.category}
                      </span>
                      <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                        {sign.description}
                      </p>
                      <p className="mt-3 text-[11px] font-medium text-primary/80 opacity-0 transition-opacity group-hover:opacity-100">
                        View details →
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <Search className="mx-auto mb-4 h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">No signs found for &ldquo;{query}&rdquo;</p>
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
        {selectedSign && <SignModal sign={selectedSign} onClose={() => setSelectedSign(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
