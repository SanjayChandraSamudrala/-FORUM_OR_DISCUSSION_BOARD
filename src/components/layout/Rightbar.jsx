import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, ExternalLink } from "lucide-react";
import { getTrendingCategories } from "../../services/api";
import "./Rightbar.css";

// Map of category names to emoji icons
const categoryIcons = {
  sports: "⚽",
  programming: "💻",
  iot: "🌐",
  general: "💬",
  technology: "📱",
  science: "🔬",
  business: "💼",
  entertainment: "🎬",
  gaming: "🎮",
  health: "🏥",
  education: "📚",
  lifestyle: "🌟",
  news: "📰",
  politics: "🏛️",
  art: "🎨",
  music: "🎵",
  food: "🍽️",
  travel: "✈️"
};

const Rightbar = ({ isLoggedIn }) => {
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingCategories();
    // Refresh trending categories every 5 minutes
    const interval = setInterval(fetchTrendingCategories, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrendingCategories = async () => {
    try {
      const response = await getTrendingCategories({ timeRange: '24h' });
      
      if (response.data) {
        // Transform the data to include icons and format the display
        const categories = response.data.map(category => ({
          name: category.name,
          icon: categoryIcons[category.name.toLowerCase()] || "💬",
          totalComments: category.totalComments,
          postCount: category.postCount,
          latestPost: new Date(category.latestPost)
        }));

        setTrendingCategories(categories);
      }
    } catch (error) {
      console.error('Error fetching trending categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rightbar">
        <div className="rightbar-section">
          <div className="section-header">
            <h3 className="section-title">Loading...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rightbar">
      <div className="rightbar-section">
        <div className="section-header">
          <h3 className="section-title">Trending Topics</h3>
          <Users size={18} />
        </div>
        <div className="topic-list">
          {trendingCategories.map((category) => (
            <Link 
              key={category.name} 
              to={`/category/${category.name}`}
              className="topic-item"
            >
              <div className="topic-avatar">{category.icon}</div>
              <div className="topic-info">
                <span className="topic-name">{category.name}</span>
                <span className="topic-stats">
                  {category.totalComments} comments • {category.postCount} posts
                </span>
              </div>
              <ExternalLink size={14} className="topic-icon" />
            </Link>
          ))}
          {trendingCategories.length === 0 && (
            <div className="no-topics">No trending topics yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rightbar; 