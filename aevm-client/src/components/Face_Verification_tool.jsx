import React, { useRef, useState } from "react";

function Enroll_Veirfy_Face({ onVerified }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [voterName, setVoterName] = useState("");

  // Toggle camera ON/OFF
  const toggleCamera = async () => {
    if (cameraOn) {
      stream?.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraOn(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) videoRef.current.srcObject = newStream;
        setStream(newStream);
        setCameraOn(true);
      } catch (err) {
        console.error("Camera error:", err);
        alert("Please allow camera access!");
      }
    }
  };

  // Capture one frame from the camera
  const captureFrame = () => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg");
  };

  // Common function to send image
  const sendToBackend = async (endpoint, extraData = {}) => {
    const frame = captureFrame();
    if (!frame) return alert("No camera frame captured");

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: frame, ...extraData }),
      });

      const data = await res.json();

      if (endpoint === "verify" && data.voter) {
        // ✅ Pass voter details to parent component
        onVerified?.(data.voter);
        setLoading(false);
        return;
      }

      alert(data.status || "Operation complete");
    } catch (err) {
      console.error("Backend Error:", err);
      alert("Backend not reachable");
    }

    setLoading(false);
  };

  // Open modal for name input before enrolling
  const handleEnrollClick = () => {
    if (!cameraOn) {
      alert("Please turn on the camera first.");
      return;
    }
    setShowModal(true);
  };

  // Confirm name and send data
  const confirmEnroll = () => {
    if (!voterName.trim()) return alert("Please enter your name");
    setShowModal(false);
    sendToBackend("enroll", { name: voterName });
    setVoterName("");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
        Face Recognition System
      </h1>

      <div className="w-[360px] h-[260px] bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-300">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-4 mt-2">
        <button
          onClick={toggleCamera}
          disabled={loading}
          className={`px-5 py-2.5 text-sm font-semibold rounded-xl shadow-md border transition-all duration-200 ${
            cameraOn
              ? "bg-linear-to-r from-red-500 to-red-600 text-white hover:opacity-90"
              : "bg-linear-to-r from-gray-700 to-gray-800 text-white hover:opacity-90"
          }`}
        >
          {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>

        <button
          onClick={handleEnrollClick}
          disabled={loading || !cameraOn}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl shadow-md bg-linear-to-r from-[#FF9933] to-yellow-400 text-white hover:opacity-90 transition-all duration-200"
        >
          {loading ? "Processing..." : "Enroll"}
        </button>

        <button
          onClick={() => sendToBackend("verify")}
          disabled={loading || !cameraOn}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl shadow-md bg-linear-to-r from-[#138808] to-emerald-600 text-white hover:opacity-90 transition-all duration-200"
        >
          {loading ? "Processing..." : "Verify"}
        </button>
      </div>

      {/* Modal for Enroll Name */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Enter Voter Name
            </h2>
            <input
              type="text"
              placeholder="Your full name"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="border w-full px-3 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnroll}
                className="px-4 py-2 rounded-lg bg-linear-to-r from-[#FF9933] to-[#138808] text-white font-semibold hover:opacity-90"
              >
                Enroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enroll_Veirfy_Face;
