"use client";

import { useEffect, useState } from "react";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export default function AnimatedCounters() {
  const calls = useCountUp(124512, 1400);
  const campuses = useCountUp(87, 1200);
  const languages = useCountUp(12, 1000);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">{calls.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">Calls handled</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">{campuses}</p>
            <p className="text-sm text-gray-500 mt-2">Campuses deployed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">{languages}+</p>
            <p className="text-sm text-gray-500 mt-2">Supported languages</p>
          </div>
        </div>
      </div>
    </section>
  );
}
