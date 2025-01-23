# Ecosort :recycle:	:white_check_mark:
**Smart Waste Classification System**  

## Overview  
Ecosort is an AI-powered smart dustbin system that classifies waste into degradable and non-degradable categories using machine learning and IoT components. The project aims to promote efficient waste management and sustainability.  

---

## Project Structure  

```
ecosort/
│-- ecosort-ai/          # AI model for waste classification
│-- ecosort-backend/     # Backend for handling WebSocket communication and data storage
│-- ecosort-frontend/    # Frontend interface for users to monitor and interact with the system
│-- docs/                # Project documentation
│-- README.md            # Project overview and instructions
```

---

## Features  
- **Real-time Waste Classification:**  
  Classifies waste into biodegradable and non-biodegradable categories using an AI model.  
- **Smart Notification System:**  
  Alerts users when the bin is full via WebSockets.  
- **Automated Waste Disposal:**  
  Servo motor-based mechanism to separate waste.  
- **User Dashboard:**  
  A web interface to monitor waste levels and history.  
- **Database Storage:**  
  Waste classification records are stored in a database.  

---

## Technologies Used  

### **AI (ecosort-ai):**  
- Python  
- OpenCV  
- TensorFlow/PyTorch  
- Jupyter Notebook  

### **Backend (ecosort-backend):**  
- Node.js (Express.js)  
- MongoDB  
- WebSockets  
- Serial Communication with Arduino  

### **Frontend (ecosort-frontend):**  
- React.js / Next.js  
- WebSockets  
- Tailwind CSS  

### **Hardware:**  
- Arduino  
- Servo Motors  
- Camera Module  
- Ultrasonic Sensor  

---

## Installation & Setup  

### Prerequisites  
Ensure you have the following installed:  
- Node.js & npm  
- Python & pip  
- MongoDB  
- Arduino IDE  
- Relevant dependencies (`requirements.txt` for AI and `package.json` for backend/frontend)  

### Steps  

1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/your-repo/ecosort.git
   cd ecosort
   ```

2. **Set up AI Model:**  
   ```bash
   cd ecosort-ai
   pip install -r requirements.txt
   python train_model.py  # If training is required
   ```

3. **Run Backend:**  
   ```bash
   cd ../ecosort-backend
   npm install
   npm start
   ```

4. **Run Frontend:**  
   ```bash
   cd ../ecosort-frontend
   npm install
   npm run dev
   ```

---

## Usage  

1. **Start the system and connect the Arduino to the computer.**  
2. **Waste is detected via the camera module.**  
3. **AI classifies the waste and sends the result to the backend.**  
4. **The backend triggers the servo motor for appropriate disposal.**  
5. **Users can monitor the bin status on the frontend dashboard.**  

---

## Contributing  
Contributions are welcome! Please follow these steps:  
1. Fork the repository  
2. Create a feature branch (`feature/your-feature`)  
3. Commit your changes  
4. Submit a pull request  



---

## Contact  
For questions or collaborations, contact us at **lmssuyog@example.com**.  

