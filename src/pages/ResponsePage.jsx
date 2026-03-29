import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import ThreadCard from "../components/ThreadCard";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Share, Save, MessageSquare, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import Header from "../components/Header";
import { getPost, addReply, toggleLike, toggleDislike, toggleReplyLike, toggleReplyDislike } from "../services/api";

const ResponsePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    try {
      const response = await getPost(id);
      setThread(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch thread",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddResponse = async () => {
    if (!response.trim()) {
      toast({
        title: "Error",
        description: "Response cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const responseData = await addReply(id, response);
      setThread(responseData.data);
      setResponse("");
      
      toast({
        title: "Success",
        description: "Your response has been added!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add response",
        variant: "destructive",
      });
    }
  };

  const handleLike = async () => {
    try {
      const response = await toggleLike(id);
      setThread(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handleDislike = async () => {
    try {
      const response = await toggleDislike(id);
      setThread(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dislike post",
        variant: "destructive",
      });
    }
  };

  const handleReplyLike = async (replyId) => {
    try {
      // Get the post ID from the URL parameter
      const postId = id;
      const response = await toggleReplyLike(postId, replyId);
      
      if (response?.data) {
        // Update the thread state with the new like count
        setThread(prevThread => ({
          ...prevThread,
          replies: prevThread.replies.map(reply => {
            if (reply._id === replyId) {
              return {
                ...reply,
                likes: response.data.likes ?? reply.likes ?? 0,
                dislikes: response.data.dislikes ?? reply.dislikes ?? 0,
                userLiked: response.data.userLiked ?? false,
                userDisliked: false // Reset dislike state when liking
              };
            }
            return reply;
          })
        }));

        toast({
          title: "Success",
          description: response.data.userLiked ? "Response liked!" : "Like removed!",
        });
      }
    } catch (error) {
      console.error('Error liking reply:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to like response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReplyDislike = async (replyId) => {
    try {
      // Get the post ID from the URL parameter
      const postId = id;
      const response = await toggleReplyDislike(postId, replyId);
      
      if (response?.data) {
        // Update the thread state with the new dislike count
        setThread(prevThread => ({
          ...prevThread,
          replies: prevThread.replies.map(reply => {
            if (reply._id === replyId) {
              return {
                ...reply,
                likes: response.data.likes ?? reply.likes ?? 0,
                dislikes: response.data.dislikes ?? reply.dislikes ?? 0,
                userLiked: false, // Reset like state when disliking
                userDisliked: response.data.userDisliked ?? false
              };
            }
            return reply;
          })
        }));

        toast({
          title: "Success",
          description: response.data.userDisliked ? "Response disliked!" : "Dislike removed!",
        });
      }
    } catch (error) {
      console.error('Error disliking reply:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to dislike response. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-8">Loading thread...</div>
      </MainLayout>
    );
  }

  if (!thread) {
    return (
      <MainLayout>
        <div className="text-center py-8">Thread not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <Header title="Thread Details">
          <p>View and respond to the discussion</p>
        </Header>

        {/* Main Thread */}
        <ThreadCard thread={thread} />

        {/* Response Form */}
        <div className="mt-8">
          <div className="flex items-start gap-4">
            <img
              src={thread.author.image || "/default-avatar.png"}
              alt="User avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <Textarea
                placeholder="Write your response..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[100px] bg-gray-800 border-gray-700"
              />
              <div className="flex justify-end mt-2">
                <Button onClick={handleAddResponse} className="bg-blue-500 hover:bg-blue-600">
                  <Send className="w-4 h-4 mr-2" />
                  Post Response
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Responses List */}
        <div className="mt-8 space-y-4">
          {thread.replies.map((reply) => (
            <div key={reply._id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <img
                  src={reply.author.image || "/default-avatar.png"}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{reply.author.name}</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-300">{reply.content}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`text-gray-400 hover:text-white ${reply.userLiked ? 'text-purple-500' : ''}`}
                      onClick={() => handleReplyLike(reply._id)}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {reply.likes || 0}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`text-gray-400 hover:text-white ${reply.userDisliked ? 'text-purple-500' : ''}`}
                      onClick={() => handleReplyDislike(reply._id)}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      {reply.dislikes || 0}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ResponsePage; 