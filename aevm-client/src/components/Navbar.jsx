import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="text-2xl font-bold text-indigo-600">AEVM</div>
        <div className="hidden md:flex space-x-6">
          {["Home", "Services", "Solution", "Flowchart", "Tech", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
