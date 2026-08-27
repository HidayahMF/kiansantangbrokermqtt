# API Overview — Oxyvia Backend

Base URL (as used by the frontends): `http://127.0.0.1:8000` (hardcoded in the React apps).

All routes below are the **only** routes actually registered in `backend/routes/api.php`.

## Authentication

> **Not available as public endpoints.** `AuthController` defines `login()` and `register()` methods, but **no `/api/login` or `/api/register` route is registered** — a request to these paths returns 404. Documented here for completeness of the controller's intended behavior:

### `login()` / `register()` (AuthController — NOT routed)

- `login`: validates credentials via `Hash::check`; would return `{ "message": "Login success", "user": {...} }` (200) or `{ "message": "Invalid credentials" }` (401). Does **not** return a JWT token.
- `register`: validates `name`/`email`/`password`, hashes password with `Hash::make`; would return `{ "message": "Register success" }`.
- Source: `backend/app/Http/Controllers/AuthController.php`
- **Reachability:** unrouted → currently 404. See README Limitations.

## Data & Chat

### `GET /api/inputemission`
List input-emission readings, newest first.

- Source: `backend/app/Http/Controllers/Api/InputEmissionController.php::index`
- Returns `InputEmission::orderBy('timestamp','desc')->get()`.

### `POST /api/chat`
Keyword-matched chatbot reply.

- Body: `{ "message": string }`
- Source: `backend/app/Http/Controllers/ChatbotController.php::reply`
- Reads `dataset/chatbot_dataset.json` (file not present in repo).
- **200** → `{ "reply": string }`

## Users (CRUD)

Routed via `Route::apiResource('users', UserController::class)` → `backend/app/Http/Controllers/Api/UserController.php`.

| Method   | Endpoint          | Purpose                        |
| -------- | ----------------- | ------------------------------ |
| GET      | `/api/users`      | List all users                 |
| POST     | `/api/users`      | Create user (hashes password)  |
| GET      | `/api/users/{id}` | Show single user (404 if absent) |
| PUT      | `/api/users/{id}` | Update user (password optional) |
| DELETE   | `/api/users/{id}` | Delete user                     |

`POST /api/users` fields: `name`, `email` (unique), `password` (min 6), `nomer`, `kecamatan`, `kelurahan`, `kodepos`.

## Devices (CRUD)

Routed via `Route::apiResource('devices', DevicesController::class)` → `backend/app/Http/Controllers/DevicesController.php`.

| Method   | Endpoint              | Purpose                 |
| -------- | --------------------- | ----------------------- |
| GET      | `/api/devices`        | List devices            |
| POST     | `/api/devices`        | Create device (name required) |
| PUT      | `/api/devices/{id}`   | Update device           |
| DELETE   | `/api/devices/{id}`   | Delete device           |

## Python Ingestion Endpoint (not Laravel)

`python/toSQL.py` exposes `GET /insert` on port **5000**:

- Query params: `voltage`, `current`, `power`, `energy`, `freq`, `pf`, `ambient`, `object`, `CO2` (all required).
- Inserts into MySQL `inputemission`.
- **200** → `Success save to MySQL`; **400** if params incomplete; **500** on DB error.

## Verified Endpoint Summary

| Method | Endpoint             | Layer                |
| ------ | -------------------- | -------------------- |
| GET    | `/api/inputemission` | Laravel              |
| POST   | `/api/chat`          | Laravel              |
| GET/POST/PUT/DELETE | `/api/users{/?id}` | Laravel   |
| GET/POST/PUT/DELETE | `/api/devices{/?id}` | Laravel  |
| GET    | `/insert`            | Python Flask (raw query params) |

> `login()`/`register()` (AuthController) are **not** registered as routes and are intentionally excluded from this list.
