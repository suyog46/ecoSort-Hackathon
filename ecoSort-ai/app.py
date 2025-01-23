import os
import pickle
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import serial
import serial.tools.list_ports
import time
# Define paths using os
script_dir = os.path.dirname(os.path.abspath(__file__))  # Current script directory
model_path = os.path.join(script_dir, "final_model_pickle")
detect_model_path = os.path.join(script_dir, "detect_pickle")

classify_category_file_path = os.path.join(script_dir, "utils", "category.txt")
detect_category_file_path =  os.path.join(script_dir, "utils", "detect_category.txt")
# Load the model
try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    raise RuntimeError("Model file not found. Ensure 'model_pickle' exists at the correct path.")


try:
    with open(detect_model_path, 'rb') as f:
        detect_model = pickle.load(f)
except FileNotFoundError:
    raise RuntimeError("Detect model file not found. Ensure 'detect_pickle' exists at the correct path.")

# Load the class list
if not os.path.exists(classify_category_file_path):
    raise RuntimeError("Category file not found. Ensure 'utils/category.txt' exists.")
with open(classify_category_file_path, "r") as file:
    classify_class_list = file.read().splitlines()
with open(detect_category_file_path, "r") as file:
    detect_class_list = file.read().splitlines()

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)


@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        file = request.files.get('file')  # Access the 'file' key
        if not file:
            return jsonify({"error": "No file provided"}), 400

        img = Image.open(file.stream)  # Open the image as a PIL object
        img = np.array(img)  # Convert to numpy array

        # Ensure the image is in RGB format
        if img.ndim == 3 and img.shape[2] == 3:  # Check for 3 channels
            image_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        else:
            image_rgb = img  # Already in RGB

        # Run inference with the first model
        model_results = model.predict(image_rgb)
        model_output = {}

        if model_results:
            for result in model_results:
                cls_probs = result.probs
                class_id = cls_probs.top1  # Get top-1 class
                confidence = cls_probs.top1conf.item()  # Confidence of top-1 class
                model_output = {
                    "class": classify_class_list[class_id],
                    "accuracy": round(confidence, 2)
                }

        # Run inference with the second model
        detect_results = detect_model.predict(image_rgb)
        detect_output = {}
        

        if detect_results:
            for result in detect_results:
                cls_probs = result.probs
                class_id = cls_probs.top1  # Get top-1 class
                confidence = cls_probs.top1conf.item()  # Confidence of top-1 class
                detect_output = {
                    "detect_class": detect_class_list[class_id],
                    "detect_accuracy": round(confidence, 2)
                }

        # Combine outputs from both models
        if model_output and detect_output:
            return jsonify({
                "model_output": model_output,
                "detect_output": detect_output
            }), 200
        else:
            return jsonify({"error": "No predictions made by the models."}), 204
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    try:
        app.run(debug=True, port=5000)
    except KeyboardInterrupt:
        print("\nShutting down server.")