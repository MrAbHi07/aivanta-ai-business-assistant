import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, PhoneCall, Trash2, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { DemoBadge, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearCapturedLeads, useLeads } from "@/lib/leads-store";
import type { Lead } from "@/lib/demo-data";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Leads Dashboard | Aivanta AI Business Assistant" },
      {
        name: "description",
        content:
          "Demo overview of leads captured and qualified by the Aivanta AI assistant, with scoring, intent timeline and handoff status.",
      },
      { property: "og:title", content: "Leads Dashboard | Aivanta AI Business Assistant" },
      {
        property: "og:description",
        content: "See how AI-captured admission leads are scored and prioritised.",
      },
    ],
  }),
  component: LeadsPage,
});

const FILTERS = ["All", "Hot", "Warm", "Cold"] as const;

function qualityClass(q: Lead["quality"]) {
  if (q === "Hot") return "bg-destructive/15 text-destructive border-destructive/30";
  if (q === "Warm") return "bg-signal/15 text-signal border-signal/30";
  return "bg-secondary text-muted-foreground border-border";
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </p>
        <Icon className="text-primary size-4" aria-hidden />
      </div>
      <p className="font-display mt-3 text-3xl font-bold">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
    </div>
  );
}

function LeadsPage() {
  const { leads, capturedCount } = useLeads();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const shown = useMemo(
    () => (filter === "All" ? leads : leads.filter((l) => l.quality === filter)),
    [leads, filter],
  );

  const hot = leads.filter((l) => l.quality === "Hot").length;
  const avg = leads.length
    ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length)
    : 0;
  const handoffs = leads.filter((l) => l.handoff).length;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <DemoBadge />
              <span className="text-muted-foreground text-xs">
                Seeded sample records + leads you capture in the live demo
              </span>
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">Leads Dashboard</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Every conversation the assistant handles becomes a structured, scored record your
              counselling team can action in priority order.
            </p>
          </div>
          <Button asChild variant="brand">
            <Link to="/demo">
              Capture a new lead <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={Users}
            label="Total leads"
            value={String(leads.length)}
            hint={`${capturedCount} captured in this session`}
          />
          <Stat icon={Flame} label="Hot leads" value={String(hot)} hint="Score 80 and above" />
          <Stat icon={TrendingUp} label="Avg. score" value={`${avg}`} hint="Out of 100" />
          <Stat
            icon={PhoneCall}
            label="Human handoffs"
            value={String(handoffs)}
            hint="Escalated to a counsellor"
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter leads by quality">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  filter === f
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          {capturedCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={clearCapturedLeads}>
              <Trash2 className="size-3.5" /> Clear session leads
            </Button>
          ) : null}
        </div>

        <div className="glass-panel shadow-card mt-5 overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <caption className="sr-only">Leads captured by the AI assistant</caption>
              <thead className="bg-surface-2/60 text-muted-foreground text-left text-xs uppercase">
                <tr>
                  {["Lead", "Contact", "Course interest", "Timeline", "Source", "Score", "Status"].map(
                    (h) => (
                      <th key={h} scope="col" className="px-4 py-3 font-semibold tracking-wide">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => (
                  <tr key={l.id} className="border-border/60 hover:bg-surface-2/40 border-t">
                    <td className="px-4 py-3">
                      <p className="font-medium">{l.name}</p>
                      <p className="text-muted-foreground text-xs">{l.id}</p>
                    </td>
                    <td className="text-muted-foreground px-4 py-3">{l.phone}</td>
                    <td className="px-4 py-3">{l.courseName}</td>
                    <td className="text-muted-foreground px-4 py-3">{l.timeline}</td>
                    <td className="text-muted-foreground px-4 py-3">{l.source}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-secondary h-1.5 w-16 overflow-hidden rounded-full">
                          <div
                            className="bg-gradient-brand h-full rounded-full"
                            style={{ width: `${l.score}%` }}
                          />
                        </div>
                        <span className="tabular-nums">{l.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                            qualityClass(l.quality),
                          )}
                        >
                          {l.quality}
                        </span>
                        {l.handoff ? (
                          <span className="border-primary/30 bg-primary/10 text-primary rounded-full border px-2 py-0.5 text-[11px] font-semibold">
                            Handoff
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
                {shown.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-muted-foreground px-4 py-10 text-center">
                      No leads match this filter.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-muted-foreground mt-4 text-xs">
          Demo note: session leads are stored locally in your browser only. In production these
          sync to your CRM, Google Sheet or WhatsApp workflow.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
