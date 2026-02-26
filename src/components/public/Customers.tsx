import Image from "next/image";
import { images } from "@/lib/images";

const customers = [
  { name: "Superior University", logo: images.customers.superiorUniversity },
  { name: "City College", logo: images.customers.cityCollege },
  { name: "Global Institute", logo: images.customers.globalInstitute },
];

export default function Customers() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900">Trusted by educational institutions</h3>
          <p className="text-sm text-gray-500">Deployed across campuses with measurable impact.</p>
        </div>

        <div className="flex items-center justify-center gap-8 flex-wrap bg-white rounded-2xl p-6 shadow-sm">
          {customers.map((c) => (
            <div key={c.name} className="flex items-center gap-3 p-2">
              <div className="w-20 h-10 sm:w-24 sm:h-12 relative">
                <Image src={c.logo} alt={c.name} fill className="object-contain" />
              </div>
              <div className="hidden sm:block text-sm text-gray-600">{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
