import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import ThreadCard, { LoginButton } from "../components/ThreadCard";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Header from "../components/Header";
import "./CategoryPage.css";
import userAvatar from "../assets/user1.jpg";
import { getPosts, createPost } from "../services/api";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [newPost, setNewPost] = useState("");
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  
  // Format category name for display (only for UI elements, not for data)
  const formattedCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : "Category";

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchCategoryThreads();
  }, [categoryName]);

  const fetchCategoryThreads = async () => {
    try {
      // Get posts for this specific category
      const response = await getPosts({ category: categoryName });
      
      // Filter posts to only include those matching the exact category
      const filteredPosts = response.data.posts.filter(post => 
        post.category && post.category.toLowerCase() === categoryName.toLowerCase()
      );
      
      setThreads(filteredPosts);
    } catch (error) {
      console.error('Error fetching category threads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch threads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      return;
    }

    try {
      const postData = {
        title: `${categoryName} Discussion`,
        content: newPost,
        category: categoryName,
        author: currentUser._id
      };

      const response = await createPost(postData);
      
      // Create a complete thread object with the response data
      const newThread = {
        ...response.data,
        author: {
          _id: currentUser._id,
          name: currentUser.name,
          image: currentUser.image
        },
        category: categoryName, // Explicitly set category
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false,
        replies: []
      };

      // Only add the new thread if it matches the current category
      if (newThread.category.toLowerCase() === categoryName.toLowerCase()) {
        setThreads([newThread, ...threads]);
      }

      toast({
        title: "Success",
        description: "Your post has been created!",
      });

      setNewPost("");
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create post",
        variant: "destructive",
      });
    }
  };

  // Handler to update a thread in the threads state
  const handleThreadUpdate = (updatedThread) => {
    setThreads(prevThreads => prevThreads.map(thread =>
      thread._id === updatedThread._id ? { ...thread, ...updatedThread } : thread
    ));
  };

  return (
    <MainLayout>
      <div>
        <Header title={formattedCategoryName}>
          <p>Explore discussions related to {formattedCategoryName}</p>
        </Header>

        {/* Login Button for non-authenticated users */}
        {!currentUser && (
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gray-800 text-white py-4 rounded-xl hover:bg-gray-700 transition-colors mb-8 cursor-pointer"
          >
            Please log in to create a post
          </button>
        )}

        {/* Create Post Area */}
        {currentUser ? (
          <div className="create-post-area">
            <div className="create-post-header">
              <img 
                src={userAvatar}
                alt="User avatar" 
                className="user-avatar object-cover"
              />
              <textarea
                placeholder={`What's on your mind about ${formattedCategoryName}?`}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="post-textarea"
                rows={1}
              />
            </div>
            
            <div className="post-actions">
              <div className="formatting-buttons">
                <button className="format-button">
                  <Smile size={20} />
                </button>
              </div>
              
              <Button 
                className="post-button"
                onClick={handlePost}
              >
                POST
              </Button>
            </div>
          </div>
        ) : null}
        
        {/* Threads */}
        {loading ? (
          <div className="text-center py-8">Loading threads...</div>
        ) : (
          <div className="space-y-4">
            {threads.length > 0 ? (
              threads.map((thread) => {
                // Add logging here to inspect the thread object
                console.log('Rendering ThreadCard with thread:', thread);
                return <ThreadCard key={thread._id} thread={thread} onThreadUpdate={handleThreadUpdate} />;
              })
            ) : (
              <div className="text-center py-8">
                <p>No threads yet in {formattedCategoryName}. Be the first to start a discussion!</p>
              </div>
            )}
          </div>
        )}

        {!currentUser && <LoginButton />}
      </div>
    </MainLayout>
  );
};

export default CategoryPage; 