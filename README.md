# AI Mystery Room

An AI-generated, fictional detective investigation. React is built into static assets and Express serves those assets and the API from one origin. Gemini creates structured cases and MongoDB stores public case data separately from the private solution.

## Implementation checklist

- [x] Phase 1 — Monorepo foundation, environment validation, MongoDB connection, health endpoint, and setup guide.
- [x] Phase 2 — Gemini structured generation, Zod validation, consistency checks, and private/public case separation.
- [x] Phase 3 — Responsive landing, case creation, case overview, suspects, evidence types, and timeline.
- [x] Phase 4 — Persistent guest sessions, reviewed evidence, and notes.
- [x] Phase 5 — Deterministic accusation evaluation and post-submission reveal.
- [x] Phase 6 — Provider seam and explicit static/text-only image and CCTV fallbacks.
- [x] Phase 7 — Run automated tests and verify the live MongoDB/Gemini flow in a configured environment.

## Requirements

- Node.js 24.22.1 (pinned in `.node-version`) and npm 10 or newer
- MongoDB 7+ (local or hosted)
- A Google Gemini API key and a model available to that key

## Setup

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `GEMINI_API_KEY`, and `GEMINI_MODEL`.
2. From the project root run `npm install`.
3. Start both applications with `npm run dev`.
4. Open <http://localhost:5173>. The API health check is at <http://localhost:5000/api/v1/health>.

Production build: `npm run build`; start the full application with `npm start`. In production, Express serves the client from `client/dist`, so the browser uses the same-origin `/api/v1` API path. The Vite development server proxies `/api` to port 5000.

## Deploy to Render and MongoDB Atlas

This repository includes `render.yaml` for a single Render web service. Render builds both workspaces and Express serves the client and API together. MongoDB Atlas provides persistent case/session storage.

### 1. Push the project to GitHub

Create a GitHub repository and push this project to its default branch. Confirm `.env` files are not tracked; `.gitignore` excludes them. Never commit Gemini keys or database credentials.

### 2. Create the Atlas database

1. Create an Atlas project and cluster in a region near the Render service.
2. Under **Database Access**, create a database user with a strong password and read/write access to the application database.
3. Under **Network Access**, add the Render service's outbound IP ranges. After the Render service exists, find the ranges in the service dashboard under **Connect → Outbound**. Add every listed CIDR to the Atlas IP access list, then redeploy if the first deploy could not connect. Avoid leaving a `0.0.0.0/0` rule in place.
4. In Atlas, choose **Connect → Drivers** and copy the connection string. Use the database username/password (not your Atlas account password), URL-encode special characters in the password, and include `/ai_mystery_room` before any `?` query parameters.

The final value should look like `mongodb+srv://<db-user>:<encoded-password>@<cluster-host>/ai_mystery_room?retryWrites=true&w=majority`.

### 3. Create the Render service

1. In Render, choose **New → Blueprint** and connect the GitHub repository containing `render.yaml`.
2. Render reads the Blueprint and prompts for the values marked `sync: false`. Enter `GEMINI_API_KEY` and the Atlas `MONGODB_URI`. Keep `GEMINI_MODEL` as `gemini-3.5-flash-lite`, or set a model enabled for your Gemini key. Render generates `SESSION_SECRET` automatically.
3. Create the Blueprint. The build command is `npm ci --include=dev && npm run build`; the start command is `npm start`.
4. If the first deploy fails with a MongoDB network-access error, add Render's outbound CIDRs to Atlas as in step 2, then select **Manual Deploy → Deploy latest commit**.
5. When the service is live, open `https://<your-service>.onrender.com/api/v1/health`. It should return `success: true` and `database: "connected"`. Open the service root to use the app and create a test case.

The Blueprint uses Render's free web-service plan for a hobby/demo deployment. Free instances spin down after 15 minutes idle and can take about a minute to wake; use a paid instance if you need consistent availability and response times. [Render documents these free-tier limits](https://render.com/docs/free).

### 4. Optional custom domain

Add a custom domain in Render's service settings, then follow Render's DNS instructions. Because the frontend and API stay on the same service, no separate frontend API URL or production CORS origin is needed.

## Configuration

See `server/.env.example` and `client/.env.example`. Gemini is called only by the server. If its key/model is missing or unavailable, generation returns a recoverable error; the app does not pretend a generated case succeeded. Image/video providers are optional. Without one, images use labeled evidence placeholders and CCTV appears as a timestamped reconstruction transcript; neither is presented as an actual generated image or video.

## Session and privacy model

The browser stores the current case ID, session ID, and opaque session token in `sessionStorage` so refreshes in that tab restore progress. The API stores only a SHA-256 hash of the token and checks it on protected session routes. Public case reads return only the explicitly projected public fields. The canonical culprit, answer reasoning, and private narrative stay server-side until the first valid accusation; the server then compares the submitted suspect ID deterministically and locks the session. Generated stories and evidence are simulated fiction.

Cases and abandoned sessions are retained for 30 days by MongoDB TTL indexes. No authentication or cross-device history is included in this guest MVP.

## Case generation speed

Generation makes one Gemini request per submission, uses minimal thinking, a 35-second request timeout, and a bounded response size. Standard cases request four evidence files; detailed cases request six. If generation fails validation or the provider is slow, the form shows an error and can be submitted again. Google's [Gemini model guide](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite) lists `gemini-3.5-flash-lite` as a low-latency model.

## API

All endpoints use `/api/v1`. See `spec.md` for request details. Implemented endpoints cover case creation/read, paginated evidence, session creation, reviewed evidence, notes, accusation reveal, and health status. All errors use `{ success: false, error: { code, message } }`.

## Tests

Run `npm test` for deterministic validation and solution-service tests. The test suite does not need a live Gemini key or a MongoDB connection.

## Deviation and configuration notes

- Optional image/video generation is exposed as a provider boundary, with explicit labeled fallbacks; no visual provider credentials were supplied, so the app does not fabricate media assets.
- The project root file is named `spec.md` (lowercase) as supplied; the implementation follows it as the source of truth.
- A live deployment still requires a GitHub repository, Atlas cluster, and Render account with the secrets entered in its dashboard.
