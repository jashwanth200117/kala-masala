import React from "react";

export default function TrustStats() {
  const stats = [
    { label: "Orders delivered", value: "12k+" },
    { label: "Repeat customers", value: "4.5k+" },
    { label: "Average rating", value: "4.8/5" },
  ];

  return (
    <section className="mt-12 bg-white rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {stats.map(s => (
          <div key={s.label} className="px-4">
            <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
            <div className="mt-1 text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
