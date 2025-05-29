// controllers/notificationController.js
const Notification = require('../models/notificationModel');
const { Op } = require('sequelize');
const { get } = require('../routes/notificationRoute');

const createClosedNotification = async (req, res) => {
  try {
    const {notify_type,notify_date, description } = req.body;
    console.log("BODY:", req.body);
    const notification = await Notification.create({ notify_type,notify_date, description });
        res.status(201).json(notification);
    console.log("Notification created:", notification); 
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

const createFullBookingNotification = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if a 'full' notification already exists for today
    const existing = await Notification.findOne({
      where: {
        notify_type: 'full',
        notify_date: today,
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'Full booking notification already exists for today.' });
    }

    const description = "Thank you for your interest in dining with us! Unfortunately, all our reservation slots are fully booked at the moment. We apologize for any inconvenience and look forward to welcoming you on another day. Please check back soon or contact us for future availability.";

    const notification = await Notification.create({
      notify_type: 'full',
      notify_date: today,
      description,
    });

    console.log("Full booking notification created:", notification);
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating full booking notification:", {
      message: error.message,
      stack: error.stack,
      errors: error.errors || [], // Include Sequelize validation errors if any
    });
    res.status(500).json({
      error: 'Failed to create full booking notification',
      details: error.message,
    });
  }
};

const getFullBookingNotification = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const notification = await Notification.findOne({
      where: {
        notify_type: 'full',
        notify_date: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      attributes: ['id', 'notify_date', 'notify_type', 'description'],
    });

    if (!notification) {
      return res.status(404).json({ message: 'No full booking notification found for today.' });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error('Error fetching full booking notification:', error);
    res.status(500).json({ error: 'Failed to fetch full booking notification' });
  }
};



const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { notify_type, notify_date, description } = req.body;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.notify_type = notify_type || notification.notify_type;
    notification.notify_date = notify_date || notification.notify_date;
    notification.description = description || notification.description;

    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
}

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const getCurrentCloseNotifications = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const notifications = await Notification.findOne({
      where: {
        notify_date: {
          [Op.gte]: today, // Fetch notifications from today onwards
        },
        notify_type: 'closed', // Only fetch closed notifications
      },
      order: [['notify_date', 'DESC']], // Order by notify_date ascending
      attributes: ['id', 'notify_date', 'notify_type', 'description'],  
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.destroy({ where: { id } });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

module.exports = {
  createClosedNotification,
  updateNotification,
  getAllNotifications,
  getCurrentCloseNotifications,
  deleteNotification,
  createFullBookingNotification,
  getFullBookingNotification,
};
