const ContactMessage = require('../models/ContactMessage');

// Submit a new contact message
exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    res.status(201).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
};

// Admin - Get all contact messages
exports.getContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, isRead, replied } = req.query;
    const query = {};

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }
    if (replied !== undefined) {
      query.replied = replied === 'true';
    }

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ContactMessage.countDocuments(query);

    res.json({
      messages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalMessages: total,
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages.' });
  }
};

// Admin - Mark a message as read
exports.markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;
    const message = await ContactMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    message.isRead = true;
    await message.save();

    // Log the admin action
    const adminController = require('./adminController');
    await adminController.logAdminAction(
      req.user._id,
      'content_moderation',
      `Marked contact message ${messageId} as read`,
      { messageId, actionType: 'mark_as_read' }
    );

    res.json({ message: 'Message marked as read.', message });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read.' });
  }
};

// Admin - Mark a message as replied
exports.markMessageAsReplied = async (req, res) => {
  try {
    const messageId = req.params.id;
    const message = await ContactMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    message.replied = true;
    await message.save();

    // Log the admin action
    const adminController = require('./adminController');
    await adminController.logAdminAction(
      req.user._id,
      'content_moderation',
      `Marked contact message ${messageId} as replied`,
      { messageId, actionType: 'mark_as_replied' }
    );

    res.json({ message: 'Message marked as replied.', message });
  } catch (error) {
    console.error('Error marking message as replied:', error);
    res.status(500).json({ error: 'Failed to mark message as replied.' });
  }
};

// Admin - Delete a contact message
exports.deleteContactMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const message = await ContactMessage.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    // Log the admin action
    const adminController = require('./adminController');
    await adminController.logAdminAction(
      req.user._id,
      'content_moderation',
      `Deleted contact message ${messageId}`,
      { messageId, actionType: 'delete_message' }
    );

    res.json({ message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Failed to delete message.' });
  }
}; 