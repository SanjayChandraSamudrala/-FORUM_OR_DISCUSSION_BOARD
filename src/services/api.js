import axios from 'axios';

// Use the right backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token        
api.interceptors.request.use(                                 
  (config) => {                                                
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an invalid/expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle 404 errors
    if (error.response?.status === 404) {
      console.error('Resource not found:', originalRequest.url);
      error.message = 'The requested resource is not available';
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }

    return Promise.reject(error);
  }
);

// User APIs
export const registerUser = (userData) => {
  return api.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

export const getUserThreads = () => {
  return api.get('/auth/threads');
};

export const updateUserProfile = (userData) => {
  return api.put('/auth/profile', userData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
  });
};

export const changePassword = (passwordData) => {
  return api.put('/auth/change-password', passwordData);
};

// Thread APIs
export const getAllThreads = () => {
  return api.get('/threads');
};

export const getThreadById = (id) => {
  return api.get(`/threads/${id}`);
};

export const getThreadsByCategory = (category) => {
  return api.get(`/categories/${category}/threads`);
};

export const createThread = (threadData) => {
  return api.post('/threads', threadData);
};

export const updateThread = (id, threadData) => {
  return api.put(`/threads/${id}`, threadData);
};

export const deleteThread = (id) => {
  return api.delete(`/threads/${id}`);
};

export const addResponse = (threadId, content) => {
  return api.post(`/threads/${threadId}/responses`, { content });
};

export const likeThread = (threadId) => {
  return api.post(`/threads/${threadId}/like`);
};

export const dislikeThread = (threadId) => {
  return api.post(`/threads/${threadId}/dislike`);
};

export const saveThread = (threadId) => {
  return api.post(`/threads/${threadId}/save`);
};

// Posts API
export const getPosts = (params = {}) => {
  return api.get('/posts', { params });
};

export const getPost = (id) => {
  return api.get(`/posts/${id}`);
};

export const createPost = async (postData) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user) {
    throw new Error('User must be logged in to create a post');
  }

  const response = await api.post('/posts', {
    ...postData,
    author: user._id
  });

  // Update the user's threads in localStorage if needed
  try {
    // Fetch updated user content to ensure we have the latest data
    const userContent = await api.get(`/users/${user._id}/content`);
    const updatedThreads = userContent.data.threads || [];
    localStorage.setItem('userThreads', JSON.stringify(updatedThreads));
  } catch (error) {
    console.error('Error updating user threads in localStorage:', error);
  }

  return response;
};

export const updatePost = (id, postData) => {
  return api.put(`/posts/${id}`, postData);
};

export const deletePost = (id) => {
  return api.delete(`/posts/${id}`);
};

// Post interactions
export const addReply = (postId, content) => {
  return api.post(`/posts/${postId}/replies`, { content });
};

export const toggleLike = (postId) => {
  return api.post(`/posts/${postId}/like`);
};

export const toggleDislike = (postId) => {
  return api.post(`/posts/${postId}/dislike`);
};

export const toggleReplyLike = (postId, replyId) => {
  return api.post(`/posts/${postId}/replies/${replyId}/like`);
};

export const toggleReplyDislike = (postId, replyId) => {
  return api.post(`/posts/${postId}/replies/${replyId}/dislike`);
};

// Trending Topics API
export const getTrendingTopics = (params = {}) => {
  return api.get('/trending', { params });
};

export const getTrendingTopic = (id) => {
  return api.get(`/trending/${id}`);
};

export const createTrendingTopic = (topicData) => {
  return api.post('/trending', topicData);
};

export const updateTrendingTopic = (id, topicData) => {
  return api.put(`/trending/${id}`, topicData);
};

export const deleteTrendingTopic = (id) => {
  return api.delete(`/trending/${id}`);
};

// Trending topic interactions
export const addTrendingReply = (topicId, content) => {
  return api.post(`/trending/${topicId}/replies`, { content });
};

export const toggleTrendingLike = (topicId) => {
  return api.post(`/trending/${topicId}/like`);
};

export const toggleTrendingDislike = (topicId) => {
  return api.post(`/trending/${topicId}/dislike`);
};

export const toggleTrendingReplyLike = (topicId, replyId) => {
  return api.post(`/trending/${topicId}/replies/${replyId}/like`);
};

export const toggleTrendingReplyDislike = (topicId, replyId) => {
  return api.post(`/trending/${topicId}/replies/${replyId}/dislike`);
};

