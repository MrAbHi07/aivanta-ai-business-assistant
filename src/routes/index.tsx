import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CalendarClock,
  ClipboardList,
  Clock,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  MessageSquareText,
  PhoneOff,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
  Users,
  Workflow,
} from "lucide-react";

import heroArt from "@/assets/hero.jpg";
import { AssistantChat } from "@/components/assistant-chat";
import { DemoBadge, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aivanta — AI Built for Business | AI Admission Assistant" },
      {
        name: "description",
        content:
          "Aivanta builds AI automation for small businesses. Meet the AI Admission Assistant: answers course, fee and batch questions 24/7, captures and qualifies leads automatically.",
      },
      { property: "og:title", content: "Aivanta — AI Built for Business" },
      {
        property: "og:description",
        content:
          "AI Automation & Solutions for Small Businesses. Try the live AI Admission Assistant demo for coaching institutes.",
      },
    ],
  }),
  component: Landing,
});

const PROBLEMS = [
  {
    icon: PhoneOff,
    title: "Missed enquiries",
    body: "60–70% of admission enquiries arrive after office hours or during class. Unanswered means lost.",
  },
  {
    icon: Clock,
    title: "Slow first response",
    body: "Parents shortlist 3–4 institutes. The one that replies first usually wins the seat.",
  },
  {
    icon: TrendingDown,
    title: "Leaky follow-up",
    body: "Enquiries live in notebooks, WhatsApp and memory. Nobody knows which lead is worth calling.",
  },
];

const SOLUTIONS = [
  {
    icon: Bot,
    title: "Always-on AI front desk",
    body: "Answers fees, batches, syllabus, scholarship and location questions instantly, in your tone.",
  },
  {
    icon: ClipboardList,
    title: "Structured lead capture",
    body: "Name, phone, course interest and joining timeline collected inside the conversation.",
  },
  {
    icon: BadgeCheck,
    title: "Automatic qualification",
    body: "Every enquiry is scored Hot / Warm / Cold so counsellors call the right parent first.",
  },
];

const FEATURES = [
  {
    icon: MessageSquareText,
    title: "Course & fee FAQ engine",
    body: "Grounded in your real course catalogue — no invented prices, no wrong batch timings.",
  },
  {
    icon: Users,
    title: "Human handoff",
    body: "Anyone can ask for a counsellor. The assistant collects details and escalates cleanly.",
  },
  {
    icon: Workflow,
    title: "Lead dashboard",
    body: "A single prioritised view of every enquiry, with score, intent and handoff status.",
  },
  {
    icon: PlugZap,
    title: "LLM-ready architecture",
    body: "v0.1 ships a deterministic engine; swap in a live model behind the same interface.",
  },
  {
    icon: CalendarClock,
    title: "24/7 availability",
    body: "Weekends, festivals, 2 AM — the assistant answers and books counselling calls.",
  },
  {
    icon: ShieldCheck,
    title: "Safe by design",
    body: "Answers stay inside your knowledge base and hand off whenever it isn't confident.",
  },
];

const STEPS = [
  { n: "01", t: "Visitor asks", d: "A parent opens the chat and asks about NEET fees or batch timings." },
  { n: "02", t: "AI answers", d: "The assistant replies instantly from your verified course knowledge base." },
  { n: "03", t: "Lead captured", d: "Name, phone, course interest and timeline are collected conversationally." },
  { n: "04", t: "Lead qualified", d: "Intent scoring marks the enquiry Hot, Warm or Cold." },
  { n: "05", t: "Human handoff", d: "High-intent leads are pushed to a counsellor for a 30-minute callback." },
];

