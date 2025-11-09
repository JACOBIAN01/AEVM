import React from "react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500"
    >
      <div className="text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeIn">
          Advanced Electronic Voting Machine
        </h1>
        <p className="text-lg md:text-2xl mb-8 animate-fadeIn delay-200">
          Secure, Transparent & Efficient Voting System
        </p>
        <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg float transition duration-500">
          Get Started
        </button>
      </div>
    </section>
  );
}
