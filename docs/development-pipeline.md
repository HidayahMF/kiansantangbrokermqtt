# kiansantangbrokermqtt — Development Pipeline

> Code-grounded architecture and delivery guide for the current repository snapshot. Reviewed from `main` at `b1677238e0ce` on 2026-09-17.

This repository combines two ingestion paths—HTTP via Flask and MQTT via Laravel—with MySQL persistence and React dashboards.

## 1. End-to-end architecture

```mermaid
flowchart LR
    S[Sensor Device] -->|HTTP params| F[Flask /insert]
    S -->|MQTT payload| B[MQTT Broker]
    F --> IE[(inputemission)]
    B --> M[Laravel MQTT Subscriber]
    M --> SR[(sensor_readings)]
    IE --> API[Laravel API]
    API --> WEB[React Dashboard]
    API --> ADM[React Admin]
```

The HTTP and MQTT paths persist to different tables in the reviewed code. MQTT persistence does not automatically feed `inputemission`.

## 2. Telemetry flow

### HTTP ingestion

```mermaid
sequenceDiagram
    participant S as Sensor
    participant F as Flask
    participant D as MySQL inputemission
    participant A as Laravel API
    participant R as React Dashboard

    S->>F: GET/POST sensor parameters
    F->>D: Parameterized INSERT
    R->>A: Poll latest readings
    A->>D: Query inputemission
    D-->>A: Readings
    A-->>R: JSON response
```

### MQTT ingestion

```mermaid
flowchart TD
    B[MQTT Broker] --> SUB[Laravel mqtt:subscribe]
    SUB --> PARSE[Decode topic + payload]
    PARSE --> DB[(sensor_readings)]
```

## 3. Runtime ownership

| Layer | Responsibility | Key source |
| --- | --- | --- |
| Flask | HTTP sensor ingestion | `python/toSQL.py` |
| Laravel | API routes + application backend | `backend/routes/api.php` |
| MQTT worker | Subscription and persistence | `backend/app/Console/Commands/MqttSubscribe.php` |
| API controller | Reading retrieval | `InputEmissionController.php` |
| React | Dashboard visualization | `frontend/src/view/Dashboard.jsx` |
| MySQL | Telemetry persistence | `inputemission`, `sensor_readings` |

## 4. Development pipeline

```mermaid
flowchart LR
    CLONE[Pull source] --> ENV[Configure env]
    ENV --> PHP[Composer install]
    ENV --> JS[Frontend installs]
    ENV --> PY[Python dependencies]
    PHP --> API[Laravel API]
    PHP --> MQTT[MQTT Subscriber]
    PY --> FLASK[Flask ingestion]
    JS --> UI[React dashboards]
    API --> TEST[Tests / lint / build]
    MQTT --> TEST
    FLASK --> TEST
    UI --> TEST
```

### Declared commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `backend` | `composer dev` | Laravel server + queue + Vite |
| `backend` | `composer test` | Laravel tests |
| `backend` | `npm run build` | Backend Vite build |
| `frontend` | `npm run dev` | User dashboard dev server |
| `frontend` | `npm run build` | User dashboard build |
| `frontend` | `npm run lint` | Frontend lint |
| `frontend-admin` | `npm run dev` | Admin UI dev server |
| `frontend-admin` | `npm run build` | Admin UI build |
| `frontend-admin` | `npm run lint` | Admin UI lint |

## 5. Quality gates

```mermaid
flowchart LR
    CHANGE[Change] --> STATIC[Static review]
    STATIC --> TEST[Laravel tests]
    TEST --> SENSOR[HTTP fixture]
    SENSOR --> MQTT[MQTT fixture]
    MQTT --> BUILD[React builds]
    BUILD --> SMOKE[Dashboard smoke test]
    SMOKE --> PR[Pull Request]
```

Verify at minimum:

- HTTP reading reaches `inputemission`.
- MQTT fixture reaches `sensor_readings`.
- Missing/invalid sensor parameters fail safely.
- Broker disconnect/reconnect behavior.
- Empty datasets render without breaking the UI.
- Dashboard selects the intended newest reading.
- Public/private API behavior matches the intended auth model.

## 6. Release pipeline

```mermaid
flowchart TD
    PR[Reviewed PR] --> BUILD[Build frontends]
    BUILD --> DB[Verify DB connectivity]
    DB --> API[Start Laravel API]
    API --> WORKER[Start MQTT subscriber]
    WORKER --> INGEST[Start Flask ingestion]
    INGEST --> UI[Serve dashboards]
    UI --> CHECK[Post-deploy telemetry smoke test]
```

No GitHub Actions workflow was found in the reviewed snapshot; the release gates above are therefore procedural unless CI is added later.

## 7. Known gaps

1. **Two persistence paths:** MQTT writes do not automatically become dashboard `inputemission` records.
2. **Latest-reading selection:** API ordering and the dashboard's array selection should be aligned.
3. **Python environment loading:** `os.getenv` requires the process environment to actually contain the variables; merely copying a `.env` file is insufficient without a loader.
4. **API protection:** inspected data routes are not wrapped in JWT middleware.

## 8. Source map

- [`backend/routes/api.php`](https://github.com/HidayahMF/kiansantangbrokermqtt/blob/b1677238e0ce40b109b243a726c330573e6f7144/backend/routes/api.php)
- [`backend/app/Console/Commands/MqttSubscribe.php`](https://github.com/HidayahMF/kiansantangbrokermqtt/blob/b1677238e0ce40b109b243a726c330573e6f7144/backend/app/Console/Commands/MqttSubscribe.php)
- [`backend/app/Http/Controllers/Api/InputEmissionController.php`](https://github.com/HidayahMF/kiansantangbrokermqtt/blob/b1677238e0ce40b109b243a726c330573e6f7144/backend/app/Http/Controllers/Api/InputEmissionController.php)
- [`python/toSQL.py`](https://github.com/HidayahMF/kiansantangbrokermqtt/blob/b1677238e0ce40b109b243a726c330573e6f7144/python/toSQL.py)
- [`frontend/src/view/Dashboard.jsx`](https://github.com/HidayahMF/kiansantangbrokermqtt/blob/b1677238e0ce40b109b243a726c330573e6f7144/frontend/src/view/Dashboard.jsx)

Update this guide whenever ingestion, persistence, authentication, or telemetry rendering changes.