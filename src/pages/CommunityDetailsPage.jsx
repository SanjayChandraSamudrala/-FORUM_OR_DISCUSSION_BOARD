import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Header from "../components/Header";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getCommunityById,
  addCommunityMember,
  removeCommunityMember,
  getAllUsers // To search for users to add
} from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { UserPlus, UserMinus } from "lucide-react";
import "./CommunityDetailsPage.css";

const CommunityDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const [community, setCommunity] = useState(null);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [potentialMembers, setPotentialMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [removingMember, setRemovingMember] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCommunityDetails();
    }
  }, [id]);

  useEffect(() => {
    if (searchQuery.length > 2) { // Only search if query is at least 3 characters
      searchUsers();
    } else {
      setPotentialMembers([]);
    }
  }, [searchQuery]);

  const fetchCommunityDetails = async () => {
    setLoadingCommunity(true);
    try {
      const response = await getCommunityById(id);
      setCommunity(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch community details",
        variant: "destructive",
      });
      navigate('/community'); // Redirect if community not found or access denied
    } finally {
      setLoadingCommunity(false);
    }
  };

  const searchUsers = async () => {
    try {
      // This API should ideally be a paginated search endpoint
      // For now, fetching all users and filtering in frontend (not efficient for large user bases)
      const response = await getAllUsers(); 
      const filteredUsers = response.data.filter(u => 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !community?.members.some(member => member._id === u._id)
      );
      setPotentialMembers(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users.",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async (userIdToAdd) => {
    setAddingMember(true);
    try {
      await addCommunityMember(id, { userId: userIdToAdd });
      toast({
        title: "Success",
        description: "Member added successfully!",
      });
      fetchCommunityDetails(); // Refresh community details
      setSearchQuery(""); // Clear search
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to add member.",
        variant: "destructive",
      });
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userIdToRemove) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      setRemovingMember(true);
      try {
        await removeCommunityMember(id, { userId: userIdToRemove });
        toast({
          title: "Success",
          description: "Member removed successfully!",
        });
        fetchCommunityDetails(); // Refresh community details
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to remove member.",
          variant: "destructive",
        });
      } finally {
        setRemovingMember(false);
      }
    }
  };

  const isCommunityCreator = community && user && community.creator._id === user._id;
  const isAdmin = user && user.role === 'admin';

  if (authLoading || loadingCommunity) {
    return <MainLayout><div className="text-center py-8">Loading community...</div></MainLayout>;
  }

  if (!community) {
    return null; // Should be handled by navigate in fetchCommunityDetails
  }

  return (
    <MainLayout>
      <Header title={community.name}>
        <p>{community.description}</p>
        {community.isPrivate && (
          <span className="private-badge">Private Community</span>
        )}
      </Header>

      <div className="community-details-container">
        <section className="community-members-section">
          <h2 className="text-2xl font-semibold mb-4">Members ({community.members.length})</h2>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
            <ul>
              {community.members.map((member) => (
                <li key={member._id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                  <p className="font-medium text-white">{member.name} ({member.email})</p>
                  {(isCommunityCreator || isAdmin) && !community.creator._id.equals(member._id) && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={removingMember}
                      title="Remove Member"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {(isCommunityCreator || isAdmin) && (
          <section className="add-member-section">
            <h2 className="text-2xl font-semibold mb-4">Add New Members</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <Input
                type="text"
                placeholder="Search users by email to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-3"
              />

              {searchQuery.length > 2 && potentialMembers.length > 0 ? (
                <div className="bg-gray-700 p-2 rounded-md max-h-40 overflow-y-auto">
                  {potentialMembers.map(u => (
                    <div key={u._id} className="flex justify-between items-center py-1.5 border-b border-gray-600 last:border-b-0">
                      <p className="text-sm text-white">{u.name} ({u.email})</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAddMember(u._id)}
                        disabled={addingMember}
                        title="Add Member"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length > 2 && potentialMembers.length === 0 ? (
                <p className="text-center text-gray-400 text-sm">No users found matching "{searchQuery}"</p>
              ) : (
                <p className="text-center text-gray-500 text-sm">Start typing to search for users.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default CommunityDetailsPage; 