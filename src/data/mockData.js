import accountIcon from "../assets/accountIcon.png";

export const MOCK_USER = {
  id: "1",
  name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : "Guest User",
  email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : "guest@example.com",
  image: accountIcon,
  role: "user-student",
  bio: "Focus and what makes you happy, relax at a moment, and play a games;"
};

export const CATEGORIES = [
  { name: "Entertainment", color: "bg-[#a5d6a7]" },
  { name: "Programming", color: "bg-[#f8bbd0]" },
  { name: "Sports", color: "bg-[#b39ddb]" }
];

export const TRENDING_TOPICS = [
  { name: "Artificial Intelligence", icon: "" },
  { name: "Environmental Issues", icon: "" },
  { name: "Cryptocurrency and Blockchain", icon: "" },
  { name: "Health & Wellness Trends", icon: "" },
  { name: "Gaming & Esports", icon: "" },
  { name: "Social Media & Content Creation", icon: "" }
];

export const HAPPENING_NOW = [
  "Front-end",
  "Back-end",
  "Mobile-dev",
  "Data-analyst",
  "Machine-learning",
  "Blockchain-dev"
];

// Added more mock users for variety in discussions
const MOCK_USERS = {
  john: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: accountIcon,
    role: "user-student",
    bio: "Focus and what makes you happy, relax at a moment, and play games;"
  },
  astronaut: {
    id: "2",
    name: "Astronout",
    email: "astro@example.com",
    image: accountIcon,
    role: "developer",
    bio: "Exploring the universe of code one commit at a time."
  },
  sci: {
    id: "3",
    name: "Sci",
    email: "sci@example.com",
    image: accountIcon,
    role: "student",
    bio: "Science enthusiast and eternal learner."
  },
  ebay: {
    id: "4",
    name: "Ebayyou Anggoro",
    email: "ebay@example.com",
    image: accountIcon,
    role: "developer",
    bio: "Full-stack developer with a passion for UI/UX."
  },
  techGuru: {
    id: "5",
    name: "Tech Guru",
    email: "tech@example.com",
    image: accountIcon,
    role: "expert",
    bio: "Technology expert with 15+ years in the industry."
  },
  sportsLover: {
    id: "6",
    name: "Sports Enthusiast",
    email: "sports@example.com",
    image: accountIcon,
    role: "user",
    bio: "Living for the game, breathing for the team."
  },
  movieBuff: {
    id: "7",
    name: "Movie Buff",
    email: "movies@example.com",
    image: accountIcon,
    role: "critic",
    bio: "Watching and reviewing films is my passion."
  },
  envActivist: {
    id: "8",
    name: "Eco Warrior",
    email: "eco@example.com",
    image: accountIcon,
    role: "activist",
    bio: "Fighting for a sustainable future for all of us."
  }
};

