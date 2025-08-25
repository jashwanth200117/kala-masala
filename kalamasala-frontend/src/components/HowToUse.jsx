import React from "react";

export default function HowToUse() {
  const steps = [
    { title: "Add to Curries", desc: "Add 1–2 tsp while cooking for a rich, roasted flavour." },
    { title: "Marinate Meats", desc: "Use as a dry rub for chicken or kebabs." },
    { title: "Finish with Ghee", desc: "A dash of ghee at the end brings out aroma." },
  ];

  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold mb-4">How to use Kala Masala</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {steps.map(s => (
          <div key={s.title} className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-lg font-semibold text-gray-800">{s.title}</div>
            <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
