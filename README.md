# 🇮🇳 GovScheme AI — Government Scheme Awareness Platform

AI-powered platform to help Indian citizens discover, understand, and apply for government schemes.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18%2B-green.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Eligibility Checker** | Enter your profile → AI finds & ranks 50+ matching schemes |
| 💬 **AI Chatbot (SahayakAI)** | Ask questions in Hindi or English, powered by Gemini API + RAG |
| 🎤 **Voice Assistant** | Speech-to-text and text-to-speech in Hindi & English |
| 📄 **OCR Document Scanner** | Scan Aadhaar/PAN → extract text → auto-fill forms (Tesseract.js) |
| 📍 **Location-Based Recommendations** | Auto-detect state from GPS → show state-specific schemes |
| 🔔 **Notification Engine** | Deadline alerts, new scheme notifications, eligibility updates |
| 📊 **Analytics Dashboard** | Awareness gap analysis across categories and states |
| 🌐 **Multilingual** | Hindi + English support throughout the platform |

## 🏗️ Architecture

```
Modular Monolith (single deployment, cleanly separated modules)

┌──────────────┐     ┌──────────────────────┐     ┌────────────┐
│   Frontend   │────▶│   Backend (Express)   │────▶│  MongoDB   │
│  React+Vite  │     │                      │     │  (or JSON) │
│  Tailwind    │     │  ├─ Schemes API       │     └────────────┘
│  Tesseract   │     │  ├─ Recommend Engine  │
│  Web Speech  │     │  ├─ Chat + Gemini AI  │     ┌────────────┐
└──────────────┘     │  ├─ OCR Service       │────▶│ Gemini API │
                     │  ├─ Location Service  │     └────────────┘
                     │  └─ Notification Svc  │
                     └──────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# backend/.env
PORT=5000
GEMINI_API_KEY=your_key_here  # Optional: works in demo mode without it
```

### 3. Run

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser 🎉

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | In-memory JSON store (MongoDB-ready schema) |
| AI/ML | Google Gemini API, Rule-based recommendation engine |
| OCR | Tesseract.js (client-side, privacy-first) |
| Voice | Web Speech API (browser-native, no server cost) |
| Icons | Lucide React |

## 📂 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chatbot/ChatBot.jsx      # AI chatbot + voice
│   │   │   ├── ocr/DocumentScanner.jsx  # OCR scanner
│   │   │   └── layout/Navbar.jsx        # Navigation
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Landing page
│   │   │   ├── SchemeExplorer.jsx       # Browse & search
│   │   │   ├── SchemeDetails.jsx        # Scheme info
│   │   │   ├── EligibilityCheck.jsx     # AI recommender
│   │   │   ├── ScannerPage.jsx          # Document OCR
│   │   │   └── Dashboard.jsx            # Analytics
│   │   ├── services/api.js              # API client
│   │   └── index.css                    # Design system
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── models/db.js                 # In-memory DB + models
│   │   ├── routes/                      # 7 route modules
│   │   ├── services/
│   │   │   ├── aiService.js             # Gemini + RAG chatbot
│   │   │   ├── recommendService.js      # Scoring engine
│   │   │   ├── locationService.js       # GPS → State mapper
│   │   │   └── notificationService.js   # Alert generator
│   │   └── middleware/                  # Error + rate limiting
│   ├── data/schemes.json                # 50 real schemes
│   └── server.js
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schemes` | List schemes (paginated, filterable) |
| GET | `/api/schemes/:id` | Scheme details |
| GET | `/api/schemes/categories` | All categories |
| GET | `/api/schemes/search?q=` | Full-text search |
| POST | `/api/recommend` | AI recommendations |
| POST | `/api/chat` | Chatbot message |
| POST | `/api/ocr/scan` | Upload document |
| POST | `/api/ocr/autofill` | Extract fields from OCR text |
| GET | `/api/location/schemes?lat=&lon=` | Location-based schemes |
| GET | `/api/analytics/dashboard` | Dashboard data |

## 🎯 AI Recommendation Engine

The recommendation system uses a **weighted scoring algorithm**:

```
Score = Σ (weight × match) / Σ (weight)

Weights: Income (20%) > Age (15%) = Caste (15%) = Occupation (15%)
         > Gender (10%) = Education (10%) = State (10%) > Rural (5%)
```

Bonus points for:
- State-specific schemes matching user's state
- Category-targeted schemes (e.g., SC/ST-specific)
- Gender-specific schemes (e.g., women-only)

## 🚢 Deployment (Free Tier)

| Component | Platform | Free Tier |
|-----------|----------|-----------|
| Frontend | Vercel / Netlify | Unlimited |
| Backend | Render / Railway | 750 hrs/month |
| Database | MongoDB Atlas | 512 MB |
| AI | Gemini API | Free tier |
| OCR | Tesseract.js | Free (client-side) |
| Voice | Web Speech API | Free (browser) |

## 📄 License

MIT License — Built with ❤️ for Digital India
