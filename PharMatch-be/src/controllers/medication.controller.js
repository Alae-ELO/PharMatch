const Medication = require('../models/medication.model');
const Pharmacy = require('../models/pharmacy.model');

// @desc    Get all medications
// @route   GET /api/medications
// @access  Public
exports.getMedications = async (req, res, next) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Handle search query
    let query = {};
    if (req.query.search) {
      query = { $text: { $search: req.query.search } };
    }

    // Handle category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Handle prescription filter
    if (req.query.prescription) {
      query.prescription = req.query.prescription === 'true';
    }

    const options = {
      page,
      limit,
      sort: { name: 1 }
    };

    const result = await Medication.paginate(query, options);

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
      data: result.docs.map(medication => ({
        id: medication._id,
        name: medication.name,
        description: medication.description,
        category: medication.category,
        prescription: medication.prescription,
        pharmacies: medication.pharmacies.map(p => ({
          id: p.pharmacy,
          inStock: p.inStock,
          price: p.price
        }))
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single medication
// @route   GET /api/medications/:id
// @access  Public
exports.getMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Get pharmacy details for this medication
    const pharmacyIds = medication.pharmacies.map(p => p.pharmacy);
    const pharmacies = await Pharmacy.find({ _id: { $in: pharmacyIds } });

    const pharmacyDetails = medication.pharmacies.map(p => {
      const pharmacyInfo = pharmacies.find(ph => ph._id.toString() === p.pharmacy.toString());
      return {
        id: p.pharmacy,
        name: pharmacyInfo ? pharmacyInfo.name : 'Unknown',
        inStock: p.inStock,
        price: p.price
      };
    });

    res.status(200).json({
      success: true,
      data: {
        id: medication._id,
        name: medication.name,
        description: medication.description,
        category: medication.category,
        prescription: medication.prescription,
        pharmacies: pharmacyDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new medication
// @route   POST /api/medications
// @access  Private/Pharmacy/Admin
exports.createMedication = async (req, res, next) => {
  try {
    // If user is a pharmacy, add their pharmacy to the medication's pharmacies
    if (req.user.role === 'pharmacy') {
      const pharmacy = await Pharmacy.findOne({ owner: req.user.id });
      
      if (!pharmacy) {
        return res.status(400).json({
          success: false,
          message: 'You must have a registered pharmacy to add medications'
        });
      }

      // Check if pharmacies array exists in request body
      if (!req.body.pharmacies) {
        req.body.pharmacies = [];
      }

      // Add this pharmacy to the medication's pharmacies
      req.body.pharmacies.push({
        pharmacy: pharmacy._id,
        inStock: true,
        price: req.body.price || 0
      });
    }

    const medication = await Medication.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        id: medication._id,
        name: medication.name,
        description: medication.description,
        category: medication.category,
        prescription: medication.prescription,
        pharmacies: medication.pharmacies
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private/Pharmacy/Admin
exports.updateMedication = async (req, res, next) => {
  try {
    let medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // If user is a pharmacy, make sure they have this medication in their inventory
    if (req.user.role === 'pharmacy') {
      const pharmacy = await Pharmacy.findOne({ owner: req.user.id });
      
      if (!pharmacy) {
        return res.status(400).json({
          success: false,
          message: 'You must have a registered pharmacy to update medications'
        });
      }

      const hasAccess = medication.pharmacies.some(
        p => p.pharmacy.toString() === pharmacy._id.toString()
      );

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this medication'
        });
      }

      // Don't allow pharmacy to update other pharmacies' data
      if (req.body.pharmacies) {
        delete req.body.pharmacies;
      }
    }

    medication = await Medication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: {
        id: medication._id,
        name: medication.name,
        description: medication.description,
        category: medication.category,
        prescription: medication.prescription,
        pharmacies: medication.pharmacies
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete medication
// @route   DELETE /api/medications/:id
// @access  Private/Admin
exports.deleteMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Only admin can delete medications entirely
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete medications'
      });
    }

    await medication.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get medications by pharmacy
// @route   GET /api/medications/pharmacy/:pharmacyId
// @access  Public
exports.getMedicationsByPharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.pharmacyId);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    const medications = await Medication.find({
      'pharmacies.pharmacy': pharmacy._id
    });

    res.status(200).json({
      success: true,
      count: medications.length,
      data: medications.map(med => {
        const pharmacyInfo = med.pharmacies.find(
          p => p.pharmacy.toString() === pharmacy._id.toString()
        );
        
        return {
          id: med._id,
          name: med.name,
          description: med.description,
          category: med.category,
          prescription: med.prescription,
          inStock: pharmacyInfo ? pharmacyInfo.inStock : false,
          price: pharmacyInfo ? pharmacyInfo.price : null
        };
      })
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medication stock for a pharmacy
// @route   PUT /api/medications/:id/stock
// @access  Private/Pharmacy
exports.updateMedicationStock = async (req, res, next) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Get pharmacy owned by this user
    const pharmacy = await Pharmacy.findOne({ owner: req.user.id });
    
    if (!pharmacy) {
      return res.status(400).json({
        success: false,
        message: 'You must have a registered pharmacy to update stock'
      });
    }

    // Find if this pharmacy is already in the medication's pharmacies
    const pharmacyIndex = medication.pharmacies.findIndex(
      p => p.pharmacy.toString() === pharmacy._id.toString()
    );

    if (pharmacyIndex === -1) {
      // If not found, add this pharmacy to the medication's pharmacies
      medication.pharmacies.push({
        pharmacy: pharmacy._id,
        inStock: req.body.inStock,
        price: req.body.price || 0
      });
    } else {
      // Update existing pharmacy stock info
      medication.pharmacies[pharmacyIndex].inStock = req.body.inStock;
      if (req.body.price !== undefined) {
        medication.pharmacies[pharmacyIndex].price = req.body.price;
      }
    }

    await medication.save();

    res.status(200).json({
      success: true,
      data: {
        id: medication._id,
        name: medication.name,
        inStock: req.body.inStock,
        price: req.body.price
      }
    });
  } catch (error) {
    next(error);
  }
};