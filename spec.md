# AI MYSTERY ROOM

## Product Specification & Source of Truth

**Document Type:** Spec-Driven Development Specification  
**Project Name:** AI Mystery Room  
**Version:** 1.0.0  
**Status:** Initial Development Specification  
**Technology Stack:** MERN Stack + Google Gemini AI  
**Primary Purpose:** AI-generated interactive mystery investigation website

---

H1 1. Project Overview

## 1.1 Introduction

AI Mystery Room is an AI-powered interactive mystery-solving website where users can create their own mystery challenges by entering a short story, scenario, or fictional incident.

The system uses Google Gemini AI on the backend to transform the user's input into a complete fictional investigation. Each investigation contains a mystery, multiple suspects, AI-generated evidence, a hidden culprit, and a final accusation stage.

Users investigate the case by examining evidence such as WhatsApp-style conversations, images, CCTV-style recordings, witness statements, timelines, and other clues. They must analyze the evidence, identify contradictions, connect clues, and select the most likely culprit.

The goal is to provide an engaging detective experience in which every case is generated dynamically rather than relying on a fixed collection of predefined mysteries.

## 1.2 Core Concept

*User Story → AI Case Generation → Evidence Investigation → Culprit Selection → Case Evaluation → Final Reveal**

Example:

A user enters:

"A valuable diamond disappeared from a museum during a private exhibition. Four employees had access to the room, and the security camera stopped working for ten minutes."

The AI generates a complete fictional case containing:

- Four suspects with different motives and alibis.
- A description of the incident.
- WhatsApp-style chat screenshots or transcripts.
- Fictional CCTV footage or video-style evidence.
- Images of the crime scene and relevant objects.
- Witness statements.
- A chronological event timeline.
- Hidden clues and contradictions.
- One predetermined culprit.
- A final explanation connecting the evidence to the culprit.

The user examines the evidence, chooses a suspect, and submits their final accusation. The website evaluates the answer and reveals the solution.

## 1.3 Product Goals

1. Allow users to generate mysteries from their own story ideas.
2. Provide a realistic, interactive detective investigation experience.
3. Generate consistent suspects, clues, and solutions using Gemini.
4. Support multiple types of fictional evidence.
5. Ensure every mystery has a predetermined, logically supported culprit.
6. Prevent the culprit or solution from being revealed before the user submits their accusation.
7. Provide a clear explanation of why the selected culprit is correct or incorrect.
8. Deliver a modern, responsive, visually engaging website.
9. Keep the application modular, testable, and maintainable.

## 1.4 Target Users

- Mystery and detective story enthusiasts.
- Students and casual gamers.
- Users who enjoy puzzles, logical reasoning, and interactive storytelling.
- Groups looking for a fictional investigation game.

---

H1 2. Scope of the Project

## 2.1 Minimum Viable Product (MVP)

The first working version must include:

- A landing page.
- A mystery creation form.
- Scenario and story input.
- Mystery difficulty selection.
- AI-powered case generation using Gemini.
- A case introduction page.
- A suspect directory.
- An evidence investigation room.
- WhatsApp-style message evidence.
- Image evidence.
- CCTV-style evidence.
- Witness statements and other textual clues.
- A suspect selection and accusation system.
- Correct/incorrect answer evaluation.
- A final solution and case explanation.
- Loading, error, and retry states.
- Persistent case data during a browser session.
- Responsive desktop and mobile layouts.

## 2.2 Future Enhancements

These features are not required for the first release unless explicitly requested:

- User authentication and profiles.
- Cloud-saved investigation history.
- Leaderboards and scoring rankings.
- Multiplayer investigations.
- Time-limited challenges.
- User-created public mystery galleries.
- Community sharing.
- Voice-based witness interviews.
- AI-generated video with realistic motion.
- Premium subscriptions.

Codex must not prioritize future enhancements over the complete MVP.

---

H1 3. Technology Stack

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Frontend | React | User interface and application state |
| Language | JavaScript or TypeScript | Application logic; prefer TypeScript for new code |
| Styling | Tailwind CSS | Responsive layouts and visual styling |
| UI Icons | Lucide React | Consistent interface icons |
| Routing | React Router | Navigation between pages |
| Backend | Node.js | Server runtime |
| API Framework | Express.js | REST APIs and middleware |
| Database | MongoDB | Case, evidence, and investigation storage |
| ODM | Mongoose | MongoDB schemas and validation |
| AI | Google Gemini API | Mystery generation and structured AI reasoning |
| AI SDK | Official Google Gen AI SDK (`@google/genai`) | Backend Gemini integration |
| Image Processing | Gemini image generation or a compatible image-generation provider | Optional visual evidence creation |
| Video Evidence | Generated static frames or a compatible video-generation provider | Optional CCTV-style visual evidence |
| Validation | Zod | Request and AI response validation |
| Testing | Vitest/Jest and Supertest | Unit and API testing |
| Frontend Testing | React Testing Library | UI behavior testing |
| Environment | dotenv | Environment variable configuration |

