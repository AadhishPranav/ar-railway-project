import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Train, Scan, Library, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Train },
    { name: "Scanner", path: "/scanner", icon: Scan },
    { name: "Library", path: "/library", icon: Library },
    { name: "About", path: "/about", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090d1a]/80 shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary transition-colors group-hover:bg-primary/30">
              <Train className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight text-lg text-primary">RailAR</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  location === item.path
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-primary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:bg-primary/20"
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#090d1a]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors ${
                  location === item.path
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-primary"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
