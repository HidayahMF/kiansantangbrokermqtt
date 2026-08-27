# Product Flow — Oxyvia

This document describes the flows supported by the actual code in the repository.

## System Data Flow

```mermaid
flowchart TD
    SENSOR[IoT Sensor]
    SENSOR -->|HTTP GET /insert?voltage=...&CO2=...| INGEST[Python Flask /insert]
    INGEST -->|INSERT INTO inputemission| MYSQL[(MySQL)]
    MYSQL -->|SELECT| API[Laravel /api/inputemission]
    API -->|JSON| DASH[React Dashboard]
    DASH -->|poll every 2s| API
    DASH -->|reverse geocode| GEO[Nominatim / OSM]
```

## User (Dashboard) Flow

Verified entry points come from `frontend/src/router/Router.jsx` and the view components.

```mermaid
flowchart TD
    U[User] --> D[Open Dashboard /]
    D --> LOAD[Loads geolocation + city name]
    D --> POLL[Polls /api/inputemission every 2s]
    POLL --> LATEST[Show latest CO₂ + Today's Highlight]
    POLL --> CHART[Daily CO₂ area chart]
    U --> OV[Overview tab]
    OV --> P[Personal Overview]
    OV --> K[City Overview]
    U --> S[Device / Sensor Management]
    S --> CRUD[CRUD /api/devices]
    U --> CH[Chatbot / Chatbot OxyBot]
    CH --> KW[Keyword match on local dataset]
    CH --> REP[Reply]
    U --> PRO[Profile / Settings]
```

## Admin Flow

Verified in `frontend-admin` (`App.jsx`, `Router.jsx`, `view/Users.jsx`).

```mermaid
flowchart TD
    A[Admin] --> U[Open /users]
    U --> FETCH[GET /api/users]
    FETCH --> TABLE[Render user table]
```

## Ingestion Flow (Python)

Verified in `python/toSQL.py`.

```mermaid
flowchart TD
    R[Raw HTTP GET /insert] --> P[Parse query params]
    P --> VALID{All params present?}
    VALID -- No --> E1[400 error]
    VALID -- Yes --> CONN[Connect MySQL]
    CONN --> INS[INSERT into inputemission]
    INS --> OK[200 success]
```

## MQTT Flow (Backend Command)

Verified in `backend/app/Console/Commands/MqttSubscribe.php`.

```mermaid
flowchart TD
    B[BROKER] -->|publish to topic| SUB[Subscribe]
    SUB --> MSG[On message]
    MSG --> STORE[Persist payload]
    STORE --> ERR{Error?}
    ERR -- yes --> LOG[Log error]
    LOOP[loop(true)]
    LOOP --> CRASH{Exception?}
    CRASH -- yes --> RECON[Reconnect + resubscribe]
    CRASH -- no --> LOOP
```

> The persistence call in `MqttSubscribe` targets `App\Models\SensorReading`, which maps to the `sensor_readings` table created by the migration `2026_08_27_000002_create_sensor_readings_table.php`.