## Technology rules

1. Use the MERN architecture: MongoDB, Express, React, and Node.js.
2. All Gemini requests must originate from the backend.
3. Never expose API keys in frontend code.
4. Do not use mock AI responses as the final implementation.
5. Use a provider abstraction for optional image and video generation.
6. Do not assume that Gemini text generation automatically produces image or video files.
7. If a visual generation provider is not configured, generate clearly labeled text-based or static evidence fallbacks.
8. Pin compatible dependency versions and document the installation commands.

---

H1 4. User Roles

## 4.1 Guest User

The MVP supports users without requiring registration.

A guest can:

- Open the homepage.
- Enter a story or scenario.
- Configure a mystery.
- Generate a case.
- Review suspects and evidence.
- Submit an accusation.
- View the final solution.
- Restart or create another mystery.

The application must maintain the current case while the user navigates between investigation pages.

## 4.2 Administrator

An administrator interface is not part of the MVP.

Administrative operations, API key management, provider configuration, and debugging are handled through backend configuration and development tools.

---

H1 5. Main User Journey

The application must follow this flow.

1. The user opens the landing page.
2. The user selects **Create a Mystery**.
3. The user enters a short scenario or story.
4. The user selects difficulty and optional settings.
5. The frontend validates the input.
6. The frontend submits the request to the backend.
7. The backend validates the request and generates the mystery using Gemini.
8. The backend validates the generated case and checks its internal consistency.
9. The backend creates and stores the case in MongoDB.
10. The user enters the investigation room.
11. The user reads the incident summary and examines the suspects.
12. The user opens evidence files and studies the clues.
13. The user marks evidence as reviewed and may record personal notes.
14. The user selects a suspect and submits a final accusation.
15. The backend evaluates the accusation against the stored solution.
16. The application reveals whether the answer is correct.
17. The user sees the culprit's identity, the explanation, and the evidence that supports the solution.
18. The user can replay the case or generate another mystery.

**Important:** The answer must be evaluated against the originally stored culprit, not against a newly generated AI response.

---

H1 6. Functional Requirements

## FR-01: Landing Page

The homepage must include:

- Project logo and name: AI Mystery Room.
- A short description of the experience.
- A prominent "Create a Mystery" button.
- An explanation of how the game works.
- A sample case preview.
- A visual section displaying evidence types.
- A responsive navigation bar.
- A footer with project information.

The design should resemble a modern detective investigation interface.

## FR-02: Mystery Creation

The creation form must contain:

### Required fields

*Scenario or story**

- A multiline text area.
- Minimum: 30 characters.
- Maximum: 5,000 characters.
- Required field.

### Optional settings

*Difficulty**

- Easy
- Medium
- Hard

*Mystery category**

- Theft
- Missing object
- Suspicious incident
- Corporate mystery
- Historical mystery
- Custom

*Number of suspects**

- 3 to 6.
- Default: 4.

*Evidence richness**

- Standard
- Detailed

The form must display validation messages next to invalid fields.

The user must be able to submit the form and see a generation progress state.

## FR-03: AI Mystery Generation

The backend must generate a complete fictional case based on the submitted scenario.

The generated case must contain:

1. Case title.
2. Case ID.
3. Case summary.
4. Incident description.
5. Location and approximate incident time.
6. Suspect profiles.
7. Motives and alibis.
8. Evidence collection.
9. Chronological timeline.
10. Hidden culprit.
11. Solution explanation.
12. Evidence supporting the solution.
13. Contradictions or misleading clues.
14. Final accusation instructions.

### Case generation rules

- There must be exactly one canonical culprit.
- The culprit must be selected before the investigation begins.
- The culprit must be one of the generated suspects.
- The evidence must support the canonical solution.
- Each suspect must have a distinct profile and plausible reason for suspicion.
- At least two suspects should initially appear plausible.
- The solution must be deducible from the evidence.
- Red herrings must not make the solution logically impossible.
- All timestamps and events must remain consistent.
- Evidence must not contradict the canonical solution unless the contradiction is intentional and explained.
- The final explanation must refer to actual evidence IDs.
- The hidden solution must not be included in public API responses before submission.

