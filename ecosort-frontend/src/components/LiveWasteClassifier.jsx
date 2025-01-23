'use client';
import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

const LiveWasteClassifier = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let model = null;

        const initializeModel = async () => {
            try {
                // Load the TensorFlow.js model from the public folder
                model = await tf.loadGraphModel("/models/my_model/model.json");
                setLoading(false);
            } catch (error) {
                console.error("Error loading model:", error);
            }
        };

        const startVideo = async () => {
            try {
                if (videoRef.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        const classifyFrame = async () => {
            if (!model || !videoRef.current || !canvasRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Draw video frame onto canvas
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Convert the canvas image to a Tensor
            const imageTensor = tf.browser.fromPixels(canvas)
                .resizeNearestNeighbor([224, 224]) // Match model input size
                .expandDims(0) // Add batch dimension
                .toFloat()
                .div(255.0); // Normalize pixel values to [0, 1]

            // Run the model prediction
            const prediction = await model.predict(imageTensor);
            const data = await prediction.data();

            // Interpret the result (e.g., binary classification: degradable vs non-degradable)
            const predictedClass = data[0] > 0.5 ? "Non-degradable" : "Degradable";
            setResult(predictedClass);

            // Dispose of the Tensor to free memory
            imageTensor.dispose();
            prediction.dispose();
        };

        const processVideo = () => {
            classifyFrame();
            requestAnimationFrame(processVideo); // Loop to classify each frame
        };

        initializeModel();
        startVideo();
        processVideo();

        return () => {
            // Cleanup resources on component unmount
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject;
                stream.getTracks().forEach((track) => track.stop());
            }
            if (model) model.dispose();
        };
    }, []);

    return (
        <div>
            <h2>Live Waste Classifier</h2>
            {loading && <p>Loading model...</p>}
            <video ref={videoRef} style={{ maxWidth: "500px" }} />
            <canvas ref={canvasRef} width={224} height={224} style={{ display: "none" }} />
            {result && <p>Detected Waste Type: {result}</p>}
        </div>
    );
};

export default LiveWasteClassifier;
