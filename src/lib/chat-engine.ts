/**
 * Deterministic mock response engine for the Aivanta AI Business Assistant demo.
 *
 * INTEGRATION NOTE
 * ----------------
 * This module exposes a single async entry point `generateReply()` with the same
 * shape a real LLM call would have (async, message history in, message out).
 * To move to a live model, replace the body of `generateReply` with a call to a
 * server function that hits your LLM provider, keeping the `AssistantTurn`
 * contract intact. Everything else in the app stays unchanged.
 */

import {
  COURSES,
  INSTITUTE,
  LOCATION_INFO,
  SCHOLARSHIP,
  type Course,
  type Lead,
} from "./demo-data";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  quickReplies?: string[];
  createdAt: number;
};

export type CaptureStage =
  | "idle"
  | "ask_name"
  | "ask_phone"
  | "ask_course"
  | "ask_timeline"
  | "done";

export type ChatState = {
  stage: CaptureStage;
  draft: { name?: string; phone?: string; courseId?: string; timeline?: string };
  handoff: boolean;
};

export type AssistantTurn = {
  reply: string;
  quickReplies?: string[];
  state: ChatState;
  lead?: Lead;
};

export const initialState: ChatState = { stage: "idle", draft: {}, handoff: false };

export const WELCOME =
  `Hi! I'm the AI admission assistant for **${INSTITUTE.name}** (demo institute).\n\n` +
  `I can answer questions about courses, fees, batch timings and scholarships — or connect you with a human counsellor.\n\nWhat would you like to know?`;

export const WELCOME_QUICK = [
  "What courses do you offer?",
  "JEE fees and batches",
  "Scholarship options",
  "Talk to a counsellor",
];

const norm = (s: string) => s.toLowerCase().trim();

function findCourse(text: string): Course | undefined {
  const t = norm(text);
  return COURSES.find((c) => c.aliases.some((a) => t.includes(a)) || t.includes(norm(c.name)));
}

function courseCard(c: Course): string {
  return (
    `**${c.name}**\n` +
    `• Duration: ${c.duration}\n` +
    `• Fees: ${c.fees} (${c.emi})\n` +
    `• Batches: ${c.batches.join(" | ")}\n` +
    `• Mode: ${c.mode}\n` +
    `• Why students pick it: ${c.highlight}`
  );
}

function extractPhone(text: string): string | undefined {
  const digits = text.replace(/[^\d]/g, "");
  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
  }
  return undefined;
}