Gemini must return structured JSON matching a defined schema rather than arbitrary prose.

If the response is invalid, the backend may retry generation with a bounded retry limit. If generation still fails, the application must display a recoverable error rather than presenting a broken case.

## FR-04: Suspect Directory

Every case must contain 3–6 suspects.

Each suspect must have:

- Unique suspect ID.
- Name.
- Age appropriate to the fictional context.
- Occupation or role.
- Relationship to the incident.
- Background description.
- Possible motive.
- Stated alibi.
- Relevant evidence references.
- Optional AI-generated portrait.
- Initial suspicion level or investigative summary.

The suspect directory must use cards or a similarly clear layout.

The interface must not expose internal culprit flags or secret solution fields.

The suspect's public profile must be distinct from the private solution data.

## FR-05: Evidence Room

The investigation room is the core feature of the application.

The evidence room must support:

### A. WhatsApp-style Messages

Display fictional conversations in a chat interface.

Each message must include:

- Sender.
- Recipient or conversation participants.
- Timestamp.
- Message content.
- Conversation or evidence ID.

The messages must be fictional and generated for the mystery.

The interface must not impersonate real users or imply that the messages came from actual private accounts.

### B. Image Evidence

Examples include:

- A fictional crime scene.
- A missing or damaged object.
- A room or building entrance.
- A suspicious item.
- A fictional photograph with a relevant clue.

Each image must have:

- Evidence ID.
- Title.
- Description.
- Image URL or generated asset reference.
- Capture time, if applicable.
- Source or context.
- Investigation relevance, kept hidden if it reveals the solution.

Images must open in a larger preview when selected.

### C. CCTV Evidence

The application must display a fictional CCTV-style evidence item.

The MVP may use:

- A generated still image.
- A sequence of generated frames.
- A short generated video when a video provider is configured.
- A timestamped textual transcript as a fallback.

CCTV evidence must include:

- Camera ID.
- Location.
- Recording time.
- Description.
- Relevant observed events.
- Video or image asset reference when available.

If an actual video-generation service is not configured, the system must not pretend that a video file has been generated. It should display a clearly labeled CCTV reconstruction or static evidence alternative.

### D. Witness Statements

Statements from witnesses must include:

- Witness identity.
- Statement text.
- Interview time.
- Relevant timeline events.
- Optional reliability indicators.

### E. Documents and Other Clues

Additional evidence may include:

- Access logs.
- Receipts.
- Notes.
- Emails.
- Security logs.
- Timelines.
- Object descriptions.

### Evidence interaction

Users must be able to:

- Open an evidence item.
- Read its details.
- View images.
- Play available videos.
- Mark evidence as reviewed.
- Add personal investigation notes.
- Filter evidence by type.
- View the total number of reviewed items.

The evidence interface must not display the culprit's identity or the final explanation before the user submits an accusation.

## FR-06: Investigation Dashboard

The investigation dashboard must show:

- Case title and summary.
- Case progress.
- Suspect count.
- Evidence count.
- Reviewed evidence count.
- Suspect directory.
- Evidence room.
- Investigation timeline.
- Personal notes.
- Accusation action.

A recommended navigation layout is:

- Overview
- Suspects
- Evidence
- Timeline
- Make Accusation

The interface should make it easy to switch between evidence and suspect profiles.

## FR-07: Timeline

Each case must include a chronological timeline of relevant events.

Every timeline event must contain:

- Event ID.
- Timestamp.
- Description.
- Related suspect IDs, if applicable.
- Related evidence IDs.
- Whether the event is confirmed, alleged, or uncertain.

The timeline must be generated consistently with the evidence and suspect alibis.

Users should be able to compare timeline events with statements and recorded evidence.

## FR-08: Final Accusation

The user must select one suspect as the culprit.

The accusation screen must:

1. Display all available suspects.
2. Allow selection of exactly one suspect.
3. Provide an optional explanation for the accusation.
4. Require confirmation before final submission.
5. Submit the selected suspect ID to the backend.
6. Prevent duplicate final submissions.
7. Lock the case after the final answer unless replay is selected.

The system must not trust a culprit ID or correctness value sent by the frontend.

## FR-09: Case Evaluation and Reveal

After the accusation is submitted, the backend must compare the selected suspect ID with the stored canonical culprit ID.

The result must include:

- Correct or incorrect status.
- The actual culprit.
- Explanation of the culprit's motive.
- Explanation of how the incident occurred.
- Relevant evidence and their IDs.
- Explanation of important contradictions.
- Explanation of misleading clues.
- A chronological reconstruction of the incident.
- Optional feedback on the user's written reasoning.

