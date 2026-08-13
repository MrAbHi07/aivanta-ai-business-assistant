import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Gauge, Sparkles } from "lucide-react";
import { useState } from "react";

import { AssistantChat } from "@/components/assistant-chat";
import { DemoBadge, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { COURSES, INSTITUTE, type Lead } from "@/lib/demo-data";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Live AI Admission Assistant Demo | Aivanta" },
      {
        name: "description",
        content:
          "Try the Aivanta AI Business Assistant: answers course, fee and batch questions, captures leads and qualifies them in real time.",
      },
      { property: "og:title", content: "Live AI Admission Assistant Demo | Aivanta" },
      {
        property: "og:description",
        content:
          "An interactive demo of Aivanta's AI admission assistant for coaching institutes.",
      },
    ],
  }),
  component: DemoPage,
});

const SCRIPTS = [
  "What courses do you offer?",
  "How much are the NEET fees?",
  "What are the JEE batch timings?",
  "Do you offer scholarships?",
  "I want to book a counselling call",
  "Can I talk to a human counsellor?",
];

function DemoPage() {
  const [lead, setLead] = useState<Lead | null>(null);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <DemoBadge />
          <span className="text-muted-foreground text-xs">
            Sample institute: {INSTITUTE.name}, {INSTITUTE.city} — fictional data
          </span>
        </div>

        <h1 className="max-w-3xl text-3xl font-bold sm:text-4xl">
          The <span className="text-gradient-brand">AI Admission Assistant</span>, live
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Ask anything a parent or student would ask. The assistant answers from the institute
          knowledge base, then captures and qualifies the lead — no human involved until handoff.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <AssistantChat onLead={setLead} />

          <div className="space-y-6">
            <section className="glass-panel rounded-2xl p-5">
              <h2 className="text-sm font-semibold tracking-wide uppercase">Try asking</h2>
              <ul className="mt-3 space-y-2">
                {SCRIPTS.map((s) => (
                  <li key={s} className="text-muted-foreground flex gap-2 text-sm">
                    <Sparkles className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className="glass-panel rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide uppercase">Lead capture</h2>
                <Gauge className="text-primary size-4" aria-hidden />
              </div>
              {lead ? (
                <dl className="mt-4 space-y-2.5 text-sm">
                  {[
                    ["Lead ID", lead.id],
                    ["Name", lead.name],
                    ["Phone", lead.phone],
                    ["Course", lead.courseName],
                    ["Timeline", lead.timeline],
                    ["Score", `${lead.score}/100 · ${lead.quality}`],
                    ["Human handoff", lead.handoff ? "Requested" : "Not requested"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                  <Button asChild variant="brand" className="mt-3 w-full">
                    <Link to="/leads">
                      View on leads dashboard <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </dl>
              ) : (
                <p className="text-muted-foreground mt-3 text-sm">
                  Complete a booking in the chat ("I want to book a counselling call") and the
                  captured, scored lead appears here in real time.
                </p>
              )}
            </section>

            <section className="glass-panel rounded-2xl p-5">
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                Knowledge base loaded
              </h2>
              <ul className="mt-3 space-y-2">
                {COURSES.map((c) => (
                  <li key={c.id} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="text-success mt-0.5 size-3.5 shrink-0" aria-hidden />
                    <span>
                      {c.name}
                      <span className="text-muted-foreground block text-xs">
                        {c.duration} · {c.fees}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-4 text-xs">
                v0.1 runs on a deterministic local response engine — no external API keys needed.
                The same interface swaps to a live LLM without UI changes.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
