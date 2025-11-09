/* eslint-disable react-refresh/only-export-components */
// src/pages/FaceVerifyHome.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Enroll_Veirfy_Face from "../components/Face_Verification_tool";
import logo from "../assets/image.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import userImage from "../assets/VoterImage.avif";

function FaceVerifyHome() {
  const navigate = useNavigate();
  const [verifiedVoter, setVerifiedVoter] = useState(null);

  const handleVerification = (voterData) => {
    setVerifiedVoter(voterData);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-linear-to-b from-[#FF9933]/25 via-white to-[#138808]/25 flex flex-col">
      {/*Verification Details Modal */}
      {verifiedVoter && (
        <VoterCard
          verifiedVoter={verifiedVoter}
          navigate={navigate}
          setVerifiedVoter={setVerifiedVoter}
        />
      )}

      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-md py-3 flex justify-between items-center px-8 border-b border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Election Commission Logo"
            className="w-10 h-10 drop-shadow-sm rounded-sm"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Election Commission of India
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              New Voter Enrollment Portal
            </p>
          </div>
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-gray-700 font-semibold tracking-wide"
        >
          Identity • Verification • Inclusion
        </motion.span>
      </header>

      {/* Main Section */}
      <main className="flex flex-1 items-center justify-evenly relative px-6">
        {/* Background Glow Animation */}
        <div className="absolute inset-0 bg-linear-to-r from-[#FF9933]/10 via-white to-[#138808]/10 animate-pulse"></div>

        {/* Left Info Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-sm space-y-4 z-10"
        >
          <h2 className="text-3xl font-bold text-gray-800 leading-snug">
            <span className="text-[#FF9933]">Enroll</span> as a{" "}
            <span className="text-[#138808]">New Voter</span>
          </h2>

          <p className="text-gray-700 text-sm leading-relaxed">
            Begin your voter registration with a secure and easy-to-use
            verification process. Your identity is confirmed through AI-based
            face recognition and verified documentation.
          </p>

          <ul className="text-gray-700 list-disc list-inside text-sm space-y-1">
            <li>AI-powered face enrollment & matching</li>
            <li>Secure storage of voter data on the cloud</li>
            <li>Instant identity verification and validation</li>
          </ul>

          <p className="text-xs text-gray-600">
            Developed under the <b>Digital India</b> initiative to ensure every
            citizen’s right to vote through modern and inclusive technology.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="bg-linear-to-r from-[#FF9933] via-white to-[#138808] text-gray-900 font-semibold px-5 py-2 rounded-xl shadow-md border border-gray-300 backdrop-blur-sm hover:shadow-lg transition-all text-sm"
            onClick={() => navigate("/")}
          >
            Home
          </motion.button>
        </motion.div>

        {/* Right Camera Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center justify-center z-10"
        >
          <div className="bg-white/70 backdrop-blur-lg shadow-lg p-4 rounded-xl border border-gray-200">
            <Enroll_Veirfy_Face onVerified={handleVerification} />
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-2 text-xs tracking-wide">
        © {new Date().getFullYear()} Election Commission of India — New Voter
        Enrollment System
      </footer>
    </div>
  );
}

export default FaceVerifyHome;

function VoterCard({ verifiedVoter,  setVerifiedVoter }) {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-2xl p-6 w-[95%] max-w-md border border-gray-200">
        {/* Header with emblem */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Election Commission of India
            </h2>
            <p className="text-xs text-gray-600">Government of India</p>
          </div>
          <img src={logo} alt="ECI Logo" className="w-10 h-10 object-contain" />
        </div>

        {/* Card Body */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-800">
          <div className="w-24 h-28 bg-gray-200 rounded-md overflow-hidden shadow-inner border border-gray-300 flex items-center justify-center">
            <img src={userImage} className="w-24 h-28" />
          </div>

          <div className="text-left space-y-1 w-full">
            <p className="text-sm">
              <span className="font-semibold">Voter ID:</span>{" "}
              <span className="font-mono">{verifiedVoter.ID}</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Name:</span> {verifiedVoter.Name}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Eligibility:</span>{" "}
              {verifiedVoter.Vote_Eligible ? (
                <span className="text-green-700 font-medium">Eligible ✅</span>
              ) : (
                <span className="text-red-600 font-medium">
                  Not Eligible ❌
                </span>
              )}
            </p>
            <p className="text-xs text-gray-600 italic pt-1">
              Verified by AI Face Recognition
            </p>
          </div>
        </div>

        {/* Footer / Buttons */}
        <div className="flex justify-end gap-3 mt-6 border-t pt-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all duration-200"
            onClick={() => setVerifiedVoter(null)}
          >
            Close
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-linear-to-r from-[#FF9933] via-yellow-400 to-[#138808] text-gray-900 font-semibold hover:opacity-90 shadow-md transition-all duration-200"
          >
            Proceed to Vote
          </button>
        </div>
      </div>
    </div>
  );
}
