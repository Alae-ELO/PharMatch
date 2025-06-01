const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
  updateMedicationStock,
  getMedicationPharmacies
} = require('../controllers/medication.controller');

// Public routes
router.get('/', getMedications);
router.get('/:id', getMedication);
router.get('/:id/pharmacies', getMedicationPharmacies);

// Protected routes
router.use(protect);

// Pharmacy routes
router.put('/:id/stock', authorize('pharmacy'), updateMedicationStock);

// Admin routes
router.post('/', authorize('admin'), createMedication);
router.put('/:id', authorize('admin'), updateMedication);
router.delete('/:id', authorize('admin'), deleteMedication);

module.exports = router;