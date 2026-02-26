import Image from "next/image";
import { images } from "@/lib/images";

const outlets = [
  { name: "TechDaily", logo: images.press.techDaily },
  { name: "EduNews", logo: images.press.eduNews },
  { name: "AIWeekly", logo: images.press.aiWeekly },
];

export default function PressSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold">In the press</h3>
          <p className="text-sm text-gray-500">Recent coverage and mentions.</p>
        </div>

        <div className="flex items-center justify-center gap-8 flex-wrap bg-white rounded-2xl p-6 shadow-sm">
          {outlets.map((o) => (
            <div key={o.name} className="w-28 h-12 sm:w-32 sm:h-14 relative opacity-80 hover:opacity-100 transition-opacity">
              <Image src={o.logo} alt={o.name} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
