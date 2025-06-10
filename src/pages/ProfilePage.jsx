import MainLayout from "../components/MainLayout";
import ThreadCard from "../components/ThreadCard";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import accountIcon from "../assets/accountIcon.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [userThreads, setUserThreads] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [likedContent, setLikedContent] = useState([]);
  const [activeTab, setActiveTab] = useState('threads');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserContent = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      // Fetch user's threads and responses
      const response = await api.get(`/users/${currentUser.id}/content`);
      
      setUserThreads(response.data.threads || []);
      setUserResponses(response.data.responses || []);
      
      // Get liked content
      const likedThreadIds = JSON.parse(localStorage.getItem('likedThreads') || '[]');
      const likedResponse = await api.get(`/users/${currentUser.id}/liked-content`);
      setLikedContent(likedResponse.data || []);
    } catch (error) {
      console.error('Error fetching user content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserContent();
  }, [currentUser?.id]);

  // Listen for thread creation events
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUserContent();
    };

    window.addEventListener('profileDataUpdate', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileDataUpdate', handleProfileUpdate);
    };
  }, [currentUser?.id]);

  const handleCreateThread = () => {
    navigate('/threads');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'threads':
        return userThreads.length > 0 ? (
          userThreads.map(thread => (
            <ThreadCard key={thread._id} thread={thread} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No threads yet</h3>
            <p className="text-gray-400 mb-6">Start a conversation by creating your first thread</p>
            <Button 
              className="bg-purple-500 hover:bg-purple-600"
              onClick={handleCreateThread}
            >
              Create Thread
            </Button>
          </div>
        );

      case 'responses':
        return userResponses.length > 0 ? (
          userResponses.map(response => (
            <div key={response._id} className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))', border: '1px solid hsl(var(--border))' }}>
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={response.author.image || accountIcon} 
                  alt={response.author.name}
                  className="w-10 h-10 rounded-md"
                />
                <div>
                  <p className="font-medium">{response.author.name}</p>
                  <p className="text-sm text-gray-400">{new Date(response.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: response.content }}
              />
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-gray-400">
                  <span>{response.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <span>{response.dislikes?.length || 0}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No responses yet</h3>
            <p className="text-gray-400">Start participating in discussions by responding to threads</p>
          </div>
        );

      case 'likes':
        return likedContent.length > 0 ? (
          likedContent.map(content => (
            <div key={content._id} className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))', border: '1px solid hsl(var(--border))' }}>
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={content.author.image || accountIcon} 
                  alt={content.author.name}
                  className="w-10 h-10 rounded-md"
                />
                <div>
                  <p className="font-medium">{content.author.name}</p>
                  <p className="text-sm text-gray-400">{new Date(content.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {content.title && (
                <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
              )}
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-gray-400">
                  <span>{content.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <span>{content.dislikes?.length || 0}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No liked content yet</h3>
            <p className="text-gray-400">Like threads and responses to see them here</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout initialIsLoggedIn={true}>
      <div>
        <Header title="My Profile">
          <p>Manage your profile and view your contributions</p>
        </Header>
        
        {/* Profile Header */}
        <div className="mb-8">
          <div className="h-40 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 rounded-lg mb-4"></div>
          
          <div className="flex flex-col items-center -mt-16">
            <img 
              src={currentUser.image || accountIcon}
              alt={currentUser.name}
              className="w-32 h-32 rounded-full border-4 border-[#1A1F2C] mb-4"
            />
            
            <h1 className="text-2xl font-bold uppercase mb-1">{currentUser.name}</h1>
            <p className="text-gray-400 mb-4">{currentUser.role}</p>
            
            <p className="text-center max-w-md mb-6">
              {currentUser.bio}
            </p>
          </div>
        </div>
        
        {/* Profile Tabs */}
        <div className="mb-8">
          <div className="flex">
            <Button 
              variant="ghost" 
              className={`px-6 py-2 ${activeTab === 'threads' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('threads')}
            >
              Threads
            </Button>
            <Button 
              variant="ghost" 
              className={`px-6 py-2 ${activeTab === 'responses' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('responses')}
            >
              Responses
            </Button>
            <Button 
              variant="ghost" 
              className={`px-6 py-2 ${activeTab === 'likes' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('likes')}
            >
              Likes
            </Button>
          </div>
        </div>
        
        {/* Content */}
        {renderContent()}
      </div>
    </MainLayout>
  );
};

export default ProfilePage; 