const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// Import controllers
const {
  getPharmacies,    
  getPharmacy,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  getPharmaciesByLocation,
  searchPharmacies
} = require('../controllers/pharmacy.controller');

// Routes
router.get('/', getPharmacies);
router.get('/location', getPharmaciesByLocation);
router.get('/search', searchPharmacies);

// Create pharmacy route
router.post('/', protect, authorize('admin', 'pharmacy'), createPharmacy);

router.route('/:id')
  .get(getPharmacy)
  .put(protect, authorize('admin', 'pharmacy'), updatePharmacy)
  .delete(protect, authorize('admin', 'pharmacy'), deletePharmacy);

module.exports = router;