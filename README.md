
# ConnectForum - MERN Stack Discussion Platform

A full-featured forum application built with the MERN stack (MongoDB, Express.js, React, Node.js).

<h1 align="center">🗣️ ConnectForum</h1>
<h3 align="center">A MERN Stack Discussion Platform</h3>

<p align="center">
  A full-featured forum application built with the MERN stack (MongoDB, Express.js, React, Node.js).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb" />
</p>

---

## 📁 Project Structure


## Project Structure

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
```

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- MongoDB Atlas account or local MongoDB installation

### Setup Instructions

1. **Clone the repository**

```bash
git clone <repository-url>
cd connectforum
```

2. **Install dependencies**

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

3. **Configure environment variables**

Copy the example environment file and update with your values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your MongoDB connection string and JWT secret.

4. **Run the application**

```bash
# Terminal 1: Start the backend server
cd server
npm start

# Terminal 2: Start the frontend development server
npm run dev
```

The frontend will be available at http://localhost:5173
The backend API will be available at http://localhost:5000/api

✨ Features
🔐 User authentication (register, login, profile management)

💬 Create and manage discussion threads

🗳️ Reply to threads and vote on content

📂 Category-based organization

📱 Responsive design for mobile and desktop

🛠️ Technologies Used
🌐 Frontend
React

TypeScript

Tailwind CSS

Vite

Shadcn UI

🧪 Backend
Node.js

Express.js

MongoDB

Mongoose

JWT Authentication
