---

# 🚀 ConnectForum – MERN Stack Discussion Platform

A full-featured, modern discussion forum built with the **MERN stack** (MongoDB, Express.js, React, Node.js). ConnectForum allows users to register, post topics, reply to discussions, and engage with others in a real-time, categorized platform — all with a responsive and clean UI.

🔗 **Live Demo**: [https://forum-or-discussion-board.vercel.app](https://forum-or-discussion-board.vercel.app)

---

## 📁 Project Structure

```
connectforum/
├── public/                  # Static files
├── server/                  # Backend code
│   ├── config/              # Database configuration
│   ├── controllers/         # Route handlers / business logic
│   ├── middleware/          # Custom Express middlewares (auth, error, etc.)
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routes
│   ├── .env                 # Environment variables (not tracked in Git)
│   ├── .env.example         # Example env file
│   └── server.js            # Backend entry point
├── src/                     # Frontend code (React + TypeScript)
│   ├── components/          # Reusable components
│   │   ├── layout/          # Layout components (Navbar, Footer, etc.)
│   │   └── ui/              # Styled UI elements
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Helper utilities
│   ├── pages/               # Page views (Home, Dashboard, Threads, etc.)
│   ├── services/            # Axios API handlers
│   ├── types/               # TypeScript interfaces/types
│   ├── App.tsx              # App routing + layout
│   └── main.tsx             # React root rendering
├── index.html               # HTML template (Vite)
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build config
└── .gitignore
```

---

## ⚙️ Getting Started

### 📌 Prerequisites

* Node.js (v14 or higher)
* npm (v6 or higher)
* MongoDB (Atlas or local instance)

### 🛠️ Installation

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

3. **Environment setup**

```bash
cp server/.env.example server/.env
```

Update `server/.env` with your MongoDB URI and JWT secret key.

4. **Start the app**

```bash
# Terminal 1 - Start backend
cd server
npm start

# Terminal 2 - Start frontend
npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:5000/api](http://localhost:5000/api)

---

## ✨ Features

* 🔐 **Authentication**: Secure login, signup, and JWT-protected routes.
* 💬 **Discussion Threads**: Users can create, read, and delete discussion topics.
* 💡 **Replies**: Post and view replies to threads.
* 🔼 **Voting System**: Upvote/downvote replies (optional future feature).
* 🗂️ **Category Management**: Organize threads into categories.
* 🔍 **Search Functionality**: Easily find discussions (WIP).
* 📱 **Responsive UI**: Fully responsive design for mobile and desktop.
* ✨ **Modern UI/UX**: Built with Tailwind CSS and Shadcn UI for sleek design.

---

## 🧰 Tech Stack

### 🚀 Frontend

* **React** with **TypeScript**
* **Tailwind CSS** & **Shadcn UI**
* **Axios** for HTTP requests
* **Vite** as the build tool

### 🛠️ Backend

* **Node.js** & **Express.js**
* **MongoDB** with **Mongoose**
* **JWT** for authentication
* **CORS**, **dotenv**, and other useful middleware

---

## 🔐 Authentication Flow

* Signup/Login routes generate JWT tokens.
* Protected routes require token verification using custom middleware.
* User roles and session data stored securely.

---

## 🌐 Deployment

* **Frontend**: Deployed on **Vercel**
  🔗 [https://forum-or-discussion-board.vercel.app](https://forum-or-discussion-board.vercel.app)

* **Backend**: Deployable to **Render**, **Railway**, or **VPS** of choice. (Not deployed publicly in current version)

---

## 📌 Future Improvements

* ✅ Edit and delete functionality for threads & replies
* ✅ Admin dashboard for user and thread management
* ✅ Real-time updates using Socket.io or WebSockets
* ✅ Rich text editor for thread content
* ✅ Notifications for replies and mentions

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
See the `LICENSE` file for more details.

---