The backend must perform the correctness comparison deterministically.

Gemini may help generate the explanatory narrative, but it must not change the canonical answer.

## FR-10: Restart and New Case

The user must be able to:

- Replay the same case.
- Reset the investigation progress.
- Return to the homepage.
- Generate a new case.

Restarting must not accidentally modify the original stored solution.

---

H1 7. AI and Gemini Integration

## 7.1 Backend Architecture

All AI calls must be performed by the Node.js backend.

Recommended flow:

User Input → Express API → Input Validation → Gemini Service → JSON Parsing → Schema Validation → Consistency Checks → MongoDB → Public Case Response

## 7.2 Gemini Service

Create a dedicated service module, for example:

`server/src/services/geminiService.ts`

Responsibilities:

- Initialize the Gemini client.
- Generate mystery case data.
- Request schema-constrained JSON output where supported.
- Parse and validate responses.
- Handle model errors and timeouts.
- Apply bounded retries.
- Avoid logging API keys or sensitive configuration.
- Return normalized errors to the application.

Use a model name configurable through environment variables. Do not hard-code a model that may be unavailable to the configured API account.

## 7.3 Generation Strategy

Use a two-part internal case structure:

*Public case data**

- Summary.
- Suspects.
- Evidence.
- Timeline.
- Investigation instructions.

*Private solution data**

- Canonical culprit ID.
- Actual sequence of events.
- True motives.
- Evidence-to-solution mapping.
- Explanation of misleading clues.

The backend must separate these structures before returning data to the frontend.

The public case endpoint must never return private solution fields.

## 7.4 Consistency Validation

Before saving a generated case, validate:

- All IDs are unique.
- The culprit ID references an existing suspect.
- Evidence references point to valid suspects or events where applicable.
- Timestamps use a consistent format.
- Required fields are present.
- There is exactly one canonical culprit.
- The final explanation references real evidence IDs.
- The timeline agrees with the canonical event sequence.
- At least two clues support the final deduction.
- The case contains no accidental answer leaks in its public text.

If consistency checks fail, retry or regenerate the affected content within a bounded limit.

Do not silently accept malformed cases.

## 7.5 Optional Visual Generation

Create a separate visual-generation service abstraction.

Example:

`server/src/services/mediaGenerationService.ts`

The service may generate:

- Suspect portraits.
- Locations.
- Objects.
- Fictional crime scenes.
- CCTV-style stills.

Visual assets must be stored using a configured storage provider or another documented asset strategy.

Do not place large binary image or video files directly inside MongoDB documents.

If no image provider is configured, the system must continue working with text-based evidence and clearly labeled placeholders.

Generated images must be fictional and must not be presented as authentic evidence from a real incident.

---

H1 8. Data Models

Use MongoDB with Mongoose schemas and validation.

## 8.1 MysteryCase

Suggested fields:

- `_id`
- `title`
- `scenario`
- `category`
- `difficulty`
- `status`
- `publicCase`
- `privateSolution`
- `createdAt`
- `updatedAt`
- `generationMetadata`

`status` may include:

- `generating`
- `ready`
- `failed`

The private solution must never be serialized into public API responses.

## 8.2 PublicCase

Suggested structure:

- `summary`
- `incidentDescription`
- `location`
- `incidentTime`
- `suspects[]`
- `evidence[]`
- `timeline[]`
- `investigationInstructions`

## 8.3 Suspect

Suggested fields:

- `id`
- `name`
- `age`
- `occupation`
- `relationshipToIncident`
- `background`
- `motive`
- `alibi`
- `portraitAssetId`
- `relatedEvidenceIds`

Do not include `isCulprit` in the public suspect model.

## 8.4 Evidence

Suggested fields:

- `id`
- `type`
- `title`
- `description`
- `createdAt`
- `timestamp`
- `assetUrl`
- `transcript`
- `relatedSuspectIds`
- `relatedEventIds`
- `metadata`

Allowed evidence types:

- `chat`
- `image`
- `cctv`
- `witness_statement`
- `document`
- `access_log`
- `other`

The evidence schema must allow different evidence types without requiring every field for every type.

## 8.5 PrivateSolution

Suggested fields:

- `culpritSuspectId`
- `trueMotive`
- `actualSequenceOfEvents`
- `evidenceReasoning[]`
- `redHerringExplanations[]`
- `finalExplanation`

Each evidence reasoning item should contain:

