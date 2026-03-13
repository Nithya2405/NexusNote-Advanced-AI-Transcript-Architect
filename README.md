# NexusNote

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=260&color=gradient&text=NexusNote&fontAlign=50&fontAlignY=40&fontSize=70&desc=AI%20Transcript%20Knowledge%20Architecture&descAlignY=60&animation=fadeIn"/>

### Transform transcripts into structured knowledge systems

<p>

AI platform that converts **long transcripts into structured knowledge bases** using **multi-stage LLM pipelines**.

</p>

---

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange?logo=google)
![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey?logo=sqlite)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-cyan?logo=tailwindcss)

![Build](https://img.shields.io/badge/build-passing-success)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

# Product Demo

Experience the AI Transcript Architect in action:
[View Live Demo](https://nexus-note-advanced-ai-transcript-a-sigma.vercel.app/)

Example flow:

```bash
Upload transcript
↓
AI analyzes transcript
↓
Topics extracted
↓
Insights generated
↓
Structured knowledge produced
```

---

# What NexusNote Does

NexusNote converts **raw transcripts into organized knowledge**.

Instead of reading hours of conversation, the system produces:

• structured summaries
• key insights
• topic clusters
• knowledge maps
• Notion-ready documentation

Ideal for:

* Podcasts
* Meetings
* Lectures
* Research interviews
* YouTube transcripts
* Courses

---

# AI Architecture

Below is the **system architecture diagram**.

<svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg">

<rect x="40" y="160" width="160" height="60" fill="#6366f1"/>
<text x="120" y="195" fill="white" text-anchor="middle">Transcript Input</text>

<rect x="240" y="80" width="180" height="60" fill="#06b6d4"/>
<text x="330" y="115" fill="white" text-anchor="middle">React Frontend</text>

<rect x="240" y="240" width="180" height="60" fill="#06b6d4"/>
<text x="330" y="275" fill="white" text-anchor="middle">Express API</text>

<rect x="470" y="160" width="180" height="60" fill="#f97316"/>
<text x="560" y="195" fill="white" text-anchor="middle">Gemini AI Engine</text>

<rect x="680" y="160" width="180" height="60" fill="#22c55e"/>
<text x="770" y="195" fill="white" text-anchor="middle">Knowledge Output</text>

</svg>

Pipeline:

```
User → Frontend → API → AI Engine → Knowledge Output
```

---

# AI Pipeline Infographic

```
Raw Transcript
      │
      ▼
Cleaning
      │
      ▼
Segmentation
      │
      ▼
Topic Extraction
      │
      ▼
Semantic Reasoning
      │
      ▼
Insight Generation
      │
      ▼
Knowledge Architecture
```

The **multi-stage reasoning pipeline** improves:

* context accuracy
* topic discovery
* structured output quality

---

# Screenshots

## Dashboard

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/69fb1fd6-2d1a-458a-b2e9-e8395b3c793e" />

## Transcript Processing

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b9ae9124-4fdf-42d1-b41a-cc72ba6d00ef" />

## Knowledge Output

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f9944c74-3e90-458f-9446-8e0b92f838b8" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/197cdc0e-5557-40d7-b604-3db888dc6e30" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3a97b606-4535-4502-a2b9-d6692d6b9836" />

---

# Tech Stack

Frontend

* React
* TypeScript
* Vite
* TailwindCSS

Backend

* Node.js
* Express

AI

* Google Gemini

Database

* SQLite

---

# Installation

Clone repository

```bash
git clone https://github.com/Nithya2405/NexusNote-Advanced-AI-Transcript-Architect
cd nexusnote
```

Install dependencies

```bash
npm install
```

Create environment file

```
.env.local
```

Add Gemini API key

```
GEMINI_API_KEY=your_api_key
```

Run development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# Repository Structure

```
nexusnote
│
├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── hooks
│   └── utils
│
├── server
│   ├── api
│   ├── ai-engine
│   └── database
│
├── docs
├── public
├── tests
│
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

# Interactive Documentation

NexusNote supports **auto-generated documentation**.

Recommended docs tools:

### VitePress

```
docs/
   index.md
   architecture.md
   ai-pipeline.md
   api.md
```

Run docs server:

```
npx vitepress dev docs
```

---

# Contributing

We welcome contributions.

Fork repository

```
git fork https://github.com/Nithya2405/NexusNote-Advanced-AI-Transcript-Architect
```

Create branch

```
git checkout -b feature/new-feature
```

Commit changes

```
git commit -m "Add feature"
```

Push branch

```
git push origin feature/new-feature
```

Open Pull Request.

---

# Roadmap

Future capabilities

* Notion export
* vector embedding search
* knowledge graph generation
* multi-document reasoning
* AI research assistant mode

---

# License

MIT License

---

# Author

**NexusNote AI Engineering**

---

⭐ If you like the project, **star the repository**.

---

