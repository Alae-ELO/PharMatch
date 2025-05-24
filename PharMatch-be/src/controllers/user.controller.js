const User = require('../models/user.model');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodDonor: user.bloodDonor,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is authorized to view this profile
    // Users can view their own profile, admins can view any profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this user profile'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodDonor: user.bloodDonor,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is authorized to update this profile
    // Users can update their own profile, admins can update any profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user profile'
      });
    }

    // Fields to update
    const fieldsToUpdate = {};
    
    // Only allow certain fields to be updated
    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.email) fieldsToUpdate.email = req.body.email;
    
    // Only admin can update role
    if (req.body.role && req.user.role === 'admin') {
      fieldsToUpdate.role = req.body.role;
    }

    user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodDonor: user.bloodDonor
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user blood donor info
// @route   GET /api/users/:id/blood-donor
// @access  Private
exports.getUserBloodDonorInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is authorized to view this blood donor info
    // Users can view their own info, admins can view any info
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this blood donor information'
      });
    }

    if (!user.bloodDonor) {
      return res.status(404).json({
        success: false,
        message: 'Blood donor information not found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: user.bloodDonor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user blood donor info
// @route   PUT /api/users/:id/blood-donor
// @access  Private
exports.updateBloodDonorInfo = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is authorized to update this blood donor info
    // Users can update their own info, admins can update any info
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blood donor information'
      });
    }

    // Update blood donor info
    const bloodDonorInfo = {
      bloodType: req.body.bloodType,
      lastDonation: req.body.lastDonation,
      eligibleToDonateSince: req.body.eligibleToDonateSince
    };

    user = await User.findByIdAndUpdate(
      req.params.id,
      { bloodDonor: bloodDonorInfo },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user.bloodDonor
    });
  } catch (error) {
    next(error);
  }
};