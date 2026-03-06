# 📊 DevPulse

> **GitHub analytics dashboard — visualize your repos, commits, stars, and activity in one place.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-6366f1?style=for-the-badge&logo=vercel)](https://devpulse-git-main-prathams-projects-371c8ade.vercel.app)

---

## ✨ Features

- 🔎 **Profile search** — enter any GitHub username and instantly load their public stats
- 📈 **Interactive charts** — commit history, language breakdown, and star counts rendered with Recharts
- 🗂️ **Repository explorer** — sortable, filterable list of repos with language, stars, forks, and last-updated info
- 🔗 **Multi-page navigation** — profile overview, repo detail, and contribution views via React Router v7
- 🎬 **Smooth animations** — page transitions and card entrances with Framer Motion and GSAP
- 📡 **GitHub REST API v3** — fetches live data with Axios; gracefully handles rate limits
- 📱 **Fully responsive** — clean grid layout that works on mobile, tablet, and desktop

---

## 🖼️ Screenshot

> _Add a screenshot here — e.g. `public/screenshot.png`_

![DevPulse Screenshot](public/screenshot.png)

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=fff)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square)
![GitHub API](https://img.shields.io/badge/GitHub%20API%20v3-181717?style=flat-square&logo=github)
![React Router](https://img.shields.io/badge/React%20Router%20v7-CA4245?style=flat-square&logo=react-router&logoColor=fff)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=fff)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square)
![Vite](https://img.shields.io/badge/Vite%207-646CFF?style=flat-square&logo=vite&logoColor=fff)

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- (Optional) A GitHub Personal Access Token to increase the API rate limit from 60 → 5,000 req/hr

### 1. Clone the repo

```bash
git clone https://github.com/pratham7711/devpulse.git
cd devpulse
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

```env
# Optional — add your GitHub PAT to avoid rate limiting
VITE_GITHUB_TOKEN=ghp_...
```

> Without a token, the app still works but is limited to **60 requests/hour** per IP (GitHub's unauthenticated limit).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Build for Production

```bash
npm run build     # TypeScript compile + Vite bundle → dist/
npm run preview   # Preview the production build locally
```

---

## 📁 Project Structure

```
src/
├── components/       # Chart components, RepoCard, StatBadge
├── pages/            # Profile, Repository, Contributions views
├── hooks/            # useGitHub, useRepos, useContributions
├── services/         # Axios GitHub API client
├── utils/            # Date formatters, language color map
└── types/            # TypeScript interfaces for GitHub API responses
```

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<p align="center">Built by <a href="https://github.com/pratham7711">Pratham</a> · Powered by GitHub API + Recharts</p>
