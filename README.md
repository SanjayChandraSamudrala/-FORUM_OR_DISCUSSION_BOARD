# 🗣️ ConnectForum

### A Full-Stack Discussion Forum using the MERN Stack

A scalable and responsive discussion forum built with **MongoDB**, **Express.js**, **React**, and **Node.js**. It allows users to register, create threads, reply to discussions, upvote content, and more. Designed with modular components, REST APIs, and responsive layouts.

---

## 💪 Features

* 🔐 **Authentication**: JWT-based user registration, login, and role-based access.
* 📍 **Discussion Boards**: Thread-based discussions with nested replies.
* 🔊 **Voting System**: Upvote/downvote replies and threads.
* 📆 **Category Filtering**: Organize topics by categories or tags.
* 💬 **Live Interactions**: Auto-refresh UI after actions using state management.
* 🏛️ **Admin Controls**: Moderate threads, delete inappropriate content.
* 🎨 **Responsive UI**: Optimized for desktop.

---

## 🛠️ Technologies Used

### Frontend

* ![React](https://img.shields.io/badge/React-20232A?style=flat\&logo=react) **React**
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat\&logo=javascript\&logoColor=black) **JavaScript**
* ![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat\&logo=tailwindcss) **Tailwind CSS**
* ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat\&logo=vite) **Vite**
* **Shadcn UI** for styled components

### Backend

* ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat\&logo=node.js) **Node.js**
* ![Express](https://img.shields.io/badge/Express-000000?style=flat\&logo=express) **Express.js**
* ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat\&logo=mongodb) **MongoDB with Mongoose**
* ![JWT](https://img.shields.io/badge/JWT-black?style=flat\&logo=jsonwebtokens) **JWT Authentication**

---

## 📂 Project Structure

```
FORUM_BOARD/
├── public/                     # Static files
├── server/                     # Express.js backend
│   ├── config/                 # DB config
│   ├── controllers/            # API handlers
│   ├── middleware/             # Auth + error handling
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API endpoints
│   └── server.js               # Entry point
├── src/                        # React frontend
│   ├── components/             # Reusable UI + layout
│   ├── pages/                  # Route-based views
│   ├── services/               # API interactions
│   ├── hooks/ & lib/           # Custom logic & utils
│   ├── App.jsx / main.jsx      # Root components
│   └── assets/ & styles/       # Images + Tailwind config
├── vite.config.ts              # Vite config
└── README.md                   # You are here
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v14+)
* MongoDB (Atlas or local)

### Installation

```bash
# Clone repo
$ git clone https://github.com/your-username/ConnectForum.git
$ cd ConnectForum

# Frontend install
$ npm install

# Backend install
$ cd server
$ npm install
$ cd ..

# Configure environment variables
$ cp server/.env.example server/.env
```

Update `.env` with your MongoDB URI and JWT secret.

### Run Application

```bash
# Terminal 1 - backend
$ cd server
$ npm start

# Terminal 2 - frontend
$ npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)
Backend API: [http://localhost:5000/api](http://localhost:5000/api)

