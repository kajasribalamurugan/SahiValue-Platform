# ♻️ SAHI VALUE - Monorepo & Complete E-Waste Platform

SAHI VALUE is an end-to-end e-waste management, valuation, and recycling platform connecting local e-waste collectors with authorized recyclers.

---

## 📁 Repository Structure

```text
SahiValue-Platform/
├── frontend/        # Recycler Web Portal (React + Vite + Tailwind CSS)
├── backend/         # Production REST API (FastAPI + PostgreSQL + SQLAlchemy)
└── collector-app/   # Collector Mobile App (React Native + Expo Router + TypeScript)
```

---

## 🚀 Live Deployments & Build Links

- **Android Collector App (APK)**: [Download Standalone APK](https://expo.dev/artifacts/eas/fbE9ad-NU8Qhhs2R_rXSflRfyNQx372PCFJKrFuGaSM.apk)
- **Recycler Portal (Vercel)**: https://sahi-value-recycler.vercel.app/
- **Backend API (Render)**: https://sahivaluebackend.onrender.com/
- **API Health Check**: `https://sahivaluebackend.onrender.com/api/health`

---

## 🛠️ Project Components

### 1. `frontend/` - Recycler Web Portal
- Built with React 18, Vite, TypeScript, and Tailwind CSS.
- Deployed automatically to Vercel.
- Run locally:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

### 2. `backend/` - FastAPI REST API
- Built with Python 3.11, FastAPI, SQLAlchemy ORM, and PostgreSQL.
- Includes automatic startup schema migrations and credential-safe error guards.
- Deployed automatically to Render.
- Run locally:
  ```bash
  cd backend
  python -m venv .venv
  .venv\Scripts\activate
  pip install -r requirements.txt
  uvicorn app.main:app --reload
  ```

### 3. `collector-app/` - Collector Mobile App
- Built with Expo SDK 57, React Native, Expo Router, and lucide-react-native.
- Features AI camera e-waste classification and digital handover receipt QR generation.
- Connected directly to the production backend API `https://sahivaluebackend.onrender.com/api`.
- Run locally:
  ```bash
  cd collector-app
  npm install
  npx expo start
  ```

---

## 🔒 Security & Environment
- Environment variables (`.env`) are excluded via `.gitignore`.
- Database URLs and JWT secret keys are managed securely via environment settings on host platforms (Render & Vercel).
