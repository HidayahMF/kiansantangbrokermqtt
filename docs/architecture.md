# System Architecture — Oxyvia

## Component Overview

Oxyvia is a **polyglot, multi-service** architecture split into four top-level directories. Each communicates over HTTP (plus an optional MQTT path).

| Component             | Tech            | Responsibility                                                        |
| --------------------- | --------------- | --------------------------------------------------------------------- |
| `python/toSQL.py`     | Python / Flask  | Ingest sensor HTTP payloads, write to MySQL `inputemission`            |
| `backend/` (Laravel)  | PHP 8.2 / Laravel 12 | REST API, auth, users/devices CRUD, input-emission reads, chatbot, MQTT subscriber |
| `frontend/` (React)   | React 19 / Vite | User dashboard: live charts, geolocation, overviews, device mgmt, chatbot |
| `frontend-admin/`     | React 19 / Vite | Admin user-list view                                                    |

## Architecture Diagram

```mermaid
flowchart LR
    subgraph Sources
      SENSOR[IoT Sensor]
      BROKER[MQTT Broker]
    end

    subgraph Ingestion
      ING[Python Flask - toSQL.py :5000]
    end

    subgraph Storage
      MYSQL[(MySQL)]
    end

    subgraph Backend
      API[Laravel API :8000]
      MQTT[artisan mqtt:subscribe]
    end

    subgraph Clients
      FE[React Oxyvia]
      ADM[React Admin]
    end

    subgraph External
      GEO[Nominatim / OpenStreetMap]
    end

    SENSOR --> ING
    ING --> MYSQL
    API --> MYSQL
    BROKER --> MQTT
    MQTT --> MYSQL
    FE --> API
    ADM --> API
    FE --> GEO
```

## Communication Details (verified from code)

### Frontend → Backend

- Real-time polling: `frontend/src/view/Dashboard.jsx` calls `GET http://127.0.0.1:8000/api/inputemission` on a **2-second interval** and renders the newest record.
- Device CRUD: `frontend/src/view/Sensor.jsx` and `frontend/src/view/Profile.jsx` call `/api/devices`.
- User operations: `frontend/src/view/Settings.jsx` and `frontend-admin/src/view/Users.jsx` call `/api/users`.
- Overviews: `OverviewPribadi.jsx` / `OverviewKota.jsx` / `Notification.jsx` call `/api/inputemission`.
- Base URLs are read from the `VITE_API_BASE_URL` env variable in both frontends (default `http://127.0.0.1:8000`); see `frontend/.env.example`.

### Frontend → External

- Geolocation: browser Geolocation API.
- Reverse geocoding: OpenStreetMap **Nominatim** (`https://nominatim.openstreetmap.org/reverse`).

### Backend → Database

- Eloquent models (`Devices`, `InputEmission`, `SensorReading`, `User`).
- MySQL per `.env.example` (`energy_dashboard`); SQLite is supported as a local fallback (the test suite runs on in-memory SQLite).
- `php artisan migrate` creates `users`, `devices`, `inputemission`, and `sensor_readings`.

### Ingestion → Database

- The Flask service inserts directly into MySQL (`inputemission`), bypassing the Laravel app for writes.

### Backend → MQTT

- `php artisan mqtt:subscribe` subscribes to `MQTT_TOPIC` and persists each message as a `SensorReading` row in the `sensor_readings` table.

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as AuthController (login/register)
    participant DB as MySQL

    C->>DB: lookup / create user
    C->>C: Hash::check / Hash::make
    alt invalid credentials
        C-->>U: 401 Invalid credentials
    else valid
        C-->>U: 200/201 message + JWT token + user object
    end
```

- `POST /api/login` authenticates via the `api` JWT guard and returns a signed token (`tymon/jwt-auth`).
- `POST /api/register` hashes the password (`Hash::make`) and returns a token for the new user.
- Config `auth.php` defines an `api` guard using the `jwt` driver. The data endpoints are currently public; auth endpoints are tested.

## Engineering Considerations

- **Polling vs push:** live updates are achieved via 2-second polling; a persistent connection (SSE/WS) is not implemented.
- **Polyglot ingestion:** using a separate Flask service decouples high-frequency ingestion from the Laravel API.
- **MQTT resilience:** the subscriber implements disconnect/reconnect logic and persists messages to `sensor_readings`.
- **Credentials via environment variables:** the Python ingestion service reads DB credentials from the environment (see `python/.env.example`); hardcoded secrets were removed.