- `evidenceId`
- `reasoning`
- `supportsConclusion`

## 8.6 InvestigationSession

Suggested fields:

- `_id`
- `caseId`
- `sessionTokenHash`
- `reviewedEvidenceIds[]`
- `notes[]`
- `status`
- `accusation`
- `result`
- `createdAt`
- `updatedAt`

Session statuses:

- `investigating`
- `submitted`
- `revealed`

The submitted accusation should contain the selected suspect ID and submission time.

Store a hash of the session token rather than the raw token.

The session must reference the case's canonical solution rather than storing a separately generated answer.

## 8.7 Asset

Suggested fields:

- `_id`
- `caseId`
- `type`
- `provider`
- `storageKey`
- `contentType`
- `status`
- `createdAt`

Do not store API keys, raw provider credentials, or unnecessarily large media payloads in asset documents.

---

H1 9. REST API Specification

Use the base path:

`/api/v1`

All request and response payloads must use JSON unless a documented upload endpoint requires multipart form data.

## 9.1 Generate a Mystery

**POST `/api/v1/cases`**

Request:

```json
{
  "scenario": "A diamond disappears from a museum.",
  "difficulty": "medium",
  "category": "theft",
  "suspectCount": 4,
  "evidenceRichness": "standard"
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "caseId": "case_123",
    "title": "The Missing Diamond",
    "status": "ready",
    "summary": "A diamond disappears during a private exhibition."
  }
}
```

The response must not contain the culprit or private solution.

Return HTTP 201 when a case is created successfully.

## 9.2 Get a Case

**GET `/api/v1/cases/:caseId`**

Returns the public case, including suspects, evidence metadata, and timeline.

It must never return `privateSolution`.

## 9.3 Get Case Evidence

**GET `/api/v1/cases/:caseId/evidence`**

Optional query parameters:

- `type`
- `page`
- `limit`

Returns filtered, paginated evidence.

## 9.4 Get a Specific Evidence Item

**GET `/api/v1/cases/:caseId/evidence/:evidenceId`**

Returns the selected public evidence item.

Hidden solution reasoning must remain excluded.

## 9.5 Create Investigation Session

**POST `/api/v1/cases/:caseId/sessions`**

Creates an investigation session and returns a session identifier or secure session token.

The implementation must document how the token is sent with later requests.

## 9.6 Update Reviewed Evidence

**PATCH `/api/v1/sessions/:sessionId/evidence/:evidenceId`**

Request:

```json
{
  "reviewed": true
}
```

The backend must verify that the evidence belongs to the case associated with the session.

## 9.7 Save Notes

**PUT `/api/v1/sessions/:sessionId/notes`**

Request:

```json
{
  "notes": [
    {
      "content": "The recorded time conflicts with the suspect's alibi."
    }
  ]
}
```

Validate note length and request structure.

## 9.8 Submit Accusation

**POST `/api/v1/sessions/:sessionId/accusation`**

Request:

```json
{
  "suspectId": "suspect_2",
  "reasoning": "The access log conflicts with the stated alibi."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "revealed",
    "correct": false,
    "solution": {
      "culpritSuspectId": "suspect_3",
      "explanation": "The evidence establishes a different sequence of events.",
      "supportingEvidenceIds": [
        "evidence_2",
        "evidence_5"
      ]
    }
  }
}
```

The above is an illustrative response only. Real values must come from the stored case.

This endpoint must reveal the solution only after successful submission.

## 9.9 Health Check

**GET `/api/v1/health`**

Returns service health and basic dependency status without exposing credentials or internal secrets.

## 9.10 API Error Format

Use a consistent error structure:

```json
{
  "success": false,
  "error": {
    "code": "CASE_GENERATION_FAILED",
    "message": "The mystery could not be generated. Please try again."
  }
}
```

Use appropriate HTTP status codes:

- `400` — Invalid input.
- `401` or `403` — Unauthorized session or operation.
- `404` — Case, session, or evidence not found.
- `409` — Duplicate submission or invalid state transition.
- `413` — Request too large.
- `429` — Rate limit exceeded.
- `500` — Unexpected server error.
- `502` or `503` — AI provider failure or temporary unavailability.

Never return stack traces, secrets, or private solution data in public errors.

---

H1 10. Frontend Pages and Components

