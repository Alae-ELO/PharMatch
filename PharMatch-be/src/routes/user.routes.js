const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// Import controllers
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserBloodDonorInfo,
  updateBloodDonorInfo
} = require('../controllers/user.controller');

// Routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

// Blood donor routes
router.get('/:id/blood-donor', protect, getUserBloodDonorInfo);
router.put('/:id/blood-donor', protect, updateBloodDonorInfo);

module.exports = router;