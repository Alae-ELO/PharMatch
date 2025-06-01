const Medication = require('../models/medication.model');
const Pharmacy = require('../models/pharmacy.model');

// @desc    Get all medications
// @route   GET /api/medications
// @access  Public
exports.getMedications = async (req, res, next) => {
  try {

    // Build query
    let query = {};

    // Handle search query
    if (req.query.search) {
      query.$or = [
        { 'name.en': { $regex: req.query.search, $options: 'i' } },
        { 'name.ar': { $regex: req.query.search, $options: 'i' } },
        { 'name.fr': { $regex: req.query.search, $options: 'i' } },
        { 'description.en': { $regex: req.query.search, $options: 'i' } },
        { 'description.ar': { $regex: req.query.search, $options: 'i' } },
        { 'description.fr': { $regex: req.query.search, $options: 'i' } },
        { 'category.en': { $regex: req.query.search, $options: 'i' } },
        { 'category.ar': { $regex: req.query.search, $options: 'i' } },
        { 'category.fr': { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Handle category filter
    if (req.query.category) {
      query.$or = [
        { 'category.en': req.query.category },
        { 'category.ar': req.query.category },
        { 'category.fr': req.query.category }
      ];
    }

    // Handle prescription filter
    if (req.query.prescription !== undefined) {
      query.prescription = req.query.prescription === 'true';
    }

    // Handle location-based filtering
    let nearbyPharmacies = [];
    if (req.query.latitude && req.query.longitude) {
      const lat = parseFloat(req.query.latitude);
      const lng = parseFloat(req.query.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid latitude or longitude values'
        });
      }

      nearbyPharmacies = await Pharmacy.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat]
            },
            $maxDistance: 50000 // 50 km radius
          }
        }
      });

      if (nearbyPharmacies.length > 0) {
        query['pharmacies.pharmacy'] = {
          $in: nearbyPharmacies.map(p => p._id)
        };
      }
    }

    const options = {
      sort: { 'name.en': 1 }
    };

    try {

      // Transform the data to include pharmacy details
      const transformedData = await Promise.all(result.docs.map(async (medication) => {
        const pharmacyDetails = await Promise.all(
          medication.pharmacies.map(async (p) => {
            const pharmacy = await Pharmacy.findById(p.pharmacy);
            return {
              id: p.pharmacy,
              name: pharmacy ? {
                en: pharmacy.name,
                ar: pharmacy.name_ar
              } : null,
              inStock: p.inStock,
              price: p.price || 0,
              coordinates: pharmacy ? pharmacy.coordinates : null
            };
          })
        );

        return {
          id: medication._id,
          name: medication.name,
          description: medication.description,
          category: medication.category,
          prescription: medication.prescription,
          image_url: medication.image_url,
          pharmacies: pharmacyDetails
        };
      }));

      res.status(200).json({
        success: true,
        count: result.totalDocs,
        data: transformedData
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
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
    const pharmacyDetails = await Promise.all(
      medication.pharmacies.map(async (p) => {
        const pharmacy = await Pharmacy.findById(p.pharmacy);
        return {
          id: p.pharmacy,
          name: pharmacy ? {
            en: pharmacy.name,
            ar: pharmacy.name_ar
          } : null,
          inStock: p.inStock,
          price: p.price || 0,
          coordinates: pharmacy ? pharmacy.coordinates : null
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        id: medication._id,
        name: medication.name,
        description: medication.description,
        category: medication.category,
        prescription: medication.prescription,
        image_url: medication.image_url,
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
    const medication = await Medication.create(req.body);

    res.status(201).json({
      success: true,
      data: medication
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private/Pharmacy/Admin
exports.updateMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
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

    await medication.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
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

    const pharmacy = await Pharmacy.findOne({ owner: req.user.id });
    
    if (!pharmacy) {
      return res.status(400).json({
        success: false,
        message: 'You must have a registered pharmacy to update stock'
      });
    }

    // Validate price if provided
    if (req.body.price !== undefined) {
      const price = parseFloat(req.body.price);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a non-negative number'
        });
      }
    }

    const pharmacyIndex = medication.pharmacies.findIndex(
      p => p.pharmacy.toString() === pharmacy._id.toString()
    );

    if (pharmacyIndex === -1) {
      medication.pharmacies.push({
        pharmacy: pharmacy._id,
        inStock: req.body.inStock,
        price: req.body.price || 0
      });
    } else {
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

// @desc    Get pharmacies for a specific medication
// @route   GET /api/medications/:id/pharmacies
// @access  Public
exports.getMedicationPharmacies = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id)
      .select('pharmacies')
      .populate({
        path: 'pharmacies.pharmacy',
        select: 'name name_ar region region_ar phone coordinates',
        model: 'Pharmacy'
      });

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Filter pharmacies that have the medication in stock
    const availablePharmacies = medication.pharmacies
      .filter(pharm => pharm.inStock)
      .map(pharm => ({
        ...pharm.pharmacy.toObject(),
        price: pharm.price || 0
      }));

    res.status(200).json({
      success: true,
      count: availablePharmacies.length,
      data: availablePharmacies
    });
  } catch (error) {
    console.error('Error fetching pharmacies for medication:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pharmacies for medication'
    });
  }
};