Recommended project routes:

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/create` | Mystery creation form |
| `/case/:caseId` | Case introduction |
| `/case/:caseId/investigate` | Investigation dashboard |
| `/case/:caseId/suspects` | Suspect directory |
| `/case/:caseId/evidence` | Evidence room |
| `/case/:caseId/accuse` | Accusation screen |
| `/case/:caseId/result` | Final reveal |

The frontend must not determine the canonical culprit or calculate the final result independently.

Recommended React components:

- `Navbar`
- `HeroSection`
- `MysteryCreationForm`
- `GenerationProgress`
- `CaseOverview`
- `SuspectCard`
- `SuspectProfile`
- `EvidencePanel`
- `EvidenceCard`
- `ChatEvidenceViewer`
- `ImageEvidenceViewer`
- `CCTVEvidenceViewer`
- `WitnessStatementViewer`
- `InvestigationTimeline`
- `InvestigationNotes`
- `CaseProgress`
- `AccusationForm`
- `CaseReveal`
- `ErrorState`
- `EmptyState`
- `LoadingSkeleton`

Organize components by feature rather than placing the entire application in one large component.

---

H1 11. UI/UX Design Requirements

## 11.1 Design Direction

The website should feel like a premium digital detective investigation room.

Use:

- Dark charcoal backgrounds.
- Deep navy panels.
- Muted gray secondary text.
- Restrained amber or gold accents.
- Clear typography.
- Evidence-card layouts.
- Subtle borders and shadows.
- Consistent spacing.
- Smooth but restrained transitions.

Avoid excessive animations, bright gaming colors, cluttered layouts, and unnecessary visual effects.

## 11.2 Investigation Room Layout

Recommended desktop layout:

- Left sidebar: suspects, evidence categories, and navigation.
- Main panel: selected evidence or investigation timeline.
- Right panel: case details, notes, or evidence metadata.

On smaller screens, transform the side panels into collapsible drawers or stacked sections.

## 11.3 Evidence Visual Design

- Chat evidence should look like a fictional messaging interface.
- Image evidence should display a thumbnail and expandable preview.
- CCTV evidence should resemble a security monitor and display timestamps.
- Witness statements should resemble interview reports.
- Documents should be readable without excessive scrolling.
- Timeline events should clearly display their chronological order.

## 11.4 Accessibility

- Use semantic HTML.
- Provide labels for all form inputs.
- Support keyboard navigation.
- Maintain readable color contrast.
- Provide alt text for meaningful images.
- Do not rely on color alone to communicate correctness or status.
- Provide text alternatives for visual evidence when available.

---

H1 12. Security and Privacy Requirements

1. Store Gemini API keys only in backend environment variables.
2. Validate and sanitize all incoming requests.
3. Use request-size limits.
4. Apply rate limiting to case generation and accusation endpoints.
5. Prevent NoSQL injection by validating inputs and avoiding unsafe query construction.
6. Prevent cross-site scripting by rendering user input as text rather than trusted HTML.
7. Configure CORS for approved frontend origins.
8. Never expose the private solution through public APIs, logs, browser storage, or frontend bundles.
9. Verify case and session ownership or possession of the appropriate secure session token on every protected request.
10. Prevent users from submitting accusations for unrelated sessions.
11. Use bounded timeouts and retries for AI calls.
12. Keep provider errors separate from public-facing error messages.
13. Avoid logging complete API keys, session tokens, or unnecessary user-generated content.
14. Configure a retention policy for abandoned cases and sessions.
15. Use HTTPS in production.
16. Treat user-provided scenarios as untrusted content, not as instructions that can override system rules.
17. Keep AI prompts on the server.
18. Use synthetic evidence only; clearly identify the experience as fictional.
19. Do not create evidence intended to impersonate real people or falsely accuse real individuals of wrongdoing.
20. Do not execute code, follow external instructions, or fetch arbitrary URLs merely because a user included them in a scenario.

The mystery must be fictional, and the final reveal must explain that the generated scenario and evidence are simulated.

---

H1 13. Error Handling and Reliability

The application must handle the following cases gracefully:

- Gemini API key is missing.
- Gemini model is unavailable.
- Gemini returns malformed JSON.
- The AI provider times out.
- The AI provider returns an empty response.
- MongoDB is unavailable.
- A case ID is invalid.
- Evidence is missing.
- The user submits an invalid suspect ID.
- The user submits an accusation twice.
- The user refreshes the page during an investigation.
- An image fails to load.
- A video provider is not configured.
- A user submits an excessively long scenario.
- Case generation exceeds the configured timeout.

For each case, display an understandable message and provide a safe recovery option where appropriate.

The application must not silently convert failed AI generation into a fabricated success response.

---

H1 14. Environment Configuration

Provide separate `.env.example` files for the frontend and backend when needed.

Backend configuration should include:

```dotenv
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room
GEMINI_API_KEY=
GEMINI_MODEL=
CLIENT_ORIGIN=http://localhost:5173
SESSION_SECRET=
```

Optional visual provider configuration:

```dotenv
IMAGE_PROVIDER=
IMAGE_PROVIDER_API_KEY=
VIDEO_PROVIDER=
VIDEO_PROVIDER_API_KEY=
ASSET_STORAGE_PROVIDER=
ASSET_STORAGE_BUCKET=
```

These are configuration placeholders, not actual credentials.

Rules:

- Never commit `.env` files containing secrets.
- Commit `.env.example` files without real credentials.
- Validate required environment variables at backend startup.
- Provide clear setup instructions for MongoDB and Gemini.
- Allow the application to run without optional image or video providers.
- Use the currently supported Gemini model available to the configured account.

---

H1 15. Project Folder Structure

Use a monorepo layout:

```text
ai-mystery-room/
├── SPEC.md
├── README.md
├── .gitignore
├── package.json
├── client/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       │   ├── mystery-creation/
│       │   ├── investigation/
│       │   ├── suspects/
│       │   ├── evidence/
│       │   └── accusation/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── types/
│       ├── utils/
│       └── main.tsx
├── server/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       │   ├── geminiService.ts
│       │   ├── mysteryGenerationService.ts
│       │   ├── caseValidationService.ts
│       │   ├── solutionService.ts
│       │   └── mediaGenerationService.ts
│       ├── utils/
│       ├── types/
│       ├── app.ts
│       └── server.ts
└── tests/
    ├── api/
    ├── integration/
    └── fixtures/
