<h1 align="center">🗣️ ConnectForum</h1>
<h3 align="center">A MERN Stack Discussion Platform</h3>

<p align="center">
  A full-featured forum application built with the MERN stack (MongoDB, Express.js, React, Node.js).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MERN%20Stack-FullStack-blue?style=flat-square" />
  <img src="https://img.shields.io/github/languages/top/yourusername/connectforum?style=flat-square" />
  <img src="https://img.shields.io/github/license/yourusername/connectforum?style=flat-square" />
</p>

---

## 📸 Screenshots

> Replace these with your actual screenshots (put them inside a `/screenshots` folder)

| Home Page | Thread View | Profile Page |
|-----------|-------------|---------------|
| ![Home](./screenshots/home.png) | ![Thread](./screenshots/thread.png) | ![Profile](./screenshots/profile.png) |

---

## 🔧 Tech Stack

**Frontend**  
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)

**Backend**  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens)

---

## 📁 Project Structure




## 📁 Project Structure

```

├── public/                  # Static files
├── server/                  # Backend code
│   ├── config/              # Database configuration
│   ├── controllers/         # API controllers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── .env                 # Environment variables (not in git)
│   ├── .env.example         # Example environment variables
│   └── server.js            # Entry point for the backend
├── src/                     # Frontend code
│   ├── components/          # React components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Entry point for the frontend
├── .gitignore               # Git ignore file
├── index.html               # HTML template
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration

````

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v14 or newer)
- MongoDB Atlas account or local MongoDB installed

### ⚙️ Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/connectforum.git
cd connectforum
````

2. **Install dependencies**

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

3. **Configure environment variables**

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your MongoDB URI and JWT secret.

4. **Run the application**

```bash
# Terminal 1: Start backend server
cd server
npm start

# Terminal 2: Start frontend dev server
npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:5000/api](http://localhost:5000/api)

---

## ✨ Features

* 🔐 User authentication (register, login, profile)
* 💬 Create and manage discussions
* 🗳️ Reply and upvote/downvote threads
* 📂 Organized by categories
* 📱 Responsive design

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.

---

## 🙋‍♂️ Author

**Sanjay Chandra**
Connect with me on [LinkedIn](https://www.linkedin.com) *(replace with real link)*

---

> 💡 Tip: Add a project banner or animated GIF in the screenshots section for better visual appeal.

```

---

Let me know if you want:
- A **logo/banner image** designed
- A **LICENSE file**
- Help with GitHub Pages or deployment instructions

I'm happy to generate those too.
```
