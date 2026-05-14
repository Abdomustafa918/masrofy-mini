# Masrofy Mini Full-Stack Culture-Aware Finance Dashboard

Masrofy Mini is a production-style personal finance dashboard with a React frontend, FastAPI backend, PostgreSQL database, JWT authentication, and culture-aware internationalization.

## Architecture

- `frontend/`: React + Vite + Tailwind CSS + react-i18next + Recharts, served by Nginx in production.
- `backend/`: FastAPI + SQLAlchemy + Alembic + Pydantic + JWT auth.
- `db`: PostgreSQL 16 with a persistent Docker volume.

## Features

- Register, login, logout, and authenticated profile loading.
- JWT access tokens stored in frontend `localStorage`.
- Protected dashboard, transactions, budgets, reports, and settings routes.
- User-scoped transactions, budgets, and categories.
- Dashboard summary from backend data.
- Transaction filters by type, category, and date range.
- Monthly budget create/update and progress tracking.
- Culture-aware UI for `en-US`, `ar-EG`, `fr-FR`, `de-DE`, and `nl-NL`.
- RTL layout for Arabic and LTR layout for other cultures.
- Dynamic currency, date, number formatting, theme variables, and sample categories.

## Tech Stack

Frontend:
- React 18
- Vite
- Tailwind CSS
- react-i18next / i18next
- Recharts
- React Router

Backend:
- Python 3.11
- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- Alembic migrations
- Pydantic validation
- passlib/bcrypt password hashing
- python-jose JWT tokens

Deployment:
- Docker Compose
- Nginx static frontend serving
- PostgreSQL persistent volume

## i18n and Culture-Aware Behavior

Culture configuration is in `frontend/src/config/cultures.js`.

Each culture defines:
- Locale code
- Language and country
- Direction
- Currency code and symbol
- Theme colors
- Dashboard visual style identifier
- Sample finance categories

Formatting helpers live in `frontend/src/utils/formatters.js`:
- `formatCurrency(amount)`
- `formatDate(date)`
- `formatNumber(value)`

When culture changes, the frontend:
- Updates i18next language.
- Updates `document.documentElement.lang`.
- Updates `document.documentElement.dir`.
- Updates CSS theme variables.
- Calls `PUT /api/users/me/culture` for authenticated users.
- Persists the culture locally and on the user profile.

## Authentication

Endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Passwords are hashed with passlib/bcrypt. Login and registration return a JWT access token and user object. Protected routes use the `Authorization: Bearer <token>` header.

## Database Schema Overview

Tables:
- `users`: profile, email, hashed password, preferred culture.
- `transactions`: user-owned income/expense records.
- `budgets`: one user budget per month/year.
- `categories`: user or default categories.

Alembic migration:
- `backend/alembic/versions/20260512_0001_initial_schema.py`

## API Endpoints

Transactions:
- `GET /api/transactions`
- `GET /api/transactions/{id}`
- `POST /api/transactions`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`

Budgets:
- `GET /api/budgets`
- `GET /api/budgets/current`
- `POST /api/budgets`
- `PUT /api/budgets/{id}`
- `DELETE /api/budgets/{id}`

Categories:
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

Dashboard:
- `GET /api/dashboard/summary`

User settings:
- `PUT /api/users/me/culture`

## Local Development

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Docker Compose

Run the full stack with one command:

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

## Troubleshooting

- Open backend docs at `http://localhost:8000/docs`.
- Open the frontend at `http://localhost:3000`, or `http://localhost:8080` if you changed the Compose port mapping.
- Register with password `12345678` for a quick auth smoke test.
- If CORS appears in the browser, check backend logs first because 500 errors can look like CORS failures.

## Alembic Commands

```bash
cd backend
alembic revision --autogenerate -m "describe change"
alembic upgrade head
alembic downgrade -1
```

## DockerHub

Build, tag, and push images:

```bash
docker build -t your-dockerhub-user/masrofy-mini-frontend:latest ./frontend
docker build -t your-dockerhub-user/masrofy-mini-backend:latest ./backend
docker push your-dockerhub-user/masrofy-mini-frontend:latest
docker push your-dockerhub-user/masrofy-mini-backend:latest
```

Pull and run:

```bash
docker pull your-dockerhub-user/masrofy-mini-frontend:latest
docker pull your-dockerhub-user/masrofy-mini-backend:latest
docker compose up
```

## Screenshots

Add dashboard, transactions, budgets, settings, and Arabic RTL screenshots here.

## Discussion Notes

- The app is now API-backed for authenticated finance data.
- New accounts start empty; users create real transactions and budgets through protected pages.
- Secrets in `.env.example` are placeholders and must be changed before production deployment.
- For hardened production, add HTTPS termination, refresh tokens, rate limiting, structured logging, and managed database backups.
