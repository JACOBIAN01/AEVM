import React from "react";

const services = [
  {
    title: "Secure Voting",
    desc: "End-to-end encryption ensures every vote is secure.",
    icon: "🔒",
  },
  {
    title: "Real-Time Results",
    desc: "Live counting and monitoring in real-time.",
    icon: "📊",
  },
  {
    title: "Biometric Authentication",
    desc: "Fingerprints ensure only registered voters cast votes.",
    icon: "🖐️",
  },
];

export default function OurService() {
  return (
    <section id="services" className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg transform transition hover:scale-105 duration-500"
            >
              <div className="text-5xl mb-4 float">{s.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
