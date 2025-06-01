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
  getPharmaciesByMedication,
  getPharmaciesByLocation,
  searchPharmacies
} = require('../controllers/pharmacy.controller');

// Routes
router.get('/', getPharmacies);
router.get('/location', getPharmaciesByLocation);
router.get('/search', searchPharmacies);
router.get('/:id', getPharmacy);

router.route('/:id')
  .get(getPharmacy)
  .post(protect, authorize('pharmacy'),createPharmacy)
  .put(protect, authorize('pharmacy'), updatePharmacy)
  .delete(protect, authorize('pharmacy'), deletePharmacy);

// Special routes
router.get('/medication/:medicationId', getPharmaciesByMedication);

module.exports = router;