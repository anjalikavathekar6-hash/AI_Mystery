# AI Mystery Room

An AI-generated, fictional detective investigation. The React client talks to an Express API; Gemini creates structured cases and MongoDB stores public case data separately from the private solution.

## Implementation checklist

- [x] Phase 1 — Monorepo foundation, environment validation, MongoDB connection, health endpoint, and setup guide.
- [x] Phase 2 — Gemini structured generation, Zod validation, consistency checks, and private/public case separation.
- [x] Phase 3 — Responsive landing, case creation, case overview, suspects, evidence types, and timeline.
- [x] Phase 4 — Persistent guest sessions, reviewed evidence, and notes.
- [x] Phase 5 — Deterministic accusation evaluation and post-submission reveal.
- [x] Phase 6 — Provider seam and explicit static/text-only image and CCTV fallbacks.
- [ ] Phase 7 — Run automated tests and verify the live MongoDB/Gemini flow in a configured environment.

## Requirements

- Node.js 20 or newer and npm 10 or newer
- MongoDB 7+ (local or hosted)
- A Google Gemini API key and a model available to that key

## Setup

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `GEMINI_API_KEY`, and `GEMINI_MODEL`.
2. From the project root run `npm install`.
3. Start both applications with `npm run dev`.
4. Open <http://localhost:5173>. The API health check is at <http://localhost:5000/api/v1/health>.

Production build: `npm run build`; start the API with `npm start`. The client build is in `client/dist` and can be served by any static host. Configure `CLIENT_ORIGIN` for the deployed frontend.

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
- Live integration, responsive browser checks, and dependency installation require Node/npm, MongoDB, and Gemini configuration, which were not present in the workspace at implementation time.