// Save functionality
export const savePost = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/save`, {
      savedAt: new Date().toISOString(),
      type: 'post'
    });
    return response;
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
};

export const unsavePost = async (postId) => {
  return await api.delete(`/posts/${postId}/save`);
};

export const saveReply = async (postId, replyId) => {
  try {
    const response = await api.post(`/posts/${postId}/replies/${replyId}/save`, {
      savedAt: new Date().toISOString(),
      type: 'reply'
    });
    return response;
  } catch (error) {
    console.error('Error saving reply:', error);
    throw error;
  }
};

export const unsaveReply = (postId, replyId) => {
  return api.delete(`/posts/${postId}/replies/${replyId}/save`);
};

export const saveTrendingTopic = async (topicId) => {
  try {
    const response = await api.post(`/trending/${topicId}/save`, {
      savedAt: new Date().toISOString(),
      type: 'trending'
    });
    return response;
  } catch (error) {
    console.error('Error saving trending topic:', error);
    throw error;
  }
};

export const unsaveTrendingTopic = async (topicId) => {
  return await api.delete(`/trending/${topicId}/save`);
};

export const saveTrendingReply = async (topicId, replyId) => {
  try {
    const response = await api.post(`/trending/${topicId}/replies/${replyId}/save`, {
      savedAt: new Date().toISOString(),
      type: 'trending_reply'
    });
    return response;
  } catch (error) {
    console.error('Error saving trending reply:', error);
    throw error;
  }
};

export const unsaveTrendingReply = (topicId, replyId) => {
  return api.delete(`/trending/${topicId}/replies/${replyId}/save`);
};

export const getSavedItems = () => {
  return api.get('/users/saved');
};

// Password Reset
export const requestPasswordReset = async (email) => {
  return await api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token, password) => {
  return await api.post(`/auth/reset-password/${token}`, { password });
};

// Check if post is saved
export const checkPostSaved = async (postId) => {
  return await api.get(`/posts/${postId}/saved`);
};

// Check if reply is saved
export const checkReplySaved = async (postId, replyId) => {
  console.log('checkReplySaved called with postId:', postId, 'replyId:', replyId);
  return await api.get(`/posts/${postId}/replies/${replyId}/saved`);
};

// Check if trending topic is saved
export const checkTrendingTopicSaved = async (topicId) => {
  return await api.get(`/trending/${topicId}/saved`);
};

// Check if trending reply is saved
export const checkTrendingReplySaved = async (topicId, replyId) => {
  return await api.get(`/trending/${topicId}/replies/${replyId}/saved`);
};

export const getTrendingReplyDislike = (topicId, replyId) => {
  return api.post(`/trending/${topicId}/replies/${replyId}/dislike`);
};

export const getDistinctCategories = () => {
  return api.get('/posts/categories/distinct');
};

// Admin API functions
export const getAllUsers = () => {
  return api.get('/users/all');
};

export const deleteUser = (userId) => {
  return api.delete(`/users/${userId}`);
};

export const getAllPosts = () => {
  return api.get('/posts/all');
};

export const updateUserRole = (userId, roleData) => {
  return api.patch(`/users/${userId}/role`, roleData);
};

// Contact APIs
export const submitContactMessage = (messageData) => {
  return api.post('/contact', messageData);
};

export const getContactMessages = (params) => {
  return api.get('/contact/all', { params });
};

export const markMessageAsRead = (messageId) => {
  return api.patch(`/contact/${messageId}/read`);
};

export const markMessageAsReplied = (messageId) => {
  return api.patch(`/contact/${messageId}/replied`);
};

export const deleteContactMessage = (messageId) => {
  return api.delete(`/contact/${messageId}`);
};

// Community APIs
export const createCommunity = (communityData) => {
  return api.post('/communities', communityData);
};

export const getCommunities = () => {
  return api.get('/communities');
};

export const getCommunityById = (id) => {
  return api.get(`/communities/${id}`);
};

export const addCommunityMember = (communityId, memberData) => {
  return api.patch(`/communities/${communityId}/add-member`, memberData);
};

export const removeCommunityMember = (communityId, memberData) => {
  return api.patch(`/communities/${communityId}/remove-member`, memberData);
};

// Search API
export const search = (query) => {
  return api.get(`/search?q=${encodeURIComponent(query)}`);
};

// Get trending categories
export const getTrendingCategories = (params = {}) => {
  return api.get('/posts/trending-categories', { params });
};

export default api; 