export const MOCK_THREADS = [
  // Original threads
  {
    id: "1",
    title: "Front-end Development And Backend Developer",
    content: "The three main languages you need to know well are HTML, CSS, and JavaScript. From there you can focus on frameworks, libraries, and other useful tools...",
    author: MOCK_USERS.astronaut,
    createdAt: "6h ago",
    category: "Front-end",
    likes: 10,
    dislikes: 2,
    saved: false,
    responses: [
      {
        id: "1",
        content: "Yes, I agree! The three main languages you need to know well are HTML, CSS, and JavaScript. I'd also recommend learning React or Vue for modern web development.",
        author: MOCK_USERS.sci,
        createdAt: "5h ago",
        likes: 5,
        dislikes: 0
      },
      {
        id: "2",
        content: "Don't forget about TypeScript! It has really improved my development experience by catching errors early.",
        author: MOCK_USERS.ebay,
        createdAt: "3h ago",
        likes: 7,
        dislikes: 1
      }
    ]
  },
  {
    id: "2",
    title: "Best Practices for CSS Organization",
    content: "I've been working on large projects and finding it difficult to maintain CSS. What methodologies do you recommend? BEM, SMACSS, or something else?",
    author: MOCK_USERS.ebay,
    createdAt: "1d ago",
    category: "Front-end",
    likes: 15,
    dislikes: 3,
    saved: true,
    responses: [
      {
        id: "3",
        content: "I've had great success with Tailwind CSS lately. It allows for rapid development and keeps your HTML and styling together which I find more maintainable.",
        author: MOCK_USERS.astronaut,
        createdAt: "20h ago",
        likes: 8,
        dislikes: 2
      }
    ]
  },
  
  // Entertainment Category
  {
    id: "3",
    title: "Latest Movie Recommendations",
    content: "I just watched 'Dune Part 2' and it was amazing! What other sci-fi films would you recommend that have the same epic scale?",
    author: MOCK_USERS.movieBuff,
    createdAt: "2d ago",
    category: "Entertainment",
    likes: 28,
    dislikes: 3,
    saved: false,
    responses: [
      {
        id: "4",
        content: "If you liked Dune, you should definitely check out 'Blade Runner 2049' by the same director. The cinematography is breathtaking!",
        author: MOCK_USERS.john,
        createdAt: "1d ago",
        likes: 12,
        dislikes: 0
      },
      {
        id: "5",
        content: "I would recommend 'Interstellar' for its combination of hard science concepts and emotional storytelling.",
        author: MOCK_USERS.sci,
        createdAt: "1d ago",
        likes: 9,
        dislikes: 1
      }
    ]
  },
  {
    id: "4",
    title: "Streaming Services Comparison",
    content: "With so many streaming services now, it's getting expensive to subscribe to all of them. Which ones do you think offer the best value for money?",
    author: MOCK_USERS.john,
    createdAt: "4d ago",
    category: "Entertainment",
    likes: 42,
    dislikes: 5,
    saved: true,
    responses: [
      {
        id: "6",
        content: "I've found that rotating subscriptions works well. Subscribe to one service for a month, binge what you want, then switch to another the next month.",
        author: MOCK_USERS.movieBuff,
        createdAt: "3d ago",
        likes: 19,
        dislikes: 2
      }
    ]
  },
  
  // Programming Category
  {
    id: "5",
    title: "Learning React in 2023 - Roadmap",
    content: "I'm a beginner programmer looking to learn React. What's the best learning path in 2023 with all the recent updates to the framework?",
    author: MOCK_USERS.sci,
    createdAt: "1w ago",
    category: "Programming",
    likes: 36,
    dislikes: 2,
    saved: false,
    responses: [
      {
        id: "7",
        content: "Start with JavaScript fundamentals before diving into React. Understanding closures, promises, and the event loop will make React much easier.",
        author: MOCK_USERS.astronaut,
        createdAt: "6d ago",
        likes: 15,
        dislikes: 0
      },
      {
        id: "8",
        content: "The official React docs have been completely rewritten and are now an excellent resource for beginners. They have a 'learn by doing' approach.",
        author: MOCK_USERS.ebay,
        createdAt: "5d ago",
        likes: 12,
        dislikes: 1
      }
    ]
  },
  {
    id: "6",
    title: "Backend Performance Optimization",
    content: "Our API endpoints are getting slow as our user base grows. What are some effective strategies for scaling a Node.js backend?",
    author: MOCK_USERS.techGuru,
    createdAt: "2w ago",
    category: "Back-end",
    likes: 29,
    dislikes: 1,
    saved: true,
    responses: [
      {
        id: "9",
        content: "Implement caching at multiple levels - application, database, and CDN. Redis is great for application-level caching.",
        author: MOCK_USERS.astronaut,
        createdAt: "1w ago",
        likes: 14,
        dislikes: 0
      },
      {
        id: "10",
        content: "Consider using a load balancer and horizontal scaling. Also, make sure to optimize your database queries and indexes.",
        author: MOCK_USERS.ebay,
        createdAt: "1w ago",
        likes: 11,
        dislikes: 0
      }
    ]
  }
]; 