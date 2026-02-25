"use client";

import { motion } from "framer-motion";

const studies = [
  {
    title: "Reduced call wait time by 65%",
    institution: "Superior University",
    summary: "Implemented AI receptionist on admissions line — decreased wait time and improved lead capture.",
  },
  {
    title: "Automated 24/7 student support",
    institution: "City College",
    summary: "Handled frequently asked queries and appointment scheduling without human agents overnight.",
  },
  {
    title: "Increased demo bookings by 42%",
    institution: "Global Institute",
    summary: "Embedded widget on landing pages and converted visitors into qualified demos.",
  },
];

export default function CaseStudies() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-extrabold">Case Studies</h3>
          <p className="text-sm text-gray-500">Real results from institutions using Superior AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studies.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow h-full"
            >
              <h4 className="text-lg font-semibold text-gray-900">{s.title}</h4>
              <p className="text-sm text-gray-500 mt-2">{s.summary}</p>
              <div className="mt-4 text-xs text-violet-600 font-semibold">{s.institution}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
