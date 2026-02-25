"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", calls: 2400 },
  { month: "Feb", calls: 3000 },
  { month: "Mar", calls: 3200 },
  { month: "Apr", calls: 4100 },
  { month: "May", calls: 4800 },
  { month: "Jun", calls: 5200 },
  { month: "Jul", calls: 6100 },
];

export default function BusinessStats() {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Platform usage</h3>
          <p className="text-sm text-gray-500">Monthly handled calls — trending upwards as institutions adopt our widget.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-gray-900">+28%</p>
          <p className="text-sm text-gray-500">vs last 90 days</p>
        </div>
      </div>

      <div className="w-full h-56 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Area type="monotone" dataKey="calls" stroke="#7c3aed" fill="url(#colorCalls)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
