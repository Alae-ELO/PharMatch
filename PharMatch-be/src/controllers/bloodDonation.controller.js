const BloodDonation = require('../models/bloodDonation.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

// @desc    Get all blood donation requests
// @route   GET /api/blood-donation
// @access  Public
exports.getBloodDonationRequests = async (req, res, next) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Handle filters
    let query = { status: 'active' }; // Default to only active requests

    // Filter by blood type
    if (req.query.bloodType) {
      query.bloodType = req.query.bloodType;
    }

    // Filter by urgency
    if (req.query.urgency) {
      query.urgency = req.query.urgency;
    }

    // Filter by hospital
    if (req.query.hospital) {
      query.hospital = { $regex: req.query.hospital, $options: 'i' };
    }

    const options = {
      page,
      limit,
      sort: { urgency: -1, createdAt: -1 } // Sort by urgency (high first) then by date
    };

    const result = await BloodDonation.paginate(query, options);

    res.status(200).json({
      success: true,
      count: result.totalDocs,
      pagination: {
        total: result.totalDocs,
        pages: result.totalPages,
        page: result.page,
        limit: result.limit,
        hasNext: result.hasNextPage,
        hasPrev: result.hasPrevPage
      },
      data: result.docs.map(request => ({
        id: request._id,
        bloodType: request.bloodType,
        hospital: request.hospital,
        urgency: request.urgency,
        contactInfo: request.contactInfo,
        createdAt: request.createdAt,
        expiresAt: request.expiresAt,
        status: request.status
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blood donation request
// @route   GET /api/blood-donation/:id
// @access  Public
exports.getBloodDonationRequest = async (req, res, next) => {
  try {
    const request = await BloodDonation.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood donation request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: request._id,
        bloodType: request.bloodType,
        hospital: request.hospital,
        urgency: request.urgency,
        contactInfo: request.contactInfo,
        createdAt: request.createdAt,
        expiresAt: request.expiresAt,
        status: request.status,
        donors: request.donors,
        createdBy: request.createdBy
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blood donation request
// @route   POST /api/blood-donation
// @access  Private
exports.createBloodDonationRequest = async (req, res, next) => {
  try {
    // Add user id to request body
    req.body.createdBy = req.user.id;

    // Set expiration date (default to 7 days from now if not provided)
    if (!req.body.expiresAt) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      req.body.expiresAt = expiresAt;
    }

    const request = await BloodDonation.create(req.body);

    // Find users who are blood donors with matching blood type
    // and send them notifications
    const compatibleDonors = await User.find({
      'bloodDonor.bloodType': request.bloodType,
      'bloodDonor.eligibleToDonateSince': { $lte: new Date() }
    });

    // Create notifications for compatible donors
    const notifications = compatibleDonors.map(donor => ({
      type: 'blood',
      title: `Urgent ${request.bloodType} Blood Needed`,
      message: `${request.hospital} needs ${request.bloodType} blood donation. Urgency: ${request.urgency}`,
      user: donor._id,
      relatedItem: {
        itemId: request._id,
        itemType: 'BloodDonation'
      },
      expiresAt: request.expiresAt
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      data: {
        id: request._id,
        bloodType: request.bloodType,
        hospital: request.hospital,
        urgency: request.urgency,
        contactInfo: request.contactInfo,
        createdAt: request.createdAt,
        expiresAt: request.expiresAt,
        status: request.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blood donation request
// @route   PUT /api/blood-donation/:id
// @access  Private
exports.updateBloodDonationRequest = async (req, res, next) => {
  try {
    let request = await BloodDonation.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood donation request not found'
      });
    }

    // Make sure user is the creator of the request or an admin
    if (request.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    // Don't allow createdBy to be changed
    if (req.body.createdBy) {
      delete req.body.createdBy;
    }

    request = await BloodDonation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: {
        id: request._id,
        bloodType: request.bloodType,
        hospital: request.hospital,
        urgency: request.urgency,
        contactInfo: request.contactInfo,
        createdAt: request.createdAt,
        expiresAt: request.expiresAt,
        status: request.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blood donation request
// @route   DELETE /api/blood-donation/:id
// @access  Private
exports.deleteBloodDonationRequest = async (req, res, next) => {
  try {
    const request = await BloodDonation.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood donation request not found'
      });
    }

    // Make sure user is the creator of the request or an admin
    if (request.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    // Delete related notifications
    await Notification.deleteMany({
      'relatedItem.itemId': request._id,
      'relatedItem.itemType': 'BloodDonation'
    });

    await request.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blood donation requests by blood type
// @route   GET /api/blood-donation/bloodtype/:bloodType
// @access  Public
exports.getBloodDonationRequestsByBloodType = async (req, res, next) => {
  try {
    const bloodType = req.params.bloodType;
    
    // Validate blood type
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(bloodType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blood type'
      });
    }

    // Find active requests for this blood type
    const requests = await BloodDonation.find({
      bloodType,
      status: 'active',
      expiresAt: { $gt: new Date() }
    }).sort({ urgency: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests.map(request => ({
        id: request._id,
        bloodType: request.bloodType,
        hospital: request.hospital,
        urgency: request.urgency,
        contactInfo: request.contactInfo,
        createdAt: request.createdAt,
        expiresAt: request.expiresAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to blood donation request
// @route   POST /api/blood-donation/:id/respond
// @access  Private
exports.respondToBloodDonationRequest = async (req, res, next) => {
  try {
    const request = await BloodDonation.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood donation request not found'
      });
    }

    // Check if request is still active
    if (request.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `This request is ${request.status} and no longer accepting donors`
      });
    }

    // Check if user is already a donor for this request
    const alreadyDonor = request.donors.some(
      donor => donor.user.toString() === req.user.id
    );

    if (alreadyDonor) {
      return res.status(400).json({
        success: false,
        message: 'You have already responded to this request'
      });
    }

    // Get user to check blood type
    const user = await User.findById(req.user.id);

    // Check if user is a blood donor with compatible blood type
    if (!user.bloodDonor || user.bloodDonor.bloodType !== request.bloodType) {
      return res.status(400).json({
        success: false,
        message: 'Your blood type does not match the requested type'
      });
    }

    // Add user as a donor
    request.donors.push({
      user: req.user.id,
      status: 'pending',
      donationDate: req.body.donationDate || new Date()
    });

    // If this is the first donor and the request is high urgency, mark as fulfilled
    if (request.donors.length === 1 && request.urgency === 'high') {
      request.status = 'fulfilled';
    }

    await request.save();

    // Create notification for the request creator
    await Notification.create({
      type: 'blood',
      title: 'Donor Found',
      message: `A donor has responded to your ${request.bloodType} blood request for ${request.hospital}`,
      user: request.createdBy,
      relatedItem: {
        itemId: request._id,
        itemType: 'BloodDonation'
      },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    res.status(200).json({
      success: true,
      data: {
        id: request._id,
        status: request.status,
        message: 'You have successfully responded to this blood donation request'
      }
    });
  } catch (error) {
    next(error);
  }
};