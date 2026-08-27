# Development / Implementation Overview — Oxyvia

> The repository contains only a single `Initial commit` (`56a007e`) by `HidayahMF`, so there is no chronological development history to reconstruct. The following is an **implementation overview** describing how the system fits together, inferred from the code that exists.

## Component Map

| Component      | Stack                | Key files                                               |
| -------------- | -------------------- | ------------------------------------------------------- |
| Ingestion      | Python / Flask       | `python/toSQL.py`                                       |
| API + Auth     | Laravel 12 / PHP 8.2 | `backend/routes/api.php`, `backend/app/Http/Controllers/` |
| MQTT           | php-mqtt client      | `backend/app/Console/Commands/MqttSubscribe.php`         |
| Data layer     | Eloquent + raw DB    | `backend/app/Models/*`, `backend/database/migrations/*`  |
| User UI        | React 19 / Vite      | `frontend/src/view/*`, `frontend/src/components/*`       |
| Admin UI       | React 19 / Vite      | `frontend-admin/src/view/Users.jsx`                      |

## Implementation Stages (as it can be reconstructed)

```text
Requirements — real-time CO₂/energy monitoring + carbon education
  ↓
Architecture — separate ingestion, storage, API, and UI services
  ↓
Data layer — MySQL + Eloquent models (users, devices, inputemission)
  ↓
Ingestion — Flask /insert writes sensor readings to MySQL
  ↓
API — Laravel controllers & routes (auth, users, devices, emission reads, chat)
  ↓
MQTT — artisan command subscribes to broker topics
  ↓
User UI — React dashboard with live charts, geolocation, overviews, device mgmt, chatbot
  ↓
Admin UI — React user-list panel
  ↓
Testing — Pest / PHPUnit harness (boilerplate)
```

## Engineering Decisions Observed

- **Separate Python ingestion service** for high-frequency HTTP sensor writes, keeping the Laravel app read-focused.
- **2-second client polling** for near-real-time dashboard updates (simpler than a persistent socket).
- **Keyword-matched local chatbot** for offline, dependency-free carbon education.
- **Geolocation + OpenStreetMap Nominatim** for automatic location labeling.
- **MQTT reconnect/retry loop** for long-running broker subscriptions.

## Known Gaps Noted During Analysis

The items below were open gaps during the original analysis and have since been closed in the current codebase:

- ~~`SensorReading` model referenced by the MQTT subscriber is missing.~~ → Added model + `sensor_readings` migration.
- ~~`inputemission` table has no migration.~~ → Added `create_inputemission_table` migration.
- ~~JWT token is configured but not issued on login.~~ → `POST /api/login` / `POST /api/register` now issue signed JWT tokens.
- ~~Backend chatbot dataset file (`dataset/chatbot_dataset.json`) is absent.~~ → Dataset added (same content as the frontend's inline dataset); missing-file cases return 503 gracefully.
- ~~Hardcoded API base URLs in the frontends.~~ → Moved to `VITE_API_BASE_URL` (`src/config.js` + `.env.example`).

Remaining limitations are documented in `docs/api.md` (Current Limitations).
