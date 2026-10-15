# THINKBOARD 📝
> A secure, full-stack personal note-taking application featuring user-specific data isolation, JWT authentication, real-time search, tag filtering, note pinning, and rate limiting.

![Node.js](https://img.shields.io/badge/Node.js-22-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-DaisyUI-teal.svg)

---

## ✨ Features

- **🔐 User-Specific Data Isolation**: Every note is strictly bound to its creator (`user: req.user._id`). Users can only query, edit, or delete their own notes.
- **🛡️ JWT Authentication**: Secure signup and login flow with `bcryptjs` password hashing and stateless token verification.
- **📌 Pinning Notes**: One-click note pinning with automatic sorting (pinned notes always stay at the top).
- **🏷️ Tagging System**: Tag notes with multiple categories; interactive tag chips and instant tag-based filtering.
- **🔍 Real-Time Search**: Debounced search bar querying note titles, contents, and tags simultaneously.
- **⏱️ Upstash Redis Rate Limiting**: Built-in sliding-window rate limiter protecting API endpoints from abuse.
- **🎨 Modern Dark Aesthetic**: Built with Tailwind CSS and DaisyUI featuring glowing radial emerald accents.
- **🔔 Toast Notifications**: Responsive feedback on every user interaction via `react-hot-toast`.

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Rate Limiting**: `@upstash/ratelimit` & `@upstash/redis`

### Frontend
- **Build Tool**: Vite
- **Library**: React 19
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (with authorization interceptors)
- **Styling**: Tailwind CSS & DaisyUI
- **Icons**: Lucide React

---

## 📡 REST API Endpoint Contract

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | **Yes** (Bearer) |

### Notes (`/api/notes`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | Get all notes (supports `?search=` and `?tag=`) | **Yes** (Bearer) |
| `GET` | `/api/notes/:id` | Get single note by ID (user-isolated) | **Yes** (Bearer) |
| `POST` | `/api/notes` | Create a new note (`title`, `content`, `tags`, `isPinned`) | **Yes** (Bearer) |
| `PUT` | `/api/notes/:id` | Update an existing note | **Yes** (Bearer) |
| `DELETE` | `/api/notes/:id` | Delete a note | **Yes** (Bearer) |
| `PATCH` | `/api/notes/:id/pin` | Toggle note pinned status | **Yes** (Bearer) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB connection string (local or MongoDB Atlas)
- Upstash Redis account (optional for rate limiting)

### 2. Clone and Configure
```bash
git clone https://github.com/your-username/THINKBOARD.git
cd THINKBOARD
```

Configure backend environment variables in `backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
PORT=5001
```

### 3. Run Locally

**Start Backend**:
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5001`*

**Start Frontend**:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🌐 Deployment Guide

### Deploy Backend (Render / Railway)
1. Push your repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Set Root Directory to `backend`.
4. Set Build Command: `npm install`.
5. Set Start Command: `npm start`.
6. Add your environment variables (`MONGO_URI`, `JWT_SECRET`, etc.).

### Deploy Frontend (Vercel / Netlify)
1. Create a new project on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Set Framework Preset to `Vite`.
4. Update `frontend/src/lib/axios.js` `baseURL` to point to your live backend domain.
5. Click **Deploy**.

---

## 📄 License
MIT License
