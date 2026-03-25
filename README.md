# Ghosted 👻

Ghosted is a React demo app for tracking job applications, estimating ghost probability, and generating AI-powered follow-up emails.

## Features

- Application CRUD stored in localStorage
- Ghost detection algorithm with status-aware thresholds
- Filterable dashboard with stats and ghost-o-meter
- AI follow-up email generator via OpenAI Chat Completions
- Dark themed UI with animated cards and gradient accents

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment Variables

Create a `.env` file:

```bash
VITE_OPENAI_API_KEY=your_openai_api_key
```

If missing, the app will show a helpful error when you try to generate an email.

## Project Structure

- `src/hooks/useApplications.js` — localStorage CRUD state
- `src/hooks/useGhostDetection.js` — ghost probability logic
- `src/services/openai.js` — OpenAI integration
- `src/components/*` — dashboard and modal UI components
- `src/styles/theme.js` — CSS variables and theme constants
