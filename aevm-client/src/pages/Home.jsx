// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-500 via-white to-green-500 text-gray-900 overflow-hidden relative select-none">
      {/* Glowing background orb */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.3)_0%,_transparent_70%)]"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />

      {/* Central Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold text-center text-blue-900 drop-shadow-lg tracking-wide leading-tight"
      >
        The <span className="text-orange-600">Advanced</span> <br />
        <span className="text-green-700">Electronic Voting System</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.2 }}
        className="text-center text-gray-700 text-lg md:text-xl mt-6 font-medium"
      >
        Secure • Transparent • Intelligent Democracy
      </motion.p>

      {/* Decorative Tricolor Line */}
      <motion.div
        className="w-56 h-1.5 mt-8 rounded-full bg-gradient-to-r from-orange-500 via-white to-green-500 shadow-lg"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.3, duration: 1.2 }}
      />

      {/* Buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-10 mt-16 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.2 }}
      >
        {/* Admin Dashboard */}
        <motion.button
          whileHover={{ backgroundColor: "#0A4B8B" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          className="px-10 py-4 bg-blue-700 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-blue-400/50 transition-all"
        >
          Admin Dashboard
        </motion.button>

        {/* Voter Management */}
        <motion.button
          whileHover={{ backgroundColor: "#137547" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/verify")}
          className="px-10 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-green-400/50 transition-all"
        >
          Voter Management
        </motion.button>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 px-6 max-w-6xl"
      >
        <FeatureCard
          title="AI-Powered Security"
          color="text-blue-900"
          desc="Intelligent algorithms safeguard data integrity and detect anomalies in real time."
        />
        <FeatureCard
          title="Transparent Voting Process"
          color="text-green-800"
          desc="Every vote recorded with end-to-end encryption and public transparency logs."
        />
        <FeatureCard
          title="Edge + Cloud Intelligence"
          color="text-orange-600"
          desc="Hybrid architecture enabling real-time processing and secure data storage."
        />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 0.3, duration: 1.2 }}
        className="absolute bottom-6 text-center text-gray-700 text-sm font-medium"
      >
        © 2025 AEVM India | “One Nation • One Vote • One Future”
      </motion.div>
    </div>
  );
}

/* Feature Card Component */
function FeatureCard({ title, desc, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/80 backdrop-blur-lg border border-gray-200 p-6 rounded-2xl shadow-md text-center"
    >
      <h3 className={`text-xl font-bold mb-2 ${color}`}>{title}</h3>
      <p className="text-gray-700 text-sm">{desc}</p>
    </motion.div>
  );
}
