# Anubhav Patel — Personal Portfolio Website

A fast, eye-catching, and modern developer portfolio engineered for **Anubhav Patel** (Computer Science Student & Aspiring AI Engineer). 

Built from scratch using **React 18**, **Vite 6**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**.

---

## Key Features

1. **Neural Particle Canvas Background**:
   - An interactive 60fps canvas simulation with dynamic node links that react to mouse proximity.
2. **Hero & Verified Credentials**:
   - Animated gradient typography, status beacon (*Available for work*), and official Oracle OCI AI Foundations badge.
   - Clean circular avatar placeholder with clear comments for easy replacement (`/assets/avatar.svg`).
3. **Interactive Developer CLI Terminal (`anubhav@ai-lab:~`)**:
   - Browser-based command line interface with autocomplete and quick-click preset pills.
   - Supports `help`, `whoami`, `skills`, `projects`, `education`, `certifications`, `contact`, and `clear`.
4. **Curated Bento Projects Showcase**:
   - Interactive category filtering: *All*, *AI & LLM*, *APIs & Backend*, *Media & Downloader*, *Client & University*, and *Tools*.
   - Displays all 13 verified GitHub repositories + UNITE CBT examination software + Lotus Study coaching platform.
5. **Categorized Technical Skills (Zero Percentage Bars)**:
   - Grouped into *AI & Prompting*, *Languages*, *Web & Full-Stack*, *APIs & Storage*, and *Tools & Workflow*.
   - Rendered as tags and chips without arbitrary percentage ratings.
6. **Timeline (Date Only, No Scores)**:
   - Displays institution, board/course, and "Passed <year>" or "Pursuing" status.
   - Education: BCA (Pursuing), Intermediate CBSE (Passed 2025), High School ICSE (Passed 2023).
   - Certifications: Oracle OCI AI Foundations Associate (Passed 2025), Skillup, Newton School, W3Schools.
7. **Direct Contact Card (No Phone Number)**:
   - One-click copy email button with celebratory confetti animations.
   - Omission of mobile phone number in compliance with hard rules.

---

## Development & Build Commands

### Install dependencies
```powershell
npm install
```

### Start Local Development Server
```powershell
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### Type Check & Build for Production
```powershell
npm run build
```
Production assets are compiled to `dist/`.

### Preview Production Build
```powershell
npm run preview
```

### Run Local Production Server
```powershell
node server.js
# or
npm start
```

---

## Deploying to Vercel

This project is fully configured and optimized for zero-configuration Vercel deployment:

### Option 1: Deploy via GitHub (Recommended)
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel automatically detects the Vite framework and applies the settings from `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

### Option 2: Deploy via Vercel CLI
```powershell
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Deploy directly from terminal
vercel
```

All SPA routes (`/projects`, `/project`, `/contact`), assets caching, and security headers are managed via `vercel.json`.

