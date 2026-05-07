# Sentinel AI: Advanced Fraud Transaction Detection System

![Sentinel AI Banner](https://img.shields.io/badge/Sentinel-Fraud_Detection-indigo?style=for-the-badge&logo=ai&logoColor=white)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=three.js)

Sentinel AI is a high-performance, machine learning-powered application designed to identify, visualize, and mitigate fraudulent financial activities in real-time. The system combines robust rule-based logic with predictive modeling and a cinematic "Slate & Indigo" aesthetic, featuring interactive 3D visualizations.

---

## 🚀 Key Features

### 🧠 AI-Powered Fraud Engine
- **Real-Time Detection**: Analyzes transaction patterns and user behavior instantly.
- **Rule-Based Analysis**: Detects high-value anomalies, rapid successive transactions, and suspicious geographic shifts.
- **Predictive Risk Scoring**: Generates a 0-100% fraud probability with detailed reasoning.
- **Anomaly Detection**: Identifies unusual transaction behavior using mock AI models.

### 🎙️ Voice-Controlled Interface
- **Hands-Free Operation**: Search for Transaction IDs or UPI IDs using voice commands.
- **NLP Intent Recognition**: Intelligently populates fields and triggers verification scans.

### 🌐 Immersive 3D Visualization
- **NeuralNetwork3D**: A cinematic 3D representation of data flow and neural connections using Three.js.
- **Dynamic System States**: Visualizes activity levels and transaction processing in real-time.

### 📊 Comprehensive Dashboard
- **Live Alerts**: Real-time fraud notification system with actionable insights.
- **Instant Actions**: "Block Accounts" or "Verify Safe" with a single click.
- **Data Analytics**: Visual transaction history and risk distribution charts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Visualization**: Three.js (React Three Fiber)
- **Icons & UI**: Lucide React, Custom Slate/Indigo CSS System
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT Authentication, Bcrypt Hashing
- **Data Handling**: Multer, CSV Parser

---

## 🔬 Machine Learning Logic
The system evaluates transactions based on multiple risk vectors:
1. **Transaction Velocity**: Checks for rapid successive transactions within a 5-minute window.
2. **Value Anomaly**: Flags transactions exceeding 10,000 as high-risk anomalies.
3. **Geographic Risk**: Monitors for suspicious location or IP changes.
4. **Predictive Scoring**: Integrates mock AI scores to simulate advanced ML model predictions.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Harshyadav5002/AI-BASED-FRAUD-TRANSCATION-DETECTION.git
   cd AI-BASED-FRAUD-TRANSCATION-DETECTION
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure your .env file
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🛡️ Validation & Security
- **Strict UPI ID Validation**: Enforces alphanumeric patterns for UPI verification.
- **Input Sanitization**: Robust handling of all transaction data.
- **Secure Authentication**: JWT-protected API endpoints.

---

## 🎨 UI/UX Design System
- **Cinematic Experience**: Smooth transitions and micro-interactions.
- **Glassmorphism**: Elegant card layouts with backdrop filters.
- **Dark Mode Optimization**: Tailored for high-end financial monitoring.

---

## 📄 License
This project is licensed under the MIT License.

---

## 👤 Author
Developed by **HARSH**
[GitHub: Harshyadav5002](https://github.com/Harshyadav5002)

---

### Support
If you find this project useful, please give it a ⭐ on GitHub!
