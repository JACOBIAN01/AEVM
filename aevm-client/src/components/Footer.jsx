import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-4 md:mb-0">AEVM</div>
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="#" className="hover:text-white transition">
            Twitter
          </a>
          <a href="#" className="hover:text-white transition">
            LinkedIn
          </a>
          <a href="#" className="hover:text-white transition">
            GitHub
          </a>
        </div>
        <div>© 2025 AEVM. All rights reserved.</div>
      </div>
    </footer>
  );
}
