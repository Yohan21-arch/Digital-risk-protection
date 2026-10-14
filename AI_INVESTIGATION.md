# Mirage AI investigation

Mirage has two complementary layers: (1) deterministic explainable detection and (2) AI-assisted investigation and semantic analysis. The existing deterministic score is authoritative. Gemini returns a separate verdict and confidence, never a replacement risk score or additional scoring points.

## Setup and deployment

Set `GEMINI_API_KEY` as a **server-side environment variable in Vercel**, then redeploy. Never prefix this secret with `VITE_`. Optional `GEMINI_MODEL` selects a server-controlled model; the default is `gemini-3.8-flash`. The existing `@google/genai` SDK is reused with structured JSON output and a server-owned schema/system instruction. No new packages are required.

The root `api/analyze-threat.ts` exports a Node Web handler for `POST /api/analyze-threat`. Vercel builds this function separately from the Vite browser bundle. Use `vercel dev` for local end-to-end API development; plain `npm run dev` serves only Vite and shows a useful endpoint-unavailable message. `npm run build` validates the frontend bundle, not a deployed Vercel function. `npm run lint` is the project's TypeScript check (`tsc --noEmit`) and includes the endpoint/server modules.

References: [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js), [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/generate-content/structured-output).

## Investigation flow

Open Deep Investigation for a social account or mobile app and explicitly select **Analyze with AI**. Opening a candidate never starts a paid call. The selected brand, canonical references, candidate text, and already-computed signals are projected onto a small allowlist. Candidate summaries are the available description evidence; no unavailable platform content is invented. Web-domain AI analysis is outside this initial scope.

The endpoint validates JSON, field types, platform/type consistency, score bounds, text/array lengths and a 24 KB request limit (including streamed bodies). It rejects non-POST and cross-origin browser requests. The provider call has a 25-second timeout and abort signal; the browser has a 30-second timeout. Invalid model JSON, rate limits, missing configuration and other failures return safe errors and enable Retry without blocking the deterministic investigation. Responses use `Cache-Control: no-store`.

All evidence, including brand-reference strings, is treated as untrusted. The server system prompt explicitly rejects embedded commands, delimiter spoofing, role changes and output-format changes. JSON-escaped evidence is supplied only as user data. Gemini receives no browsing, URL-fetching or action tools. Runtime response validation accepts only the defined verdicts, numeric bounded confidence and expected fields. React renders plain text; model HTML is never executed. These measures reduce prompt-injection risk but cannot guarantee model factual accuracy.

No environment variables, credentials, full application state, candidate images or Supabase secrets are sent. Only relevant evidence is sent to Gemini after the user clicks the action. Evidence is not logged or persisted by this feature. Do not put private credentials in candidate descriptions. Gemini provider data handling is governed by the configured account's terms.

## Reports and limits

Copy Report and Download .txt Report use the same evidence snapshot as the completed AI request. Reports separate deterministic assessment, AI verdict/confidence, semantic findings, recommended human action and limitations, and include the controlled/simulated-data prototype notice. The panel resets when the brand or candidate evidence changes. Existing Motion transitions honor the reduced-motion preference; there is no continuous animation.

The prototype has no analyst authentication or durable API quota system. Same-origin checks are not authentication and do not stop direct HTTP clients. Enable Vercel deployment protection and provider spending/quota limits for a shared demo; add authenticated access and shared rate limiting before unrestricted public use. The server validates evidence shape but does not independently certify browser-supplied evidence as trusted. AI output is advisory and cannot execute a takedown or update a candidate.

Validation covers structured input/output, injection handling, clamping, unchanged risk, API and network failures, missing keys, report contents, initial modal usability and all four verdicts with controlled responses. Live semantic accuracy requires a configured Gemini key and account access to the selected model. Missing evidence can produce `Insufficient Evidence`; null semantic similarity explicitly means unavailable.
