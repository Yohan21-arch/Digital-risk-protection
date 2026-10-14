Mirage

Digital Risk Protection for Social & App Monitoring

Mirage helps organizations find and prioritize brand impersonation across social media and mobile app stores. A company defines its official identity once, and Mirage scans external ecosystems for look-alike profiles, fake pages, scam accounts and rogue app listings, then scores each candidate with explainable evidence. Official assets are recognized and never flagged.

Live demo: http://sentinelbrand-virid.vercel.app/

Scores are review signals, not final verdicts. Always check the evidence and the trusted registry before acting.

How it works

Mirage runs as a repeatable loop:

Set the baseline. Record official domains, app IDs, social handles, publishers and a reference logo.
Search and monitor. Scan social profiles, app listings and look-alike names for possible impersonation.
Inspect evidence. Review match signals, source, severity, and whether the candidate is already trusted.
Triage and respond. Investigate, document and prepare a takedown or follow-up action.
Features
Area	What it does
Brand Profile	Identity registry for official domains, publishers, package IDs and social handles. Upload a reference logo to set a 64-bit dHash visual baseline.
Verified Assets	Safe-harbor registry of official properties. Matching assets are excluded from look-alike scoring to reduce false alarms.
Brand Search	Pick a protected brand and run a staged scan: brand identity, safe harbor, social, app stores, look-alikes, account checks, risk analysis, triage. Filter by source and severity.
Social Monitoring	Compare accounts on X, Instagram, Facebook and Telegram using logo resemblance, name similarity, follower reach and suspicious bio redirects.
App Monitoring	Check store listings against trusted publishers and package namespaces using publisher mismatch, package ID, description similarity and icon resemblance.
Look-alike detection	Catches character swaps (e.g. paypa1), added words (e.g. brand-support) and spacing changes (e.g. br and), with safeguards against flagging normal names.
Detection Center	Turn alerts into cases: candidate intake, scoring, investigation, CSV export and a takedown workflow.
Overview and controls	KPI strip, high-severity queue, source health with graceful handling of unavailable connectors, and a Ctrl/Cmd+K search.
Detection approach

Each candidate (MIRAGE) is scored on several signals, and the signals are combined into a risk band:

Name similarity: normalization, homoglyph mapping and edit-distance matching.
Look-alike variants: character swaps, added words and spacing changes.
Logo similarity: perceptual hashing (dHash/pHash) compared to the official logo baseline.
Publisher or owner mismatch: the candidate's publisher or account differs from the registered official ones.
Description and bio resemblance: text similarity to official content plus scam-style keywords.

Official exclusion: candidates are checked against the Verified Assets registry before scoring, so official accounts and apps are labeled as trusted instead of flagged.

Avoiding over-flagging: common-word handling and multi-signal requirements keep ordinary names from being marked high risk.

Architecture
Data sources (social platforms, app stores)
        |
   Source connectors  -->  Normalizer
        |
   Safe-harbor filter (official assets removed)
        |
   Detection engine (name, logo, publisher, description)
        |
   Risk scoring and severity bands
        |
   Storage (Supabase)  -->  Dashboard / Detection Center
Tech stack
Frontend: React, Vite
Backend and storage: Supabase
Hosting: Vercel
UI theme: night-themed retro design inspired by Big Hero 6
Getting started
Prerequisites
Node.js 18 or newer
A Supabase project (for the backend)
Install and run
bash
git clone <https://github.com/Yohan21-arch/Digital-risk-protection>
cd <Digital-risk-protection>
npm install
cp .env.example .env
npm run dev

Open the local URL printed by Vite (usually http://localhost:5173).

Environment variables

Create a .env file in the project root. Use the names your code actually reads; the typical Vite setup is:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
Build for production
bash
npm run build
npm run preview
Security notes
Never commit .env files or real keys. .env is listed in .gitignore.
Only the Supabase anon key belongs in frontend code, and only with Row Level Security enabled on every table.
The Supabase service_role key must never appear in the frontend or this repository. Rotate it immediately if it was ever exposed.
On Vercel, set keys as Environment Variables in the project settings.
Prototype limitations
Scoring is a review aid. It does not replace human verification before a takedown.
Roadmap
Scheduled scans and email or Slack alerts
Evidence screenshots attached to cases
One-click takedown report drafts
ML-based logo matching
More platforms and domain/phishing-site monitoring
Multi-brand teams
Project structure
src/
  components/   UI components and pages
  ...           (update to match your actual folders)
public/
.env.example


Team - YANTRIK

Built for the Digital Risk Protection challenge hackathon by <made by- YOHAN AHMAD,ANUBHAV MISHRA,AADYA DWIVEDI,ANSH TRIPATHI,ARYA VEER SINGH>.
