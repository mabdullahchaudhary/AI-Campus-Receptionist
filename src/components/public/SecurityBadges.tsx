import { ShieldCheck } from "lucide-react";

const badges = [
  { title: "ISO 27001 Ready", subtitle: "Security best-practices" },
  { title: "GDPR Compliance", subtitle: "Data protection" },
  { title: "Encrypted", subtitle: "TLS & at-rest encryption" },
];

export default function SecurityBadges() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {badges.map((b) => (
            <div key={b.title} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-50 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{b.title}</div>
                <div className="text-xs text-gray-500">{b.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
