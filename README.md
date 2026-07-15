<p align="center">
  <a href="https://amulyavarshney.github.io"><img src="https://img.shields.io/badge/Live_Site-amulyavarshney.github.io-0ea5e9?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live site" /></a>
  <a href="https://github.com/amulyavarshney"><img src="https://img.shields.io/badge/GitHub-amulyavarshney-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
  <a href="https://www.linkedin.com/in/varamu/"><img src="https://img.shields.io/badge/LinkedIn-varamu-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://medium.com/@amulyavarshney7"><img src="https://img.shields.io/badge/Medium-@amulyavarshney7-000000?style=for-the-badge&logo=medium&logoColor=white" alt="Medium" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/i18n-en%20%7C%20hi%20%7C%20de%20%7C%20fr%20%7C%20es-8B5CF6?style=flat-square" alt="Languages" />
</p>

---

<p align="center">
  <img src="docs/profile-circle.png" alt="Amulya Varshney" width="160" />
</p>

<p align="center">
  <b>Software Engineer 2 · Applied AI</b><br />
  Building multi-agent systems, RAG pipelines, LLMOps, and the full-stack products around them.
</p>

<p align="center">
  <a href="https://amulyavarshney.github.io"><b>Visit the portfolio →</b></a>
</p>

---

## About

I mix CS fundamentals and competitive programming with product engineering. Right now I focus on AI agents, evaluation pipelines, LLMOps, and production RAG systems that actually ship.

This repo is my personal portfolio site — experience and skills, featured projects with case studies, an interactive AI playground, and long-form guides. Localized in **English, Hindi, German, French, and Spanish**.

## What's on the site

| | Section | What you'll find |
|:-:|---------|------------------|
| 🏠 | **Home** | Intro, focus areas, and what I'm working on now |
| 📁 | **Portfolio** | Education, experience, skills, and achievements |
| 🚀 | **Projects** | Featured work plus live GitHub repos |
| 📄 | **Case studies** | Deep dives (Payroll Intelligence Agent, Ray, and more) |
| 🛠️ | **Services** | How I help teams ship agents, RAG, and backends |
| 🧪 | **Playground** | Interactive labs for prompting, retrieval, agents, and tools |
| ✍️ | **Blogs & guides** | Applied AI roadmap, Qdrant/FastAPI, evals, and more |
| 📬 | **Contact** | Secure form — no email exposed on the page |

## Tech stack

```text
React 18  ·  TypeScript  ·  Vite
Tailwind CSS
React Router  ·  i18next
Three.js / React Three Fiber
Vitest
```

## Local development

```bash
# Install
npm install

# Dev server (regenerates sitemap on start)
npm run dev

# Production build
npm run build
npm run preview

# Tests & lint
npm run test
npm run lint
```

Dev server defaults to `http://localhost:8080`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run Vitest once |
| `npm run lint` | ESLint |
| `npm run audit` | Dependency audit (high severity) |

Sitemap generation (`scripts/generate-sitemap.mjs`) runs automatically before `dev` and `build`.

## Project layout

```text
docs/           README profile graphic
src/
  components/   Layout, portfolio sections, playground labs, UI
  data/         Projects, case studies, playground definitions
  i18n/         Locale files and language routing
  pages/        Route pages and long-form guides
  assets/       Photos and media
  lib/          Shared utilities
scripts/
  generate-sitemap.mjs
public/
  sitemap.xml · robots.txt · llms.txt · og-image.jpg
```

## License

© Amulya Varshney. Personal portfolio — all rights reserved.
