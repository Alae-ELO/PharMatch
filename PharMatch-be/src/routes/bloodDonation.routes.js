const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// Import controllers
const {
  getBloodDonationRequests,
  getBloodDonationRequest,
  createBloodDonationRequest,
  updateBloodDonationRequest,
  deleteBloodDonationRequest,
  respondToBloodDonationRequest,
  getBloodDonationRequestsByBloodType
} = require('../controllers/bloodDonation.controller');

// Routes
router.route('/')
  .get(getBloodDonationRequests)
  .post(protect, createBloodDonationRequest);

router.route('/:id')
  .get(getBloodDonationRequest)
  .put(protect, updateBloodDonationRequest)
  .delete(protect, deleteBloodDonationRequest);

// Special routes
router.get('/bloodtype/:bloodType', getBloodDonationRequestsByBloodType);
router.post('/:id/respond', protect, respondToBloodDonationRequest);

module.exports = router;