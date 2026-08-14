# 🌾 Krishi Samadhan (कृषी समाधान / कृषि समाधान)

**Smarter Decisions. Better Agriculture.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-forestgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF)](https://vitejs.dev/)

**Krishi Samadhan** is a unified full-stack agricultural intelligence & decision support platform designed to solve the problem of fragmented agricultural data. It continuously collects, integrates, visualizes, and analyzes real-time weather, soil diagnostics, satellite vegetation indices, AI pest detection, APMC mandi rates, input store prices, and government schemes into actionable farmer advisories.

---

## ✨ Key Features & Capabilities

- 🗺️ **GIS Dashboard & Spatial Analytics**: Interactive OpenStreetMap layer with pinpoint coordinate inspection, spatial telemetry, and field zoning.
- 🌤️ **Real-Time Weather & Synoptic Forecasts**: Live temperature, humidity, wind, and 7-day precipitation forecasts powered by Open-Meteo with automated ag warnings.
- 🛰️ **Satellite Vegetation Monitoring (NDVI)**: Sentinel-2 based vegetation health scoring, moisture indices, and crop stress anomaly detection.
- 🌱 **Soil Health & NPK Prescription**: Physical and chemical soil properties analysis (pH, Nitrogen, Phosphorus, Potassium, Moisture) with Vertisol (Black Cotton Soil) conditioning guidance.
- 🐛 **AI Pest & Disease Surveillance**: Image-based leaf pathology diagnosis with confidence meters, severity ratings, and organic/chemical prescriptions.
- 💰 **Local APMC Mandi & Input Store Intelligence**:
  - Daily live mandi rates for **Nashik, Sangamner, Kopargaon, Sinnar, Shirdi, Rahata, and Yeola**.
  - Price comparison for **Seeds (Hybrids)**, **Pesticides/Fungicides**, and **Fertilizers (Urea, DAP, NPK)** across local Krishi Seva Kendra outlets.
- 🏛️ **Government Agricultural Schemes**: Searchable national repository (PM-KISAN, PMFBY, KCC, PM-KUSUM) with official application portal links.
- 📋 **Integrated Decision Support Engine**: Multi-source decision rule synthesis converting raw telemetry into prioritized farmer advisories.
- 🤖 **Krishi AI Assistant**: Floating multilingual conversational chatbot providing instant recommendations for weather, soil, pests, mandi rates, and schemes.
- 🌐 **Multilingual Support**: Real-time interface translation in **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)**.
- 📱 **100% Mobile Responsive**: Fluid layout, mobile app bar, drawer navigation, and touch-optimized controls.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, React Router v6, Leaflet GIS, Recharts, Custom Agricultural CSS Design System |
| **Backend** | Node.js, Express.js, JWT Authentication, Multer Multipart Handler, CORS, Helmet |
| **Database** | SQLite (via `sql.js` pure JavaScript engine with persistent disk snapshots) |
| **Data Integrations** | Open-Meteo API, Agmarknet format, Sentinel-2 indices, Soil telemetry models |

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [Git](https://git-scm.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/krishi-samadhan.git
cd krishi-samadhan
```

### 3. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend server runs on `http://localhost:5000`*

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend dev server runs on `http://localhost:5173`*

---

## 🧭 Project Architecture

```
krishi-samadhan/
├── frontend/                  # React + Vite client application
│   ├── public/                # Static assets (KS Logo, favicons)
│   ├── src/
│   │   ├── components/        # Reusable UI components (Navbar, Sidebar, MetricCard, Chatbot, etc.)
│   │   ├── context/           # LanguageContext (EN / MR / HI translations)
│   │   ├── pages/             # 12 application pages (Home, GIS, Weather, Soil, Pest, Market, etc.)
│   │   ├── services/          # Modular API services (Weather, Soil, Market, InputStore, Chatbot)
│   │   ├── config/            # Default locality coordinates & settings
│   │   └── index.css          # Core agricultural design tokens & responsive styles
│   └── package.json
├── backend/                   # Express REST API server
│   ├── src/
│   │   ├── controllers/       # Route request handlers
│   │   ├── services/          # Business logic & agronomic rule engines
│   │   ├── routes/            # REST API endpoints
│   │   ├── db/                # SQLite database initializers & seed data
│   │   └── middleware/        # JWT auth, error handlers, and file uploaders
│   └── package.json
└── README.md
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
