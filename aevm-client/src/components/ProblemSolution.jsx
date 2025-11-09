import React from "react";

const problems = [
  {
    title: "Manual Errors",
    desc: "Traditional voting is error-prone and slow.",
    icon: "⚠️",
  },
  {
    title: "Fraud Detection",
    desc: "AEVM ensures transparency and security.",
    icon: "🛡️",
  },
  {
    title: "Accessibility",
    desc: "Easy to use for voters of all demographics.",
    icon: "👥",
  },
];

export default function ProblemSolution() {
  return (
    <section id="solution" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Problems We Solve
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, idx) => (
            <div
              key={idx}
              className="bg-indigo-50 p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:translate-y-[-5px] duration-500"
            >
              <div className="text-5xl mb-4 float">{p.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-gray-700">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
