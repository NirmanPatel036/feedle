# Feedle — News Aggregator

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38BDF8?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-9.6.1-880000?logo=mongoose&logoColor=white)
![MongoDB Driver](https://img.shields.io/badge/MongoDB%20Driver-4.11.0-47A248?logo=mongodb&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![rss-parser](https://img.shields.io/badge/rss--parser-3.13.0-4A5568)

Feedle is a multi-source news aggregation platform with a modern Next.js frontend, a Node.js API backend, and an optional JSP-based Java backend. It aggregates from NewsAPI, GNews, Guardian, and curated RSS feeds, then delivers personalized and category-based feeds with bookmarking and subscriptions.

---

## Repository layout

```
news-aggregator/
├─ frontend/          # Next.js 16 App Router UI
├─ backend-node/      # Express + MongoDB API + cron fetcher
└─ backend-java/      # JSP/Servlet WAR (Tomcat)
```

---

## Key features

- **Multi-source ingestion**: NewsAPI, GNews, Guardian, and RSS feeds
- **Automated refresh**: cron refresh every 15 minutes + on-boot fetch
- **Personalized feed**: subscription-based categories
- **Bookmarks**: save and return later
- **All feed**: randomized, animated news wall
- **HD media**: Guardian and BBC image quality normalization

---

## Requirements

- **Node.js** (for `frontend/` and `backend-node/`)
- **MongoDB** (local or Atlas)
- **Java 17** (for `backend-java/`)
- **Maven** (for building the WAR)
- **Tomcat** (for deploying the WAR)

---

## Backend (Node.js)

### Environment variables (`backend-node/.env`)

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
NEWS_API_KEY=your_newsapi_key
GNEWS_API_KEY=your_gnews_key
GUARDIAN_API_KEY=your_guardian_key
PORT=5000
```

**Notes**
- `GNEWS_API_KEY` and `GUARDIAN_API_KEY` are optional; the fetcher will skip those sources if not provided.
- The fetcher runs once on boot and then every 15 minutes.

### Run

```
cd backend-node
npm install
node src/app.js
```

---

## Frontend (Next.js)

### Environment variables (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_JSP_URL=http://localhost:8080/feedle
NEXT_PUBLIC_GUARDIAN_API_KEY=your_guardian_key
```

### Run

```
cd frontend
npm install
npm run dev
```

---

## Backend (Java / JSP)

Build the WAR and deploy to Tomcat.

```
cd backend-java
mvn clean package
```

The WAR is created as `feedle.war` (see `<finalName>` in `pom.xml`). Deploy it into your Tomcat `webapps` directory.

---

## API Overview

All API routes are under `/api` in `backend-node`:

- `GET /api/articles` — list articles (category, categories, random, paging)
- `GET /api/articles/:id` — article detail
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `GET /api/bookmarks` — list bookmarks
- `POST /api/bookmarks` — add bookmark
- `DELETE /api/bookmarks/:articleId` — remove bookmark
- `GET /api/subscriptions` — list subscriptions
- `POST /api/subscriptions` — add subscription
- `DELETE /api/subscriptions/:topic` — remove subscription
- `GET /api/trigger-fetch` — run fetch manually

---

## Deployment notes

- **Frontend** can be deployed to Vercel or any Node hosting platform.
- **Backend Node** can run on any server with MongoDB connectivity.
- **Backend Java** requires Tomcat for WAR deployment.

---

## License

This project is for educational and internal use.

---

## Acknowledgements

- NewsAPI, GNews, Guardian Content API
- RSS sources: BBC, TechCrunch, NYTimes, Guardian, ESPN

