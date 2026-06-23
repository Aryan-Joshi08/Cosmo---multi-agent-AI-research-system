# Cosmo — Multi-Agent AI Research System

I built Cosmo because I was tired of spending 30 minutes tabbing between search results just to understand a topic. Give it a subject, and it spins up a small pipeline of AI agents that search, read, write, and critique — and hands you back a proper research report.

---

## What it does

When you submit a topic, four things happen in sequence:

1. **Search** — hits the web and pulls recent, relevant results via Tavily
2. **Read** — picks the most useful URL from those results and scrapes it for actual content
3. **Write** — takes everything gathered and drafts a structured report with key findings
4. **Critique** — a separate agent reviews the report and scores it out of 10

The whole thing runs through a FastAPI backend and a React frontend with a space-themed UI (felt right for something called Cosmo).

---

## Stack

- **LLM** — Mistral Large
- **Agents** — LangGraph ReAct
- **Search** — Tavily API
- **Scraping** — requests + BeautifulSoup
- **Backend** — FastAPI
- **Frontend** — React + Vite

---

## Running it locally

**Backend**

```bash
git clone https://github.com/Aryan-Joshi08/Cosmo---multi-agent-AI-research-system.git
cd Cosmo---multi-agent-AI-research-system

python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the root:
```
MISTRAL_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
```

Then start the server:
```bash
uvicorn server:app --reload
```

**Frontend**

```bash
cd cosmo-ui
npm install
npm run dev
```

Hit `http://localhost:5173` and you're good.

---

## Project layout

```
Cosmo/
├── agents.py        # agent setup, writer and critic chains
├── pipeline.py      # wires the 4 steps together
├── server.py        # FastAPI endpoints
├── tools.py         # web search + scraper tools
├── requirements.txt
└── cosmo-ui/        # React frontend
```

---

## API

`POST /research` — takes `{ "topic": "..." }`, returns the full report and critic feedback

`GET /health` — sanity check

---

Made by [Aryan Joshi](https://github.com/Aryan-Joshi08)
