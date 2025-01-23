"use client";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const CameraFeed = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [predictions, setPredictions] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const [binStatus, setBinStatus] = useState("OK");

  const borderHeight = 200;
  const borderWidthLength = 300;

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing the webcam:", err);
    }
  };

  useEffect(() => {
    if (isVideoVisible) {
      startWebcam();
    } else {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        const tracks = stream?.getTracks();
        tracks?.forEach((track) => track.stop());
      }
    }

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        const tracks = stream?.getTracks();
        tracks?.forEach((track) => track.stop());
      }
    };
  }, [isVideoVisible]);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.1.75:4000"); // WebSocket backend address
    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onclose = () => console.log("Disconnected from WebSocket");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "BIN_STATUS") {
          setBinStatus(message.status);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendPredictionsToBackend = (modelClass, detectClass) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type: "classify",
        modelClass,
        detectClass,
      };
      console.log("Sending WebSocket message:", message);
      socket.send(JSON.stringify(message));
    }
  };

  const captureImage = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const borderPaddingX = (canvas.width - borderWidthLength) / 2;
    const borderPaddingY = (canvas.height - borderHeight) / 2;

    const imageData = context.getImageData(
      borderPaddingX,
      borderPaddingY,
      borderWidthLength,
      borderHeight
    );

    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = borderWidthLength;
    croppedCanvas.height = borderHeight;
    const croppedContext = croppedCanvas.getContext("2d");
    croppedContext.putImageData(imageData, 0, 0);

    const croppedImageData = croppedCanvas.toDataURL("image/jpeg");
    setImagePreview(croppedImageData);

    const byteString = atob(croppedImageData.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = response.data;

    

      setPredictions({
        model: data.model_output,
        detect: data.detect_output,
      });

      if (data.model_output && data.detect_output) {
        sendPredictionsToBackend(
          data.model_output.class,
          data.detect_output.detect_class
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  useEffect(() => {
    if (isVideoVisible) {
      const interval = setInterval(() => {
        captureImage();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isVideoVisible]);

  const handleToggleVideo = () => {
    setIsVideoVisible((prev) => !prev);
  };

  return (
    <div className="w-full mx-auto bg-gray-100 p-6 rounded-lg shadow-md pt-44">
      <button
        onClick={handleToggleVideo}
        className={`mb-4 px-4 py-2 rounded text-white font-bold ${
          isVideoVisible
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isVideoVisible ? "Stop Video Preview" : "Start Video Preview"}
      </button>

      {binStatus === "FULL" && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
          <p>The trash bin is full. Please empty it!</p>
        </div>
      )}

<div className="flex justify-center">


      {isVideoVisible && (
        <div className="relative">
          <video ref={videoRef} className="w-full h-auto rounded-md" autoPlay />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
      )}

{imagePreview && (
  <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Cropped Image Preview</h3>
    <div className="flex justify-center">
      <img
        src={imagePreview}
        alt="Cropped Preview"
        className="w-64 h-64 object-cover rounded-md border border-gray-300"
      />
    </div>
    <p className="text-center text-gray-600 mt-4">
      This is a preview of the cropped image. Ensure it meets your requirements.
    </p>
  </div>
)}

      </div>
      {predictions && (
  <div className="mt-6 p-6 bg-white border rounded-lg shadow-md">
    <h3 className="text-xl font-bold mb-4 text-gray-800">Predictions</h3>
    <div className="space-y-6">
      {/* Primary Model Section */}
      <div className="p-4 bg-gray-100 rounded-md">
        <h4 className="text-lg font-semibold text-gray-700">Category</h4>
        <div className="mt-2 text-gray-600">
          <p>
            <span className="font-medium text-gray-800">Type:</span> {predictions.model?.class || 'N/A'}
          </p>
          <p>
            <span className="font-medium text-gray-800"> correction probability:</span> {predictions.model?.accuracy || '0'}%
          </p>
        </div>
      </div>

      {/* Detection Model Section */}
      <div className="p-4 bg-gray-100 rounded-md">
        <h4 className="text-lg font-semibold text-gray-700">Detection Model</h4>
        <div className="mt-2 text-gray-600">
          <p>
            <span className="font-medium text-gray-800">Material:</span> {predictions.detect?.detect_class || 'N/A'}
          </p>
          <p>
            <span className="font-medium text-gray-800">correction probability:</span> {predictions.detect?.detect_accuracy || '0'}%
          </p>
        </div>
      </div>
    </div>
  </div>
)}


<Link href="/dashboard">
  <button className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
    Go to Dashboard
  </button>
</Link>
    </div>
  );
};

export default CameraFeed;
