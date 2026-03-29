import { Link, useNavigate } from "react-router-dom";
import { Users, LayoutDashboard } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import "./Sidebar.css";
import logo from "../../assets/logo.png";
import instagramIcon from "../../assets/instagram.jpg"; 
import twitterIcon from "../../assets/twitter.png"; 
import telegramIcon from "../../assets/telegram.png"; 
import { useState, useEffect } from "react";
import { getDistinctCategories } from "../../services/api"; // Import the new API function

const Sidebar = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // Initialize with empty array
  const [currentUser, setCurrentUser] = useState(null); // Add state for current user

  // Fetch current user on component mount or isLoggedIn change
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, [isLoggedIn]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getDistinctCategories();
        console.log("Fetched distinct categories from backend (Sidebar):", response.data);
        // Map the category strings to objects with a name and a random color
        const fetchedCategories = response.data.map(name => {
          const colors = ['bg-[#a5d6a7]', 'bg-[#f8bbd0]', 'bg-[#b39ddb]', 'bg-[#90caf9]', 'bg-[#ffe082]', 'bg-[#ef9a9a]'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          return { name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), color: randomColor };
        });
        console.log("Processed categories for sidebar display:", fetchedCategories);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, []); // Run once on mount

  // Listen for new category events
  useEffect(() => {
    const handleNewCategory = (event) => {
      const newCategory = event.detail;
      console.log("Sidebar received newCategory event:", newCategory);
      setCategories(prevCategories => {
        const exists = prevCategories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase());
        if (!exists) {
          const colors = ['bg-[#a5d6a7]', 'bg-[#f8bbd0]', 'bg-[#b39ddb]', 'bg-[#90caf9]', 'bg-[#ffe082]', 'bg-[#ef9a9a]'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          console.log("Adding new category to sidebar:", { name: newCategory.charAt(0).toUpperCase() + newCategory.slice(1).toLowerCase(), color: randomColor });
          return [...prevCategories, { name: newCategory.charAt(0).toUpperCase() + newCategory.slice(1).toLowerCase(), color: randomColor }];
        }
        console.log("Category already exists in sidebar, not adding:", newCategory);
        return prevCategories;
      });
    };

    window.addEventListener('newCategory', handleNewCategory);
    return () => window.removeEventListener('newCategory', handleNewCategory);
  }, []);

  const handleAuthLink = (e, destination, actionName) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast({
        title: "Authentication Required",
        description: `Please login to ${actionName}`,
        variant: "destructive",
      });
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img 
          src={logo} 
          alt="ConnectForum" 
          className="sidebar-logo" 
          style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
        />
        <div>
          <h1 className="sidebar-title">ConnectForum.io</h1>
          <p className="sidebar-subtitle">Platform Discussion</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/profile" 
          className="sidebar-link"
          onClick={(e) => handleAuthLink(e, "/profile", "view your profile")}
        >
          <div className="sidebar-icon">
            <Users size={18} />
          </div>
          <span>Profile</span>
        </Link>
        <Link 
          to="/profile" 
          className="sidebar-link"
          onClick={(e) => handleAuthLink(e, "/profile", "view your threads")}
        >
          <div className="sidebar-icon">
            <span className="text-xl">#</span>
          </div>
          <span>Your Threads</span>
        </Link>
        <Link 
          to="/saved" 
          className="sidebar-link"
          onClick={(e) => handleAuthLink(e, "/saved", "view your saved threads")}
        >
          <div className="sidebar-icon">
            <span className="text-xl">📑</span>
          </div>
          <span>Saved</span>
        </Link>
        {currentUser && currentUser.role === 'admin' && (
          <Link 
            to="/admin" 
            className="sidebar-link"
            onClick={(e) => handleAuthLink(e, "/admin", "access the admin dashboard")}
          >
            <div className="sidebar-icon">
              <LayoutDashboard size={18} />
            </div>
            <span>Admin Dashboard</span>
          </Link>
        )}
      </nav>

      <div className="sidebar-categories">
        <h3 className="sidebar-heading">Categories</h3>
        <div className="category-list">
          {categories.map((category) => (
            <Link 
              key={category.name}
              to={`/category/${category.name.toLowerCase()}`}
              className="category-link"
            >
              <div className="category-color" style={{ backgroundColor: getCategoryColor(category.color) }}></div>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="social-links">
          <a href="#" className="social-link">
            <img src={instagramIcon} alt="Instagram" />
          </a>
          <a href="#" className="social-link">
            <img src={twitterIcon} alt="Twitter" />
          </a>
          <a href="#" className="social-link">
            <img src={telegramIcon} alt="Telegram" />
          </a>
        </div>
        <p className="copyright">© 2025 ConnectForum.io</p>
      </div>
    </div>
  );
};

const getCategoryColor = (colorClass) => {
  const colors = {
    'bg-[#a5d6a7]': '#a5d6a7',
    'bg-[#f8bbd0]': '#f8bbd0',
    'bg-[#b39ddb]': '#b39ddb',
    'bg-[#90caf9]': '#90caf9',
    'bg-[#ffe082]': '#ffe082',
    'bg-[#ef9a9a]': '#ef9a9a'
  };
  return colors[colorClass] || '#6b7280';
};

export default Sidebar; 