```

Adjust the structure only when a clear technical reason exists. Preserve the separation between frontend, backend, AI generation, validation, and solution handling.

---

H1 16. Testing Requirements

## 16.1 Unit Tests

Test:

- Scenario input validation.
- Gemini response parsing.
- Mystery schema validation.
- Unique ID validation.
- Culprit reference validation.
- Evidence reference validation.
- Timeline consistency.
- Public/private response separation.
- Correct and incorrect accusation evaluation.
- Duplicate accusation prevention.

## 16.2 API Tests

Test:

- Creating a mystery.
- Fetching a case.
- Fetching evidence.
- Creating an investigation session.
- Marking evidence as reviewed.
- Saving investigation notes.
- Submitting an accusation.
- Retrieving the final result.
- Invalid case and session IDs.
- Missing or invalid request fields.
- AI provider failures.
- Database failures.

## 16.3 Frontend Tests

Test:

- Form validation.
- Loading indicators.
- Evidence selection.
- Suspect selection.
- Reviewed evidence tracking.
- Accusation confirmation.
- Result display.
- Error and retry states.
- Responsive navigation.

## 16.4 End-to-End Test

The complete user journey must be tested:

1. Open the homepage.
2. Enter a valid scenario.
3. Generate a mystery.
4. Open the case.
5. Inspect suspects.
6. Open different evidence types.
7. Mark evidence as reviewed.
8. Submit an accusation.
9. View the final reveal.
10. Restart or create another case.

Automated tests must not depend on a live Gemini API for every test run. Use deterministic mocked provider responses for automated tests, while keeping real Gemini integration available for manual end-to-end testing.

---

H1 17. Definition of Done

The MVP is considered complete only when all the following conditions are satisfied.

- [ ] The frontend and backend run locally.
- [ ] MongoDB persistence works.
- [ ] Gemini generates a case from a user-provided scenario.
- [ ] Generated cases contain 3–6 distinct suspects.
- [ ] Every case has exactly one canonical culprit.
- [ ] Every case contains multiple meaningful evidence items.
- [ ] The evidence includes chat-style messages, image evidence support, and CCTV-style evidence support.
- [ ] Optional visual generation works when a provider is configured.
- [ ] The website remains usable when optional media providers are unavailable.
- [ ] The evidence and timeline remain logically consistent with the solution.
- [ ] The culprit is not revealed before accusation submission.
- [ ] The frontend cannot determine or alter the correct answer.
- [ ] The backend evaluates accusations using the stored solution.
- [ ] The final explanation references real evidence IDs.
- [ ] The investigation session survives a browser refresh under the documented session strategy.
- [ ] Loading and error states work correctly.
- [ ] The application is responsive.
- [ ] Required automated tests pass.
- [ ] The README contains complete setup and run instructions.
- [ ] No secrets are committed to source control.
- [ ] The project can be started by following the documented commands.

---

H1 18. Development Phases

Codex must implement the application incrementally.

## Phase 1: Project Foundation

- Initialize the monorepo.
- Set up React and Express.
- Configure TypeScript.
- Configure Tailwind CSS.
- Configure MongoDB and Mongoose.
- Add environment validation.
- Create a health-check endpoint.
- Document installation and startup.

**Exit condition:** Frontend, backend, and database connectivity are working.

## Phase 2: Core Case Generation

- Integrate the official Gemini SDK.
- Create generation prompts.
- Define Zod schemas.
- Implement structured output parsing.
- Implement consistency validation.
- Separate public and private case data.
- Save generated cases in MongoDB.

**Exit condition:** A valid case can be generated and retrieved without exposing the solution.

## Phase 3: Investigation Interface

- Build the landing page.
- Build the mystery creation form.
- Build the case overview.
- Build the suspect directory.
- Build the evidence room.
- Build chat, image, CCTV, and witness evidence viewers.
- Build the investigation timeline.

**Exit condition:** A user can examine a generated case.

## Phase 4: Investigation Sessions

- Implement session creation.
- Track reviewed evidence.
- Save investigation notes.
- Implement secure session access.
- Support refresh and recovery.

**Exit condition:** Investigation progress persists according to the documented session strategy.

## Phase 5: Accusation and Reveal

- Implement suspect selection.
- Implement accusation submission.
- Validate the suspect and session on the backend.
- Evaluate the answer deterministically.
- Generate or retrieve the final explanation.
- Lock the completed session.

**Exit condition:** The complete mystery-solving flow works from beginning to end.

## Phase 6: Media Generation

- Add the optional image-generation provider.
- Store and serve generated media safely.
- Add CCTV frame or video support.
- Add explicit fallbacks when providers are unavailable.

**Exit condition:** Visual evidence is handled correctly without making unsupported claims about generated assets.

## Phase 7: Testing and Finalization

- Add unit, API, integration, and frontend tests.
- Run the full application.
- Fix all blocking defects.
- Verify API security.
- Test mobile and desktop layouts.
- Finalize documentation.

**Exit condition:** All mandatory acceptance criteria pass.

---

H1 19. Rules for Codex

This document is the single source of truth for the project.

Codex must follow these rules throughout implementation.

1. Read `SPEC.md` before creating or modifying code.
2. Treat the functional requirements, data models, API contracts, security rules, and acceptance criteria as authoritative.
3. Do not replace the MERN stack or Gemini integration with unrelated technologies.
4. Do not create a frontend-only demo when a working full-stack implementation is required.
5. Do not fabricate successful AI responses when the provider fails.
6. Do not expose the canonical culprit in public responses before the accusation.
7. Keep all secret solution data on the backend.
8. Do not hard-code a fixed mystery as the primary application behavior.
9. Do not assume that text generation automatically creates actual image or video files.
10. Do not introduce authentication, subscriptions, multiplayer, or other out-of-scope features before the MVP works.
11. Use reusable components, typed interfaces, validation schemas, and centralized error handling.
12. Keep controllers thin and place business logic in service modules.
13. Avoid unnecessary dependencies and duplicated logic.
14. Add tests for important business rules and security boundaries.
15. Update the README whenever setup commands, environment variables, or application behavior changes.
16. If a requirement is ambiguous, choose the simplest implementation consistent with this specification and document the decision.
17. If two requirements conflict, prioritize security and solution confidentiality, then the explicit functional requirements.
18. If an external provider is unavailable, implement the documented fallback rather than blocking unrelated functionality.
19. Do not claim that a feature works until it has been implemented and tested.
20. Before considering a phase complete, verify its exit conditions.

## Final Implementation Instruction

Build AI Mystery Room as a complete, working, responsive, full-stack web application according to this specification.

Start with Phase 1. Inspect the repository before making changes, create a concise implementation checklist, and implement the project in phases.

After each phase:

- Run the relevant tests.
- Fix errors before proceeding.
- Summarize the files created or changed.
- Document any deviation from this specification.
- Identify the exact command needed to run or test the application.

Do not stop after generating the project structure or static UI. Continue until the complete MVP is implemented, tested, and documented.

---

H1 20. Future Change Policy

Any new requirement must be evaluated against this specification before implementation.

For significant changes:

1. Update the relevant section of `SPEC.md`.
2. Update affected data models and API contracts.
3. Update acceptance criteria and tests.
4. Implement the change.
5. Verify that existing functionality remains correct.

Do not let undocumented assumptions in the code become the source of truth.

**The specification defines what the product must do. The implementation must conform to the specification.**
