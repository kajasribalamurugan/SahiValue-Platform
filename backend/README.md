# SAHI VALUE Backend Service

High-performance, secure Python FastAPI backend for the **SAHI VALUE** platform, connecting the Expo Collector mobile app and the Recycler Web Portal to a central PostgreSQL database.

---

## Architecture Diagram

```
Expo Collector (Mobile App)
      │
      ▼
FastAPI Backend (REST API / JWT)
      │
      ▼
PostgreSQL Database

Recycler Web Portal (Vite Web App)
      │
      ▼
FastAPI Backend (REST API / JWT)
      │
      ▼
PostgreSQL Database
```

---

## Technical Stack & Requirements

- **Framework**: FastAPI 0.110+
- **ASGI Server**: Uvicorn 0.28+
- **Database ORM**: SQLAlchemy 2.0+
- **Database Driver**: `psycopg3` (PostgreSQL driver)
- **Security & Authentication**: PyJWT + `pwdlib` (Argon2 / Bcrypt)
- **Data Validation**: Pydantic 2.0+ & `pydantic-settings`
- **Testing**: `pytest` 8.0+ & `httpx`

---

## Critical Server-Side Business Rule

**Weight Verification & Final Amount Calculation**:
1. **Declared Weight** entered by Collector is an estimate used only to compute `estimated_value = declared_weight × material_rate`.
2. **Verified Weight** is the physical weight measured by the Recycler at handover.
3. **Final Payment** is **ALWAYS** calculated server-side:
   $$\text{final\_amount} = \text{verified\_weight} \times \text{material\_rate}$$
4. Client requests providing `final_amount`, `estimated_value`, or `rate` are **completely ignored** by the backend.
5. Final payment is **never** calculated using declared weight.

---

## Setup & Installation

### 1. Virtual Environment Setup

```bash
# Navigate to backend directory
cd C:\Users\kajas\OneDrive\Desktop\SahiValueBackend

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Install required dependencies
pip install -r requirements.txt
```

### 2. Environment Variables (.env)

Copy `.env.example` to `.env` and fill in secrets:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/sahivalue
JWT_SECRET_KEY=sahi_value_secret_jwt_key_super_secure_984321_2026
GEMINI_API_KEY=
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:8081,http://127.0.0.1:8081
```

---

## PostgreSQL Database Setup

1. Install PostgreSQL 16+ on your machine.
2. Create database named `sahivalue`:
   ```sql
   CREATE DATABASE sahivalue;
   ```
3. Update `DATABASE_URL` in `.env` with your PostgreSQL username and password.
4. On application startup, FastAPI automatically creates tables and safely seeds initial material benchmark rates.

---

## Running the Backend

```bash
# Start Uvicorn development server
uvicorn app.main:app --reload --port 8000
```

- **API Documentation (Swagger UI)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Health Check**: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

---

## Running Unit Tests

```bash
# Execute pytest suite
.\.venv\Scripts\pytest
```

---

## API Endpoints List

| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System health check |
| `POST` | `/api/auth/register/collector` | Public | Register new Collector |
| `POST` | `/api/auth/register/recycler` | Public | Register new Recycler |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Authenticated | Get logged-in user profile |
| `GET` | `/api/materials` | Public | List materials & benchmark rates |
| `GET` | `/api/materials/{material_id}` | Public | Get material details |
| `GET` | `/api/prices` | Public | List price history |
| `GET` | `/api/recyclers` | Public | List authorized recyclers |
| `GET` | `/api/recyclers/{recycler_id}` | Public | Get recycler profile |
| `GET` | `/api/recyclers/me/lots` | Recycler | Get assigned lots for recycler |
| `POST` | `/api/lots` | Collector | Create new e-waste lot |
| `GET` | `/api/lots` | Authenticated | List user lots (Collector/Recycler) |
| `GET` | `/api/lots/{lot_id}` | Authenticated | Get lot details |
| `POST` | `/api/lots/{lot_id}/verify` | Recycler | Physical weight verification |
| `POST` | `/api/lots/{lot_id}/handover` | Recycler | Update status to handover |
| `POST` | `/api/lots/{lot_id}/complete` | Recycler | Complete lot & generate transaction |
| `GET` | `/api/collectors/me/earnings` | Collector | Get verified earnings & stats |
| `POST` | `/api/ai/classify` | Authenticated | AI material classification (Stub) |
