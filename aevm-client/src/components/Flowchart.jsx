import React from "react";

export default function Flowchart() {
  return (
    <section id="flowchart" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Voting Flowchart
        </h2>
        <div className="flex flex-col md:flex-row justify-around items-center space-y-6 md:space-y-0 md:space-x-6">
          {[
            "Voter Verification",
            "Ballot Casting",
            "Counting",
            "Result Declaration",
          ].map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg text-center transform transition hover:scale-105 duration-500"
            >
              <div className="text-indigo-500 text-3xl font-bold mb-2">
                {idx + 1}
              </div>
              <h3 className="font-semibold">{step}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
