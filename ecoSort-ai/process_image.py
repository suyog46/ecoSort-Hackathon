import sys
import json
import base64
from PIL import Image
from io import BytesIO
from ultralytics import YOLO

# Load the trained YOLO model
model = YOLO("./runs/classify/train2/weights/last.pt")

# Get the Base64 image from stdin
image_data = sys.stdin.read().strip()
image_data = base64.b64decode(image_data)

# Open image from the buffer
image = Image.open(BytesIO(image_data))

# Convert image to RGB and process it
input_frame = image.convert('RGB')

# Perform inference
results = model.predict(source=input_frame)

# Get top prediction
top_result = results[0].probs
class_id = top_result.top1
confidence = top_result.top1conf.item()

# Prepare the response
response = {
    'label': class_list[class_id],  # Assuming you have class_list defined
    'confidence': confidence
}

# Output the result
print(json.dumps(response))
