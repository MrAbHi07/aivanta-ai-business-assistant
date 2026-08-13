import { useCallback, useEffect, useState } from "react";
import { SAMPLE_LEADS, type Lead } from "./demo-data";

const KEY = "aivanta.demo.leads.v1";

function read(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Lead[]) : [];
  } catch {
    return [];
  }
}

function write(leads: Lead[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(leads));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("aivanta-leads-changed"));
}

export function addLead(lead: Lead) {
  if (typeof window === "undefined") return;
  write([lead, ...read()]);
}

export function clearCapturedLeads() {
  if (typeof window === "undefined") return;
  write([]);
}

/** Captured demo leads plus the seeded sample set. Hydration-safe. */
export function useLeads() {
  const [captured, setCaptured] = useState<Lead[]>([]);

  const sync = useCallback(() => setCaptured(read()), []);

  useEffect(() => {
    sync();
    window.addEventListener("aivanta-leads-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("aivanta-leads-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return { leads: [...captured, ...SAMPLE_LEADS], capturedCount: captured.length };
}
