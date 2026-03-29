import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import ThreadCard from "../components/ThreadCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Header from "../components/Header";
import { getCurrentUser, getUserThreads } from "../services/api";
import avatar from "../assets/avatar.jpg";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userThreads, setUserThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const [userResponse, threadsResponse] = await Promise.all([
        getCurrentUser(),
        getUserThreads()
      ]);

      setUser(userResponse.data);
      setUserThreads(threadsResponse.data.threads);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();

    // Add event listener for profile updates
    const handleProfileUpdate = async (event) => {
      if (event.detail) {
        // Update user state with the new data
        setUser(prevUser => ({
          ...prevUser,
          ...event.detail
        }));
        // Refresh threads to ensure they have updated data
        await fetchUserData();
      }
    };

    window.addEventListener('profileDataUpdate', handleProfileUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('profileDataUpdate', handleProfileUpdate);
    };
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-8">Loading profile...</div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Please log in to view your profile</p>
          <Button onClick={() => navigate('/login')} className="bg-blue-500 hover:bg-blue-600">
            Login
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <Header title="Profile">
          <p>View and manage your profile</p>
        </Header>

        {/* Profile Info */}
        <div className="rounded-xl p-6 mb-8 bg-card text-card-foreground border border-border">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          {user.bio && (
            <p className="text-gray-300 mt-4">{user.bio}</p>
          )}
          <div className="mt-4">
            <Button
              onClick={() => navigate('/profile/edit')}
              variant="outline"
              className="bg-[#1A1F2C] text-gray-300 hover:text-white border-gray-700 hover:bg-[#1A1F2C]/80"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* User's Threads Section */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">My Threads</h3>
          <div className="space-y-4">
            {userThreads.length > 0 ? (
              userThreads.map((thread) => (
                <ThreadCard key={thread._id} thread={thread} />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-800 rounded-xl">
                <p className="text-gray-400">You haven't created any threads yet.</p>
                <Button
                  onClick={() => navigate('/threads')}
                  className="mt-4 bg-blue-500 hover:bg-blue-600"
                >
                  Create Your First Thread
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage; 