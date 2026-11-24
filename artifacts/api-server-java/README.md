# FitSwap Java Backend

This folder contains the standalone Java backend for FitSwap.

## Why this exists

The current workspace already has a React UI and used to have a Node-based API service. The Java backend is kept in a separate service folder so the UI and backend stay cleanly separated while still living in the same repository.

## Approach

- Keep the frontend in `artifacts/fitswap`
- Add a Java backend in `artifacts/api-server-java`
- Preserve the same `/api/*` contract so the UI can switch backends without a rewrite
- Start with an in-memory service layer so the API shape is stable before persistence is introduced

## Structure

- `src/main/java/com/fitswap/api/FitSwapApiApplication.java` entry point
- `controller` for REST endpoints
- `service` for marketplace logic
- `model` for domain records
- `src/main/resources/application.properties` for runtime settings

## Endpoints to grow next

- `GET /api/healthz`
- `GET /api/listings`
- `GET /api/listings/{id}`
- `POST /api/listings`
- `GET /api/stats`
- `GET /api/gyms`

## Notes

This backend uses a different port from the frontend by default (`5001` instead of `5173`) so the two services remain independent during development.

## Frontend wiring

The React app is configured to read `VITE_API_BASE_URL` and, in local development, fall back to `http://localhost:5001`. That makes the UI talk to this Java service explicitly instead of the legacy Node API.
