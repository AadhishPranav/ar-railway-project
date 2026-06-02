import { Cpu, ShieldCheck, Train } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090d1a]/70 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Train className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold tracking-tight">RailAR Intelligence</p>
            <p className="text-xs text-muted-foreground">AI-Driven Railway Sign Interpretation</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="inline-flex items-center gap-1">
            <Cpu className="h-3.5 w-3.5" />
            Real-time AI
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Safety-first design
          </span>
        </div>
      </div>
    </footer>
  );
}
