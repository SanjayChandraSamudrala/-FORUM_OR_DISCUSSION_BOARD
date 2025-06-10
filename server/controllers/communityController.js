const Community = require('../models/Community');
const User = require('../models/User');
const adminController = require('./adminController');

// Create a new community
exports.createCommunity = async (req, res) => {
  try {
    console.log('req.user in createCommunity:', req.user);
    const { name, description, isPrivate } = req.body;
    const creatorId = req.user._id;

    // Basic validation
    if (!name || !description) {
      return res.status(400).json({ error: 'Community name and description are required.' });
    }

    // Check if community name already exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ error: 'Community name already taken.' });
    }

    const newCommunity = new Community({
      name,
      description,
      creator: creatorId,
      members: [creatorId], // Creator is automatically a member
      isPrivate: isPrivate || false,
    });

    await newCommunity.save();

    // Add community to creator's list of communities (if you add such a field to User model)
    // For now, we'll just log the creation
    adminController.logAdminAction(
      creatorId,
      'community_management',
      `Created new community: ${name}`,
      { communityId: newCommunity._id, communityName: name }
    );

    res.status(201).json(newCommunity);
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ error: 'Failed to create community.' });
  }
};

// Get all communities (publicly visible ones)
exports.getCommunities = async (req, res) => {
  console.log("Attempting to fetch communities...");
  try {
    const communities = await Community.find({ isPrivate: false })
      .populate('creator', 'name email');
    res.json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities.' });
  }
};

// Get a single community by ID
exports.getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('members', 'name email');

    if (!community) {
      return res.status(404).json({ error: 'Community not found.' });
    }

    // Check if the user is a member if the community is private
    if (community.isPrivate && !community.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Access denied: Private community.' });
    }

    res.json(community);
  } catch (error) {
    console.error('Error getting community by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve community.' });
  }
};

// Add a member to a community (admin or creator only for private, or open for public)
exports.addCommunityMember = async (req, res) => {
  try {
    const communityId = req.params.id;
    const { userId } = req.body; // The ID of the user to add

    const community = await Community.findById(communityId);
    const userToAdd = await User.findById(userId);

    if (!community) {
      return res.status(404).json({ error: 'Community not found.' });
    }
    if (!userToAdd) {
      return res.status(404).json({ error: 'User to add not found.' });
    }

    // Check permissions
    const isCreator = community.creator.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (community.isPrivate && !(isCreator || isAdmin)) {
      return res.status(403).json({ error: 'Only creator or admin can add members to a private community.' });
    }

    if (community.members.includes(userId)) {
      return res.status(400).json({ error: 'User is already a member.' });
    }

    community.members.push(userId);
    await community.save();

    adminController.logAdminAction(
      req.user._id,
      'community_management',
      `Added user ${userToAdd.email} to community ${community.name}`,
      { communityId: community._id, userId: userToAdd._id }
    );

    res.json({ message: 'Member added successfully.', community });
  } catch (error) {
    console.error('Error adding community member:', error);
    res.status(500).json({ error: 'Failed to add member.' });
  }
};

// Remove a member from a community (admin or creator only)
exports.removeCommunityMember = async (req, res) => {
  try {
    const communityId = req.params.id;
    const { userId } = req.body; // The ID of the user to remove

    const community = await Community.findById(communityId);
    const userToRemove = await User.findById(userId);

    if (!community) {
      return res.status(404).json({ error: 'Community not found.' });
    }
    if (!userToRemove) {
      return res.status(404).json({ error: 'User to remove not found.' });
    }

    // Check permissions
    const isCreator = community.creator.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!(isCreator || isAdmin)) {
      return res.status(403).json({ error: 'Only creator or admin can remove members.' });
    }

    if (!community.members.includes(userId)) {
      return res.status(400).json({ error: 'User is not a member of this community.' });
    }

    // Prevent creator from being removed by others unless it's the creator themselves
    if (community.creator.equals(userId) && !req.user._id.equals(userId)) {
      return res.status(403).json({ error: 'Only the creator can remove themselves from the community.' });
    }

    community.members = community.members.filter(memberId => !memberId.equals(userId));
    await community.save();

    adminController.logAdminAction(
      req.user._id,
      'community_management',
      `Removed user ${userToRemove.email} from community ${community.name}`,
      { communityId: community._id, userId: userToRemove._id }
    );

    res.json({ message: 'Member removed successfully.', community });
  } catch (error) {
    console.error('Error removing community member:', error);
    res.status(500).json({ error: 'Failed to remove member.' });
  }
}; 