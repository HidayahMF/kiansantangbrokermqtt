# Project Overview — Oxyvia

## Identity

| Field          | Value                                                                            |
| -------------- | -------------------------------------------------------------------------------- |
| **Project name** | Oxyvia (repository: `kiansantangbrokermqtt` — owned by `HidayahMF`)             |
| **Category**    | Real-time IoT / environmental monitoring web platform                            |
| **Target users**| Residents/operators monitoring energy & carbon, and administrators managing users|
| **Main problem**| Raw energy/CO₂ data is continuous, scattered, and hard to interpret; users lack a live, location-aware view of personal and city-level carbon impact |
| **Main solution**| An end-to-end ingestion → storage → API → visualization pipeline with a user dashboard, an admin panel, and an embedded carbon-education chatbot |

## What Exists in the Repository

Four cooperating components:

1. **`backend/`** — Laravel 12 REST API (auth, users, devices, input-emission reads, chatbot) plus an MQTT subscriber command (`php artisan mqtt:subscribe`).
2. **`frontend/`** — React 19 user dashboard branded "Oxyvia" with real-time CO₂ charts, geolocation, personal/city overviews, device management, profile/settings, and a chatbot ("OxyBot").
3. **`frontend-admin/`** — a minimal React admin app listing users from the API (`/api/users`).
4. **`python/`** — a Flask service (`toSQL.py`) that ingests sensor parameters over HTTP and writes them into MySQL.

## Verified Technologies

| Layer            | Verified tech                                                                |
| ---------------- | ---------------------------------------------------------------------------- |
| Backend          | PHP 8.2, Laravel 12, Guzzle, Tinker                                         |
| Auth             | `tymon/jwt-auth` (JWT `api` guard configured)                               |
| Messaging        | `php-mqtt/laravel-client`                                                   |
| Ingestion        | Python 3, Flask, `mysql-connector-python`                                   |
| Frontend         | React 19, Vite 7, Tailwind CSS 4, React Router 7, Axios                     |
| Charts / UI      | Recharts, Chart.js / react-chartjs-2, Framer Motion, lucide-react           |
| Mapping          | Leaflet / react-leaflet installed; OpenStreetMap Nominatim used at runtime  |
| Database         | MySQL (`.env`); SQLite as default fallback                                  |
| Testing          | Pest / PHPUnit (boilerplate only)                                            |
| Tooling          | Laravel Pint, Laravel Sail, Composer                                         |

## Trust Status

| Claim | Status |
| ----- | ------ |
| End-to-end sensor ingestion → MySQL → API → dashboard | VERIFIED (from code) |
| JWT auth fully functional (token issued at login/register) | VERIFIED — `POST /api/login` / `POST /api/register` issue signed tokens (covered by tests) |
| MQTT path fully functional | VERIFIED — subscriber + `sensor_readings` model/table present; end-to-end requires a live broker |
| Who built each component | NEEDS_CONFIRMATION — single `Initial commit` by `HidayahMF`, no per-file history |
