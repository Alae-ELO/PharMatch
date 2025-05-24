const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// Import controllers
const {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
  getMedicationsByPharmacy,
  updateMedicationStock
} = require('../controllers/medication.controller');

// Routes
router.route('/')
  .get(getMedications)
  .post(protect, authorize('pharmacy', 'admin'), createMedication);

router.route('/:id')
  .get(getMedication)
  .put(protect, authorize('pharmacy', 'admin'), updateMedication)
  .delete(protect, authorize('pharmacy', 'admin'), deleteMedication);

// Special routes
router.get('/pharmacy/:pharmacyId', getMedicationsByPharmacy);
router.put('/:id/stock', protect, authorize('pharmacy', 'admin'), updateMedicationStock);

module.exports = router;