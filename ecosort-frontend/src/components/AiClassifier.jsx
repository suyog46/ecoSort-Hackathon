"use client";
import { useRef, useState, useEffect } from "react";

export default function AiClassifier() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [socket, setSocket] = useState(null); // WebSocket instance
  const videoRef = useRef(null);

  // Establish WebSocket connection on component mount
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000"); // Replace with your backend WebSocket URL
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);

      if (data.type === "arduino-data") {
        console.log("Data from Arduino:", data.data);
      } else if (data.acknowledge) {
        console.log("Acknowledgement:", data.acknowledge);
      } else if (data.error) {
        console.error("Error from WebSocket:", data.error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close(); // Cleanup WebSocket connection on component unmount
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsCameraActive(true);
      sendFramesToFlaskBackend();
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setClassificationResult(null);
  };

  const sendFramesToFlaskBackend = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const sendFrame = async () => {
      if (!isCameraActive || !videoRef.current) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const frame = canvas.toDataURL("image/jpeg");
      setIsProcessing(true);

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ frame }),
        });

        const data = await response.json();
        if (data.class) {
          setClassificationResult({ class: data.class, accuracy: data.accuracy });

          // Send classification result to WebSocket backend
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                type: "classify",
                classification: data.class === "degradable" ? "degradable" : "non-degradable",
              })
            );
          } else {
            console.error("WebSocket is not open");
          }
        }
      } catch (err) {
        console.error("Error sending frame to Flask backend:", err);
        setClassificationResult({ class: "Error", accuracy: 0 });
      } finally {
        setIsProcessing(false);
        if (isCameraActive) {
          setTimeout(sendFrame, 100); // Adjust delay as needed
        }
      }
    };

    sendFrame();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Waste Classification</h1>

      <div className="relative w-full max-w-md bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} className="w-full h-auto" />
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-white font-semibold">Processing...</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-md mt-4">
        <button
          onClick={isCameraActive ? stopCamera : startCamera}
          className={`w-full px-4 py-2 text-white font-semibold rounded ${
            isCameraActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isCameraActive ? "Stop Camera" : "Start Camera"}
        </button>

        {classificationResult && (
          <div className="mt-4 p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold">Classification Result:</h2>
            <p className="mt-2">
              <strong>Class:</strong> {classificationResult.class}
            </p>
            <p>
              <strong>Accuracy:</strong> {classificationResult.accuracy}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
