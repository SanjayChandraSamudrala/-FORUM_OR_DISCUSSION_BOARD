import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import Header from "../components/Header";
import { createCommunity, getCommunities } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Lock, Users } from "lucide-react";
import "./CommunityPage.css";

const CommunityPage = () => {
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    setLoadingCommunities(true);
    try {
      const response = await getCommunities();
      setCommunities(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch communities",
        variant: "destructive",
      });
    } finally {
      setLoadingCommunities(false);
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    
    if (!communityName || !communityDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await createCommunity({
        name: communityName,
        description: communityDescription,
        isPrivate,
      });
      
      toast({
        title: "Community Created!",
        description: `Community "${response.data.name}" has been created.`, 
      });
      
      // Refresh the list of communities and redirect
      fetchCommunities();
      navigate(`/community/${response.data._id}`);

      // Reset form (though redirection will handle this)
      setCommunityName("");
      setCommunityDescription("");
      setIsPrivate(false);
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommunityClick = (communityId) => {
    navigate(`/community/${communityId}`);
  };

  return (
    <MainLayout initialIsLoggedIn={true}>
      <div className="community-container">
        <Header title="Communities">
          <p>Join existing communities or create your own</p>
        </Header>
        
        <h1 className="community-title">
          Top community that you can join & discuss
        </h1>
        
        <p className="community-description">
          You can join the community you want to discuss with anyone, anywhere, and anytime.
        </p>
        
        <section className="existing-communities-section">
          <h2 className="text-2xl font-semibold mb-4">Existing Communities</h2>
          {loadingCommunities ? (
            <div className="text-center py-4">Loading communities...</div>
          ) : communities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.map((community) => (
                <div 
                  key={community._id} 
                  className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleCommunityClick(community._id)}
                >
                  <h3 className="font-medium text-white text-lg mb-2">{community.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{community.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    {community.isPrivate ? (
                      <><Lock className="h-3 w-3 mr-1" /> Private</>
                    ) : (
                      <><Users className="h-3 w-3 mr-1" /> Public</>
                    )}
                    <span className="ml-auto">Members: {community.members.length}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No communities found. Be the first to create one!</p>
          )}
        </section>

        <div className="create-community-section">
          <h2 className="create-community-title">Create a New Community</h2>
          
          <form onSubmit={handleCreateCommunity}>
            <div className="form-field">
              <label htmlFor="community-name" className="field-label">
                Community Name *
              </label>
              <Input
                id="community-name"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                placeholder="Enter community name"
                className="field-input"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="community-description" className="field-label">
                Community Description *
              </label>
              <Textarea
                id="community-description"
                value={communityDescription}
                onChange={(e) => setCommunityDescription(e.target.value)}
                placeholder="Describe what your community is about"
                rows={4}
                className="field-textarea"
              />
            </div>
            
            <div className="checkbox-container">
              <input
                id="private-community"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="checkbox-input"
              />
              <label htmlFor="private-community" className="checkbox-label">
                Make this community private
              </label>
              <p className="checkbox-description">
                Private communities require admin approval for new members
              </p>
            </div>
            
            <Button 
              type="submit"
              className="create-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Community"}
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunityPage; 