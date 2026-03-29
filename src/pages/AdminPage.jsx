import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import Header from "../components/Header";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllPosts,
  deletePost,
  getContactMessages,
  markMessageAsRead,
  markMessageAsReplied,
  deleteContactMessage,
} from "../services/api";
import { Check, X, MailOpen, Reply, Trash2 } from "lucide-react";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageFilter, setMessageFilter] = useState("all"); // 'all', 'unread', 'unreplied'

  // Helper function to format lastActiveAt
  const formatLastActive = (lastActiveAt) => {
    if (!lastActiveAt) return "N/A";

    const now = new Date();
    const lastActive = new Date(lastActiveAt);
    const diffMinutes = Math.floor((now - lastActive) / (1000 * 60));

    if (diffMinutes < 5) {
      return "Active now";
    } else if (diffMinutes < 60) {
      return `Active ${diffMinutes} minutes ago`;
    } else if (diffMinutes < 24 * 60) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `Active ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else {
      const diffDays = Math.floor(diffMinutes / (24 * 60));
      return `Active ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchContactMessages();
  }, [messageFilter]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await getAllPosts();
      setPosts(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch posts",
        variant: "destructive",
      });
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchContactMessages = async () => {
    setLoadingMessages(true);
    try {
      const params = {};
      if (messageFilter === "unread") {
        params.isRead = false;
      }
      if (messageFilter === "unreplied") {
        params.replied = false;
      }
      const response = await getContactMessages(params);
      setContactMessages(response.data.messages);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch contact messages",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user and all their posts?")) {
      try {
        await deleteUser(userId);
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        fetchUsers(); // Refresh user list
        fetchPosts(); // Refresh posts as user's posts are deleted
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
        fetchPosts(); // Refresh post list
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to delete post",
          variant: "destructive",
        });
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, { role: newRole });
      toast({
        title: "Success",
        description: "User role updated successfully!",
      });
      fetchUsers(); // Refresh user list to reflect role change
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId);
      toast({
        title: "Success",
        description: "Message marked as read.",
      });
      fetchContactMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to mark message as read.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsReplied = async (messageId) => {
    try {
      await markMessageAsReplied(messageId);
      toast({
        title: "Success",
        description: "Message marked as replied.",
      });
      fetchContactMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to mark message as replied.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteContactMessage(messageId);
        toast({
          title: "Success",
          description: "Message deleted successfully.",
        });
        fetchContactMessages();
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to delete message.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <MainLayout>
      <Header title="Admin Dashboard">
        <p>Manage users, posts, and contact messages</p>
      </Header>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Users ({users.length})</h2>
          {loadingUsers ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              {users.length > 0 ? (
                <ul>
                  {users.map((user) => (
                    <li key={user._id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                      <div>
                        <p className="font-medium text-white">{user.name} ({user.email})</p>
                        <p className="text-sm text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-400">Status: {formatLastActive(user.lastActiveAt)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(newRole) => handleRoleChange(user._id, newRole)} value={user.role}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete User
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400">No users found.</p>
              )}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Posts ({posts.length})</h2>
          {loadingPosts ? (
            <div className="text-center py-4">Loading posts...</div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              {posts.length > 0 ? (
                <ul>
                  {posts.map((post) => (
                    <li key={post._id} className="py-2 border-b border-gray-700 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{post.title}</p>
                          <p className="text-sm text-gray-400">Author: {post.author?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">Category: {post.category}</p>
                          <p className="text-xs text-gray-500">Created: {new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeletePost(post._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Post
                        </Button>
                      </div>
                      <div 
                        className="text-gray-300 text-sm mt-1 mb-2 max-h-20 overflow-hidden text-ellipsis"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400">No posts found.</p>
              )}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Messages ({contactMessages.length})</h2>
          <div className="flex space-x-2 mb-4">
            <Button 
              variant={messageFilter === "all" ? "default" : "outline"} 
              onClick={() => setMessageFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={messageFilter === "unread" ? "default" : "outline"} 
              onClick={() => setMessageFilter("unread")}
            >
              Unread
            </Button>
            <Button 
              variant={messageFilter === "unreplied" ? "default" : "outline"} 
              onClick={() => setMessageFilter("unreplied")}
            >
              Unreplied
            </Button>
          </div>
          {loadingMessages ? (
            <div className="text-center py-4">Loading messages...</div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              {contactMessages.length > 0 ? (
                <ul>
                  {contactMessages.map((message) => (
                    <li key={message._id} className="py-3 border-b border-gray-700 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-white">From: {message.name} &lt;{message.email}&gt;</p>
                          {message.subject && <p className="text-sm text-gray-400">Subject: {message.subject}</p>}
                          <p className="text-xs text-gray-500">Received: {new Date(message.createdAt).toLocaleString()}</p>
                          <div className="flex items-center text-xs mt-1">
                            <span className={`px-2 py-0.5 rounded-full ${message.isRead ? 'bg-green-600' : 'bg-yellow-600'} text-white mr-2`}>
                              {message.isRead ? 'Read' : 'Unread'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full ${message.replied ? 'bg-blue-600' : 'bg-orange-600'} text-white`}>
                              {message.replied ? 'Replied' : 'Unreplied'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {!message.isRead && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleMarkAsRead(message._id)}
                              title="Mark as Read"
                            >
                              <MailOpen className="h-4 w-4" />
                            </Button>
                          )}
                          {!message.replied && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleMarkAsReplied(message._id)}
                              title="Mark as Replied"
                            >
                              <Reply className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteMessage(message._id)}
                            title="Delete Message"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mt-2 p-2 bg-gray-700 rounded-md">{message.message}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400">No contact messages found.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default AdminPage; 