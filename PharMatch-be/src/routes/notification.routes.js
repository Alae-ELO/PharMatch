const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Import controllers
const {
  getNotifications,
  getNotification,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications
} = require('../controllers/notification.controller');

// Routes
router.route('/')
  .get(protect, getNotifications)
  .delete(protect, deleteAllNotifications);

router.route('/:id')
  .get(protect, getNotification)
  .put(protect, markNotificationAsRead)
  .delete(protect, deleteNotification);

module.exports = router;