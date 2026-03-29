import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { getCurrentUser, updateUserProfile, changePassword } from "../services/api";
import Header from "../components/Header";
import avatar from "../assets/avatar.jpg";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    image: null
  });
  const [previewImage, setPreviewImage] = useState(avatar);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getCurrentUser();
      const userData = response.data;
      setFormData(prev => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || ""
      }));
      // Always use avatar.jpg as the default image
      setPreviewImage(avatar);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Handle password change if password fields are filled
      if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
          throw new Error("Current password is required to change password");
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords don't match");
        }
        if (formData.newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters long");
        }
        
        // Change password first
        await changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
      }

      // Update profile information
      const updateData = {
        name: formData.name,
        bio: formData.bio || ''
      };

      const response = await updateUserProfile(updateData);
      
      if (response.data) {
        // Update local storage with new user data
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUserData = {
          ...userData,
          name: response.data.name,
          bio: response.data.bio || '',
          image: response.data.image || userData.image
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));

        // Dispatch a custom event to notify other components about the profile update
        window.dispatchEvent(new CustomEvent('profileDataUpdate', {
          detail: response.data
        }));

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });

        navigate('/profile');
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-8">Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <Header title="Edit Profile">
          <p>Update your profile information</p>
        </Header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="bg-gray-800 rounded-xl p-6" style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }}>
            <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
            <div className="flex items-center gap-6">
              <img
                src={previewImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('profile-image').click()}
                  className="bg-gray-700 text-gray-300 hover:text-white border-gray-600"
                >
                  Change Photo
                </Button>
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="bg-gray-800 rounded-xl p-6" style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }}>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Name
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Your name"
                  style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <Input
                  name="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-400"
                  style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }}
                />
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                  style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }}
                />
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-gray-800 rounded-xl p-6" style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }}>
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Current Password
                </label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter current password"
                  style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter new password"
                  style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Confirm new password"
                  style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 flex-1"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/profile')}
              className="bg-gray-700 text-gray-300 hover:text-white border-gray-600 flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditProfilePage; 