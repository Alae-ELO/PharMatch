const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

const {
  getPharmacies,
  getPharmacy,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  getPharmaciesByLocation,
  getPharmaciesByMedication
} = require('../controllers/pharmacy.controller');

router.route('/')
  .get(getPharmacies)
  .post(protect, authorize('pharmacy', 'admin'), createPharmacy);

router.get('/location/:lat/:lng/:distance', getPharmaciesByLocation);
router.get('/medication/:medicationId', getPharmaciesByMedication);

router.route('/:id')
  .get(getPharmacy)
  .put(protect, authorize('pharmacy', 'admin'), updatePharmacy)
  .delete(protect, authorize('pharmacy', 'admin'), deletePharmacy);

module.exports = router;
