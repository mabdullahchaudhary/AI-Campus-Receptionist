"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "site_stage_dismissed_v1";

export default function SiteStagePopup() {
  const [visible, setVisible] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        const t = setTimeout(() => setVisible(true), 700);
        return () => clearTimeout(t);
      }
    } catch (e) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => {
    if (dontShow) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch (e) {
        // ignore
      }
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={close} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl ring-1 ring-black/5 dark:ring-white/5 overflow-hidden">
        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-violet-600 to-indigo-600">
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" fill="#FFFFFF" />
            </svg>
          </div>
          <div className="flex-1 text-white">
            <h3 className="text-lg sm:text-xl font-semibold">Prototype Notice — Initial Stage</h3>
            <p className="text-sm opacity-90 mt-1">Some features are under active development and may change. Thank you for testing our prototype.</p>
          </div>

          <button onClick={close} aria-label="Close" className="text-white/90 hover:text-white ml-2 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            This website is currently an early-stage prototype of the Superior AI Receptionist. You may encounter incomplete features, changing copy, or experimental integrations. We appreciate your feedback — please report issues via an issue or contact email.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <a href="https://github.com/mabdullahchaudhary/AI-Campus-Receptionist" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-sm hover:scale-[1.01] transition-transform">
                View Source Code
              </a>
              <a href="https://abdullahchaudhary.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-white border-gray-200 dark:text-black dark:border-gray-700 text-sm">
                Developer Profile
              </a>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input type="checkbox" className="w-4 h-4 rounded-md border-gray-300 dark:border-gray-600" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} />
                <span>Don't show again</span>
              </label>
              <button onClick={close} className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-medium dark:text-white">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
