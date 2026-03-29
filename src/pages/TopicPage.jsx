import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import ThreadCard from "../components/ThreadCard";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Header from "../components/Header";
import userAvatar from "../assets/user1.jpg";
import { getTrendingTopics, createTrendingTopic } from "../services/api";

const TopicPage = () => {
  const { topicName } = useParams();
  const [newPost, setNewPost] = useState("");
  const [topicThreads, setTopicThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchTopicThreads();
  }, [topicName]);

  const fetchTopicThreads = async () => {
    try {
      // Fetch trending topics for this specific topic
      const response = await getTrendingTopics({ 
        topic: topicName,
        timeRange: '30d', // Get posts from last 30 days
        limit: 50 // Get more posts
      });

      if (response.data && response.data.topics) {
        setTopicThreads(response.data.topics);
      }
    } catch (error) {
      console.error('Error fetching topic threads:', error);
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
        title: `${topicName} Discussion`,
        content: newPost,
        topic: topicName, // Set the exact topic name
        author: currentUser._id,
        status: 'rising' // Start as rising topic
      };

      const response = await createTrendingTopic(postData);
      
      if (response.data) {
        // Add the new post to the list and refresh the list
        await fetchTopicThreads();
        setNewPost("");

        toast({
          title: "Success",
          description: "Your post has been created!",
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create post",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div>
        <Header title={topicName}>
          <p>Join the conversation about {topicName}</p>
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
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <img 
                src={userAvatar}
                alt="User avatar" 
                className="w-10 h-10 rounded-md object-cover"
              />
              <textarea
                placeholder={`Share your thoughts about ${topicName}...`}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="flex-1 rounded-md p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 border border-gray-300 bg-gray-100"
                rows={1}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Smile size={20} />
                </Button>
              </div>
              <Button onClick={handlePost} className="bg-blue-500 hover:bg-blue-600">
                POST
              </Button>
            </div>
          </div>
        ) : null}

        {/* Threads List */}
        {loading ? (
          <div className="text-center py-8">Loading threads...</div>
        ) : (
          <div className="space-y-4">
            {topicThreads.length > 0 ? (
              topicThreads.map((thread) => (
                <ThreadCard key={thread._id} thread={thread} />
              ))
            ) : (
              <div className="text-center py-8">
                <p>No discussions yet about {topicName}. Be the first to start one!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TopicPage; 