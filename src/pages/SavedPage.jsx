import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import ThreadCard from "../components/ThreadCard";
import { getSavedItems } from "../services/api";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "../services/api";

const SavedPage = () => {
  const [savedItems, setSavedItems] = useState({
    posts: [],
    replies: [],
    trendingTopics: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const response = await getSavedItems();
        console.log("response ",response)
        if (response.data) {
          // Fetch full parent posts/topics for saved replies
          const savedRepliesWithParents = await Promise.all(response.data.replies.map(async (reply) => {
            if (reply.postId) {
              try {
                const postResponse = await api.get(`/posts/${reply.postId}`);
                return { ...reply, parent: postResponse.data, isTrendingTopic: false };
              } catch (error) {
                console.error(`Error fetching parent post for reply ${reply.replyId}:`, error);
                return { ...reply, parent: null, isTrendingTopic: false }; // Handle error gracefully
              }
            } else if (reply.topicId) {
              try {
                const topicResponse = await api.get(`/trending/${reply.topicId}`);
                return { ...reply, parent: topicResponse.data, isTrendingTopic: true };
              } catch (error) {
                console.error(`Error fetching parent topic for reply ${reply.replyId}:`, error);
                return { ...reply, parent: null, isTrendingTopic: true }; // Handle error gracefully
              }
            }
            return { ...reply, parent: null, isTrendingTopic: false }; // Fallback
          }));

          // Separate saved replies and categories after fetching parents
          const replies = savedRepliesWithParents.filter(item => item.parent && !item.isTrendingTopic);

          setSavedItems({
            posts: response.data.posts || [],
            replies: replies,
            trendingTopics: response.data.trendingTopics || [],
          });
        }
      } catch (error) {
        console.error('Error fetching saved items:', error);
        toast({
          title: "Error",
          description: "Failed to load saved items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchSavedItems();
    }
  }, [currentUser]);

  return (
    <MainLayout>
      <div className="saved-page">
        <h1 className="text-2xl font-bold mb-6">Saved Items</h1>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">
              Posts ({savedItems.posts.length})
            </TabsTrigger>
            <TabsTrigger value="replies">
              Post Replies ({savedItems.replies.length})
            </TabsTrigger>
            <TabsTrigger value="trending">
              Trending Topics ({savedItems.trendingTopics.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            {isLoading ? (
              <div className="text-center">Loading saved posts...</div>
            ) : savedItems.posts.length > 0 ? (
              savedItems.posts.map(post => (
                <ThreadCard key={post._id} thread={post} />
              ))
            ) : (
              <div className="text-center text-gray-500">No saved posts yet</div>
            )}
          </TabsContent>

          <TabsContent value="replies" className="mt-6">
            {isLoading ? (
              <div className="text-center">Loading saved replies...</div>
            ) : savedItems.replies.length > 0 ? (
              savedItems.replies.map(reply => (
                <div key={reply._id} className="saved-reply-card">
                  <ThreadCard thread={reply.parent} highlightedReplyId={reply.replyId} />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No saved replies yet</div>
            )}
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            {isLoading ? (
              <div className="text-center">Loading saved trending topics...</div>
            ) : savedItems.trendingTopics.length > 0 ? (
              savedItems.trendingTopics.map(topic => (
                <ThreadCard key={topic._id} thread={topic} isTrendingTopic={true} />
              ))
            ) : (
              <div className="text-center text-gray-500">No saved trending topics yet</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SavedPage; 