function extractName(text: string): string {
  const cleaned = text
    .replace(/^(hi|hello|hey)\b/i, "")
    .replace(/\b(my name is|i am|i'm|this is|name)\b/gi, "")
    .replace(/[^A-Za-z\s.'-]/g, "")
    .trim();
  const words = cleaned.split(/\s+/).filter(Boolean).slice(0, 3);
  const name = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return name || "Guest";
}

function scoreLead(timeline: string, hasCourse: boolean, handoff: boolean): number {
  let score = 30;
  const t = norm(timeline);
  if (t.includes("month") && t.includes("this")) score += 45;
  else if (t.includes("3")) score += 28;
  else if (t.includes("explor")) score += 4;
  else score += 18;
  if (hasCourse) score += 14;
  if (handoff) score += 10;
  return Math.max(5, Math.min(99, score));
}

function quality(score: number): Lead["quality"] {
  if (score >= 80) return "Hot";
  if (score >= 55) return "Warm";
  return "Cold";
}

const TIMELINES = ["This month", "Next 3 months", "Just exploring"];

function buildLead(state: ChatState): Lead {
  const course = COURSES.find((c) => c.id === state.draft.courseId);
  const score = scoreLead(state.draft.timeline ?? "", Boolean(course), state.handoff);
  return {
    id: `LD-${Math.floor(2000 + Math.random() * 7999)}`,
    name: state.draft.name ?? "Guest",
    phone: state.draft.phone ?? "—",
    courseId: course?.id ?? "unknown",
    courseName: course?.name ?? "Not specified",
    timeline: state.draft.timeline ?? "Not specified",
    score,
    quality: quality(score),
    source: "Website chat",
    createdAt: new Date().toISOString(),
    handoff: state.handoff,
  };
}

function faqAnswer(text: string): { reply: string; quick?: string[] } | null {
  const t = norm(text);

  if (/(course|program|batch list|what.*offer|streams?)/.test(t) && !findCourse(t)) {
    return {
      reply:
        `We currently run four programmes:\n\n` +
        COURSES.map((c) => `• **${c.name}** — ${c.duration}, ${c.fees}`).join("\n") +
        `\n\nWhich one should I break down for you?`,
      quick: COURSES.map((c) => c.name.split(" (")[0] ?? c.name),
    };
  }

  const course = findCourse(t);
  if (course) {
    if (/fee|cost|price|charge|emi|instal/.test(t)) {
      return {
        reply: `**${course.name}** fees are ${course.fees}, payable as ${course.emi}.\n\n${SCHOLARSHIP}`,
        quick: ["Batch timings", "Book a counselling call", "Scholarship options"],
      };
    }
    if (/batch|timing|schedule|time|slot/.test(t)) {
      return {
        reply: `**${course.name}** runs these batches:\n${course.batches
          .map((b) => `• ${b}`)
          .join("\n")}\n\nMode: ${course.mode}.`,
        quick: ["Fees for this course", "Book a counselling call"],
      };
    }
    return { reply: courseCard(course), quick: ["Book a counselling call", "Scholarship options"] };
  }

  if (/fee|cost|price|charge|emi/.test(t)) {
    return {
      reply:
        `Here's the current fee structure:\n\n` +
        COURSES.map((c) => `• **${c.name}** — ${c.fees} (${c.emi})`).join("\n") +
        `\n\n${SCHOLARSHIP}`,
      quick: ["Book a counselling call", "Batch timings", "Scholarship options"],
    };
  }
  if (/scholar|discount|concession|waiver/.test(t)) {
    return { reply: SCHOLARSHIP, quick: ["Book a counselling call", "What courses do you offer?"] };
  }
  if (/where|address|location|campus|near/.test(t)) {
    return { reply: LOCATION_INFO, quick: ["Book a counselling call"] };
  }
  if (/timing|open|hours|when.*open/.test(t)) {
    return { reply: `Our counselling desk is open ${INSTITUTE.hours}.`, quick: ["Book a counselling call"] };
  }
  if (/demo class|trial|free class/.test(t)) {
    return {
      reply: `Yes — every programme includes two free trial classes before you enrol. I can reserve a seat for you.`,
      quick: ["Book a counselling call"],
    };
  }
  if (/hostel|transport|bus/.test(t)) {
    return {
      reply: `We partner with two verified hostels within 1 km of campus, and a shuttle covers 6 routes across ${INSTITUTE.city}. Fees are separate from tuition.`,
      quick: ["Book a counselling call"],
    };
  }
  if (/refund|cancel/.test(t)) {
    return {
      reply: `Full refund minus ₹2,000 admin fee if you withdraw within 15 days of joining. After that, refunds are prorated by month.`,
    };
  }
  if (/^(hi|hello|hey|namaste|good (morning|evening|afternoon))/.test(t)) {
    return { reply: `Hello! Happy to help. Ask me about courses, fees, batches or scholarships.`, quick: WELCOME_QUICK };
  }
  if (/thank|thanks|ok|great|cool/.test(t)) {
    return { reply: `Glad that helped! Anything else I can check for you?`, quick: WELCOME_QUICK };
  }
  return null;
}

const wantsHuman = (t: string) =>
  /(human|counsel|call me|talk to|speak|agent|person|contact|admission officer)/.test(norm(t));
const wantsCapture = (t: string) =>
  /(book|enrol|enroll|admission|apply|register|join|callback|reserve|seat)/.test(norm(t));

/** Simulates model latency so the demo feels like a real assistant. */
const think = () => new Promise((r) => setTimeout(r, 420 + Math.random() * 380));

export async function generateReply(userText: string, state: ChatState): Promise<AssistantTurn> {
  await think();
  const s: ChatState = { ...state, draft: { ...state.draft } };

  // Active capture flow takes priority.
  if (s.stage === "ask_name") {
    s.draft.name = extractName(userText);
    s.stage = "ask_phone";
    return {
      reply: `Thanks, ${s.draft.name}. What's the best mobile number for our counsellor to reach you on?`,
      state: s,
    };
  }

  if (s.stage === "ask_phone") {
    const phone = extractPhone(userText);
    if (!phone) {
      return {
        reply: `That doesn't look like a complete number. Could you share a 10-digit mobile number?`,
        state: s,
      };
    }
    s.draft.phone = phone;
    s.stage = "ask_course";
    return {
      reply: `Got it. Which programme are you interested in?`,
      quickReplies: COURSES.map((c) => c.name.split(" (")[0] ?? c.name),
      state: s,
    };
  }

  if (s.stage === "ask_course") {
    const course = findCourse(userText);
    if (course) s.draft.courseId = course.id;
    s.stage = "ask_timeline";
    return {
      reply: course
        ? `${course.name} — great choice. When are you planning to start?`
        : `Noted. When are you planning to start?`,
      quickReplies: TIMELINES,
      state: s,
    };
  }

  if (s.stage === "ask_timeline") {
    const t = norm(userText);
    s.draft.timeline =
      TIMELINES.find((x) => t.includes(norm(x).split(" ")[0] ?? norm(x))) ??
      (t.includes("explor") ? "Just exploring" : "This month");
    s.stage = "done";
    const lead = buildLead(s);
    return {
      reply:
        `You're all set, ${lead.name}.\n\n` +
        `**Lead ${lead.id} created** — ${lead.courseName}, ${lead.timeline}.\n` +
        `Qualification score: **${lead.score}/100 (${lead.quality})**.\n\n` +
        (lead.quality === "Hot"
          ? `Because this is a high-intent enquiry, ${INSTITUTE.counsellor} has been notified and will call you within 30 minutes.`
          : `${INSTITUTE.counsellor} will reach out during working hours (${INSTITUTE.hours}).`) +
        `\n\n_Demo note: this lead now appears on the Leads dashboard._`,
      quickReplies: ["Ask another question", "Talk to a counsellor"],
      state: s,
      lead,
    };
  }

  // Idle / done: answer FAQs, or start capture.
  if (wantsHuman(userText)) {
    s.handoff = true;
    s.stage = "ask_name";
    return {
      reply: `Of course — I'll hand you to ${INSTITUTE.counsellor}, our senior admission counsellor.\n\nFirst, may I have your name?`,
      state: s,
    };
  }

  if (wantsCapture(userText)) {
    s.stage = "ask_name";
    return {
      reply: `Happy to arrange that. Let me take a few quick details.\n\nWhat's your name?`,
      state: s,
    };
  }

  const faq = faqAnswer(userText);
  if (faq) {
    return faq.quick
      ? { reply: faq.reply, quickReplies: faq.quick, state: s }
      : { reply: faq.reply, state: s };
  }

  return {
    reply:
      `I don't have that in my knowledge base yet, but a counsellor definitely will.\n\n` +
      `I can help with courses, fees, batch timings, scholarships, location, trial classes and refunds — or book you a callback.`,
    quickReplies: ["Book a counselling call", "What courses do you offer?", "Scholarship options"],
    state: s,
  };
}
