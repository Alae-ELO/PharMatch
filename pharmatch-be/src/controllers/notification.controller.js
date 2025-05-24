const Notification = require('../models/notification.model');

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Get notifications for the logged in user
    const options = {
      page,
      limit,
      sort: { createdAt: -1 } // Sort by date (newest first)
    };

    // Filter by read status if provided
    let query = { user: req.user.id };
    if (req.query.read !== undefined) {
      query.read = req.query.read === 'true';
    }

    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }

    const result = await Notification.paginate(query, options);

    res.status(200).json({
      success: true,
      count: result.totalDocs,
      unreadCount: await Notification.countDocuments({ user: req.user.id, read: false }),
      pagination: {
        total: result.totalDocs,
        pages: result.totalPages,
        page: result.page,
        limit: result.limit,
        hasNext: result.hasNextPage,
        hasPrev: result.hasPrevPage
      },
      data: result.docs.map(notification => ({
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        createdAt: notification.createdAt,
        relatedItem: notification.relatedItem
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
exports.getNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Make sure notification belongs to user
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this notification'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        createdAt: notification.createdAt,
        relatedItem: notification.relatedItem
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Make sure notification belongs to user
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }

    notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        createdAt: notification.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Make sure notification belongs to user
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all notifications for a user
// @route   DELETE /api/notifications
// @access  Private
exports.deleteAllNotifications = async (req, res, next) => {
  try {
    // Delete all notifications for this user
    await Notification.deleteMany({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {},
      message: 'All notifications deleted'
    });
  } catch (error) {
    next(error);
  }
};