import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Images
import akshatImg from "../assets/akshat.jpg";
import kunalImg from "../assets/kunal.jpg";

// Components
import Header from "../components/Header";
import TotalVotes from "../components/TotalVotes";
import CandidateTable from "../components/CandidateTable";
import PieChartCard from "../components/PieChartCard";
import BarChartCard from "../components/BarChartCard";
import LineChartCard from "../components/LineChartCard";
import AreaChartCard from "../components/AreaChartCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [votes, setVotes] = useState({ Akhshat: 0, Kunal: 0 });
  const constituency = "Vijaywada";

  // Modal states
  const [showModal, setShowModal] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "votes", constituency),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setVotes({
            Akhshat: data.Akhshat || 0,
            Kunal: data.Kunal || 0,
          });
        }
      },
      (err) => console.error("Firestore Error:", err)
    );
    return () => unsubscribe();
  }, []);

  const totalVotes = votes.Akhshat + votes.Kunal;
  const getPercent = (count) =>
    totalVotes ? ((count / totalVotes) * 100).toFixed(1) : 0;

  const candidates = [
    { name: "Akshat Pratap Singh", key: "Akhshat", img: akshatImg },
    { name: "Kunal Bajantri", key: "Kunal", img: kunalImg },
  ];

  const chartData = candidates.map((c) => ({
    name: c.name,
    votes: votes[c.key],
  }));

  const COLORS = ["#f97316", "#2563eb", "#16a34a", "#9333ea", "#e11d48"];

  const handleAccess = () => {
    const correctPassword = "admin123";
    if (password === correctPassword) {
      setShowModal(false);
      setError("");
    } else {
      setError("Incorrect Password");
    }
  };

  return (
    <div className="min-h-screen p-4 relative bg-linear-to-r from-orange-50 via-white to-green-50 overflow-hidden">
      <Header />

      {/* Password Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center"
            >
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                🔐 Admin Access Required
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Please enter the administrator password to continue.
              </p>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mb-3"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => navigate("/")}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAccess}
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
                >
                  Authenticate
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Content (only visible after access) */}
      {!showModal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <TotalVotes totalVotes={totalVotes} />

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="md:col-span-1 space-y-4">
              <CandidateTable
                candidates={candidates}
                votes={votes}
                getPercent={getPercent}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="w-full bg-linear-to-r from-[#FF9933] via-white to-[#138808] text-gray-900 font-semibold px-5 py-3 rounded-xl shadow-md border border-gray-300 backdrop-blur-sm "
              >
                Home
              </motion.button>
            </div>

            <div className="flex flex-col gap-4 md:col-span-1">
              <PieChartCard chartData={chartData} COLORS={COLORS} />
              <BarChartCard chartData={chartData} />
            </div>

            <div className="flex flex-col gap-4 md:col-span-1">
              <LineChartCard chartData={chartData} />
              <AreaChartCard chartData={chartData} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
