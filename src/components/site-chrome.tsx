import { Link } from "@tanstack/react-router";
import { Sparkles, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/demo", label: "Live Demo" },
  { to: "/leads", label: "Leads Dashboard" },
] as const;

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="bg-gradient-brand text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-elegant">
        <Sparkles className="size-4.5" aria-hidden />
      </span>
      <span className="leading-none">
        <span className="font-display block text-lg font-bold tracking-tight">AIVANTA</span>
        <span className="text-muted-foreground block text-[10px] tracking-[0.18em] uppercase">
          AI Built for Business
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border/60 bg-background/70 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg px-3.5 py-2 text-sm font-medium transition-colors"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="brand" size="sm" className="hidden sm:inline-flex">
            <Link to="/demo">Try the assistant</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="border-border/60 border-t px-5 pb-4 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground block rounded-lg px-2 py-3 text-sm font-medium"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-border/60 mt-24 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="text-muted-foreground max-w-sm text-sm">
            AI Automation &amp; Solutions for Small Businesses. Aivanta AI Business Assistant
            v0.1 — admissions edition.
          </p>
        </div>
        <div className="text-muted-foreground space-y-1.5 text-sm">
          <p>hello@aivanta.ai</p>
          <p>Product demo · all data shown is fictional</p>
          <p className="text-xs">© {new Date().getFullYear()} Aivanta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "border-signal/40 bg-signal/10 text-signal inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
        className,
      )}
    >
      Demo data
    </span>
  );
}
