import cv2
import numpy as np
from ultralytics import YOLO
import os
import sys
import json

# Initialize model and class list
script_dir = os.path.dirname(os.path.abspath(__file__))
weights_path = os.path.join(script_dir, "runs/classify/train2/weights/last.pt")
model = YOLO(weights_path)

class_file_path = os.path.join(script_dir, "utils/category.txt")
with open(class_file_path, "r") as file:
    class_list = file.read().splitlines()

def classify_frame(input_frame):
    """
    Classify a single frame and return the classification result.
    :param input_frame: A frame (numpy array) to classify.
    :return: Bounding box and classification results.
    """
    # Convert frame to RGB for YOLO
    input_frame_rgb = cv2.cvtColor(input_frame, cv2.COLOR_BGR2RGB)

    # Perform inference
    results = model.predict(source=input_frame_rgb, save=False, conf=0.5)

    bounding_boxes = []
    classification = None

    # Process results
    if results:
        for result in results:
            for box in result.boxes:
                x, y, w, h = box.xywh.tolist()  # Bounding box coordinates
                label_id = int(box.cls)
                confidence = box.conf.item()
                label = class_list[label_id]

                bounding_boxes.append({
                    "x": int(x - w / 2),
                    "y": int(y - h / 2),
                    "width": int(w),
                    "height": int(h),
                    "label": label,
                    "confidence": round(confidence, 2)
                })

                # Use the most confident label as classification result
                if classification is None or confidence > classification[1]:
                    classification = (label, confidence)

    return bounding_boxes, classification

# Read frames from stdin
for line in sys.stdin:
    try:
        # Decode base64 frame
        frame_data = np.frombuffer(base64.b64decode(line.strip()), dtype=np.uint8)
        frame = cv2.imdecode(frame_data, cv2.IMREAD_COLOR)

        # Classify frame
        bounding_boxes, classification = classify_frame(frame)

        # Construct result
        result = {
            "boundingBoxes": bounding_boxes,
            "classification": classification[0] if classification else None
        }

        # Send result back to the backend
        print(json.dumps(result))
        sys.stdout.flush()

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.stdout.flush()
