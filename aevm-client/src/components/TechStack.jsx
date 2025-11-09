import React from "react";

const techs = ["React", "TailwindCSS", "Firebase", "Node.js", "Docker"];

export default function TechStack() {
  return (
    <section
      id="tech"
      className="py-20 bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {techs.map((tech, idx) => (
            <div
              key={idx}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl shadow-lg float font-semibold transform transition hover:scale-110 duration-500"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
