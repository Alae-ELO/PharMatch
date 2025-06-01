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

router.route('/:id')
  .get(getPharmacy)
  .post(protect, authorize('pharmacy'),createPharmacy)
  .put(protect, authorize('pharmacy'), updatePharmacy)
  .delete(protect, authorize('pharmacy'), deletePharmacy);


module.exports = router;