const USE_CASES = [
  { icon: GraduationCap, t: "Coaching institutes", d: "Admissions, fees, batch and scholarship queries." },
  { icon: Stethoscope, t: "Clinics", d: "Appointment intake, service pricing and doctor availability." },
  { icon: Dumbbell, t: "Gyms & studios", d: "Membership plans, trial classes and joining offers." },
  { icon: Sparkles, t: "Salons & spas", d: "Service menus, slot booking and package upsells." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="bg-hero-glow relative overflow-hidden">
          <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
            <div>
              <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="size-3.5" aria-hidden /> Aivanta AI Business Assistant v0.1
              </span>
              <h1 className="font-display mt-6 text-4xl leading-[1.08] font-bold sm:text-5xl lg:text-6xl">
                AI Built for <span className="text-gradient-brand">Business.</span>
              </h1>
              <p className="text-muted-foreground mt-5 max-w-xl text-lg">
                AI Automation &amp; Solutions for Small Businesses. Our first product is an AI
                Admission Assistant that answers every enquiry instantly, captures the lead and
                tells your team exactly who to call first.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="brand" size="xl">
                  <Link to="/demo">
                    Try the live demo <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="subtle" size="xl">
                  <Link to="/leads">See captured leads</Link>
                </Button>
              </div>
              <dl className="border-border/60 mt-12 grid max-w-lg grid-cols-3 gap-6 border-t pt-6">
                {[
                  ["24/7", "Enquiry coverage"],
                  ["< 2 sec", "First response"],
                  ["100%", "Leads logged"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-display text-2xl font-bold">{v}</dt>
                    <dd className="text-muted-foreground text-xs">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <img
                src={heroArt}
                alt="Abstract visualisation of an AI conversation assistant"
                width={1600}
                height={1104}
                className="shadow-elegant border-border/60 w-full rounded-3xl border object-cover"
              />
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Why institutes lose admissions they already earned
              </h2>
              <div className="mt-7 space-y-5">
                {PROBLEMS.map((p) => (
                  <div key={p.title} className="flex gap-4">
                    <span className="bg-destructive/10 text-destructive flex size-10 shrink-0 items-center justify-center rounded-xl">
                      <p.icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                What the <span className="text-gradient-brand">Aivanta assistant</span> fixes
              </h2>
              <div className="mt-7 space-y-5">
                {SOLUTIONS.map((s) => (
                  <div key={s.title} className="glass-panel flex gap-4 rounded-2xl p-5">
                    <span className="bg-primary/12 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                      <s.icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Demo preview */}
        <section className="bg-surface/40 border-border/60 border-y">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <DemoBadge />
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">See it answer, right here</h2>
              <p className="text-muted-foreground mt-4">
                This is the real assistant running on a sample coaching institute — Sunrise
                Academy, Indore. Ask about fees, batches or scholarships, or say "book a
                counselling call" to watch the lead capture and qualification flow end to end.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Grounded answers from a real course catalogue",
                  "Conversational lead capture, no forms",
                  "Automatic Hot / Warm / Cold scoring",
                  "One-tap human handoff",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <BadgeCheck className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="brand" size="lg" className="mt-8">
                <Link to="/demo">
                  Open full demo <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <AssistantChat compact />
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Everything in version 0.1
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-center">
            A complete front-desk workflow — built to be deployed on your website in days, not
            months.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="glass-panel hover:border-primary/40 rounded-2xl p-6 transition-colors"
              >
                <span className="bg-gradient-brand text-primary-foreground flex size-10 items-center justify-center rounded-xl">
                  <f.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section className="bg-surface/40 border-border/60 border-y">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="text-2xl font-bold sm:text-3xl">How the workflow runs</h2>
            <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((s) => (
                <li key={s.n} className="glass-panel relative rounded-2xl p-5">
                  <span className="text-gradient-brand font-display text-2xl font-bold">
                    {s.n}
                  </span>
                  <h3 className="mt-2 font-semibold">{s.t}</h3>
                  <p className="text-muted-foreground mt-1.5 text-sm">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Use cases */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-2xl font-bold sm:text-3xl">Built for education first, not only</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            The same assistant core adapts to any small business that answers repetitive questions
            and books appointments.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((u) => (
              <article key={u.t} className="glass-panel rounded-2xl p-6">
                <u.icon className="text-primary size-6" aria-hidden />
                <h3 className="mt-4 font-semibold">{u.t}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{u.d}</p>
              </article>
            ))}
            <article className="glass-panel rounded-2xl p-6 sm:col-span-2 lg:col-span-4">
              <div className="flex items-start gap-3">
                <HeartPulse className="text-signal mt-0.5 size-5 shrink-0" aria-hidden />
                <p className="text-muted-foreground text-sm">
                  Roadmap: WhatsApp channel, CRM sync, multilingual replies (Hindi + English), and
                  a live LLM backend with retrieval over your own documents.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-8">
          <div className="bg-hero-glow border-border/60 shadow-elegant relative overflow-hidden rounded-3xl border p-10 text-center sm:p-16">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Put an AI front desk on your website
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
              Aivanta designs, builds and deploys the assistant for your institute — with your
              courses, your fees, your tone of voice.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="brand" size="xl">
                <Link to="/demo">
                  Try the assistant <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="subtle" size="xl">
                <a href="mailto:hello@aivanta.ai">Book a consultation</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
