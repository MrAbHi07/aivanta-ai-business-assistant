/**
 * DEMO / MOCK DATA
 * Sample coaching-institute knowledge base used by the deterministic chat engine.
 * Replace with real CMS/DB content when going live.
 */

export const INSTITUTE = {
  name: "Sunrise Academy",
  city: "Indore",
  phone: "+91 98765 43210",
  email: "admissions@sunriseacademy.demo",
  hours: "Mon–Sat, 9:00 AM – 7:00 PM",
  counsellor: "Ms. Priya Sharma",
};

export type Course = {
  id: string;
  name: string;
  aliases: string[];
  duration: string;
  fees: string;
  emi: string;
  batches: string[];
  mode: string;
  highlight: string;
};

export const COURSES: Course[] = [
  {
    id: "jee",
    name: "JEE Main + Advanced (2-Year)",
    aliases: ["jee", "iit", "engineering", "jee advanced", "jee main"],
    duration: "24 months",
    fees: "₹1,48,000 total",
    emi: "4 instalments of ₹37,000",
    batches: ["Morning 7:00–10:00 AM", "Evening 4:30–7:30 PM"],
    mode: "Classroom + recorded backup",
    highlight: "Weekly full-syllabus mock tests with AIR-style ranking",
  },
  {
    id: "neet",
    name: "NEET UG Crash Course",
    aliases: ["neet", "medical", "mbbs", "biology", "crash"],
    duration: "5 months",
    fees: "₹64,000 total",
    emi: "2 instalments of ₹32,000",
    batches: ["Morning 8:00–11:00 AM", "Weekend Intensive Sat–Sun"],
    mode: "Classroom + live online",
    highlight: "12,000+ NCERT-mapped MCQs and daily doubt clinic",
  },
  {
    id: "foundation",
    name: "Class 9–10 Foundation",
    aliases: ["foundation", "class 9", "class 10", "school", "board"],
    duration: "12 months",
    fees: "₹42,000/year",
    emi: "3 instalments of ₹14,000",
    batches: ["After-school 5:00–7:00 PM"],
    mode: "Classroom",
    highlight: "Board + olympiad prep in one track",
  },
  {
    id: "commerce",
    name: "CA Foundation",
    aliases: ["ca", "commerce", "accounts", "ca foundation"],
    duration: "8 months",
    fees: "₹55,000 total",
    emi: "2 instalments of ₹27,500",
    batches: ["Evening 6:00–8:30 PM", "Weekend Batch"],
    mode: "Live online + classroom",
    highlight: "Mock exams evaluated by practising CAs",
  },
];

export const SCHOLARSHIP =
  "Scholarships up to 40% are available through the Sunrise Talent Test held every Sunday. Siblings and repeat students get an additional 5% off.";

export const LOCATION_INFO = `Our campus is at 42 Vijay Nagar, ${INSTITUTE.city}. Counselling desk is open ${INSTITUTE.hours}.`;

export type Lead = {
  id: string;
  name: string;
  phone: string;
  courseId: string;
  courseName: string;
  timeline: string;
  score: number;
  quality: "Hot" | "Warm" | "Cold";
  source: string;
  createdAt: string;
  handoff: boolean;
};

/** Seeded sample leads — clearly labelled as demo data in the UI. */
export const SAMPLE_LEADS: Lead[] = [
  {
    id: "LD-1042",
    name: "Rohan Mehta",
    phone: "+91 90000 11223",
    courseId: "jee",
    courseName: "JEE Main + Advanced (2-Year)",
    timeline: "This month",
    score: 92,
    quality: "Hot",
    source: "Website chat",
    createdAt: "2026-08-12T10:24:00Z",
    handoff: true,
  },
  {
    id: "LD-1041",
    name: "Ananya Gupta",
    phone: "+91 90111 44556",
    courseId: "neet",
    courseName: "NEET UG Crash Course",
    timeline: "This month",
    score: 86,
    quality: "Hot",
    source: "Instagram DM",
    createdAt: "2026-08-12T08:05:00Z",
    handoff: false,
  },
  {
    id: "LD-1040",
    name: "Imran Qureshi",
    phone: "+91 93222 77889",
    courseId: "commerce",
    courseName: "CA Foundation",
    timeline: "Next 3 months",
    score: 64,
    quality: "Warm",
    source: "Website chat",
    createdAt: "2026-08-11T17:41:00Z",
    handoff: false,
  },
  {
    id: "LD-1039",
    name: "Sneha Patil",
    phone: "+91 98444 22110",
    courseId: "foundation",
    courseName: "Class 9–10 Foundation",
    timeline: "Just exploring",
    score: 38,
    quality: "Cold",
    source: "WhatsApp",
    createdAt: "2026-08-10T13:12:00Z",
    handoff: false,
  },
  {
    id: "LD-1038",
    name: "Kabir Sethi",
    phone: "+91 99887 66554",
    courseId: "jee",
    courseName: "JEE Main + Advanced (2-Year)",
    timeline: "Next 3 months",
    score: 71,
    quality: "Warm",
    source: "Google Ads",
    createdAt: "2026-08-09T11:30:00Z",
    handoff: true,
  },
];
