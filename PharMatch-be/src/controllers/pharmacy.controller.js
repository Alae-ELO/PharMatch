const Pharmacy = require('../models/pharmacy.model');
const Medication = require('../models/medication.model');

// @desc    Get all pharmacies
// @route   GET /api/pharmacies
// @access  Public
exports.getPharmacies = async (req, res, next) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Handle search query
    let query = {};
    if (req.query.search) {
      query = { $text: { $search: req.query.search } };
    }

    // Handle city filter
    if (req.query.city) {
      query.city = req.query.city;
    }

    const options = {
      page,
      limit,
      sort: { name: 1 }
    };

    const result = await Pharmacy.paginate(query, options);

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
      data: result.docs.map(pharmacy => ({
        id: pharmacy._id,
        name: pharmacy.name,
        address: pharmacy.address,
        city: pharmacy.city,
        phone: pharmacy.phone,
        email: pharmacy.email,
        hours: pharmacy.hours,
        coordinates: pharmacy.coordinates
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pharmacy
// @route   GET /api/pharmacies/:id
// @access  Public
exports.getPharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    // Get medications available at this pharmacy
    const medications = await Medication.find({
      'pharmacies.pharmacy': pharmacy._id
    });

    res.status(200).json({
      success: true,
      data: {
        id: pharmacy._id,
        name: pharmacy.name,
        address: pharmacy.address,
        city: pharmacy.city,
        phone: pharmacy.phone,
        email: pharmacy.email,
        hours: pharmacy.hours,
        coordinates: pharmacy.coordinates,
        owner: pharmacy.owner,
        medications: medications.map(med => ({
          id: med._id,
          name: med.name,
          inStock: med.pharmacies.find(p => p.pharmacy.toString() === pharmacy._id.toString()).inStock,
          price: med.pharmacies.find(p => p.pharmacy.toString() === pharmacy._id.toString()).price
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pharmacy
// @route   POST /api/pharmacies
// @access  Private/Pharmacy/Admin
exports.createPharmacy = async (req, res, next) => {
  try {
    // Add owner field from authenticated user
    req.body.owner = req.user.id;

    // Check if user already has a pharmacy
    if (req.user.role === 'pharmacy') {
      const existingPharmacy = await Pharmacy.findOne({ owner: req.user.id });

      if (existingPharmacy) {
        return res.status(400).json({
          success: false,
          message: 'This user already has a registered pharmacy'
        });
      }
    }

    const pharmacy = await Pharmacy.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        id: pharmacy._id,
        name: pharmacy.name,
        address: pharmacy.address,
        city: pharmacy.city,
        phone: pharmacy.phone,
        email: pharmacy.email,
        hours: pharmacy.hours,
        coordinates: pharmacy.coordinates
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pharmacy
// @route   PUT /api/pharmacies/:id
// @access  Private/Pharmacy/Admin
exports.updatePharmacy = async (req, res, next) => {
  try {
    let pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    // Make sure user is pharmacy owner or admin
    if (pharmacy.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this pharmacy'
      });
    }

    // Don't allow owner to be changed
    if (req.body.owner) {
      delete req.body.owner;
    }

    pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: {
        id: pharmacy._id,
        name: pharmacy.name,
        address: pharmacy.address,
        city: pharmacy.city,
        phone: pharmacy.phone,
        email: pharmacy.email,
        hours: pharmacy.hours,
        coordinates: pharmacy.coordinates
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pharmacy
// @route   DELETE /api/pharmacies/:id
// @access  Private/Pharmacy/Admin
exports.deletePharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    // Make sure user is pharmacy owner or admin
    if (pharmacy.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this pharmacy'
      });
    }

    // Remove pharmacy from all medications
    await Medication.updateMany(
      { 'pharmacies.pharmacy': pharmacy._id },
      { $pull: { pharmacies: { pharmacy: pharmacy._id } } }
    );

    await pharmacy.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pharmacies by location
// @route   GET /api/pharmacies/location/:lat/:lng/:distance
// @access  Public
exports.getPharmaciesByLocation = async (req, res, next) => {
  try {
    const { lat, lng, distance } = req.params;

    // Convert distance to number
    const radius = parseInt(distance, 10) || 10; // Default 10km

    // Simple distance calculation (this is a simplified approach)
    // In a real app, you might use MongoDB's geospatial queries
    const pharmacies = await Pharmacy.find();
    
    // Filter pharmacies by distance
    const filteredPharmacies = pharmacies.filter(pharmacy => {
      const latDiff = Math.abs(pharmacy.coordinates.lat - parseFloat(lat));
      const lngDiff = Math.abs(pharmacy.coordinates.lng - parseFloat(lng));
      
      // Rough approximation: 0.01 in coordinates is about 1km
      const approxDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 100;
      
      return approxDistance <= radius;
    });

    res.status(200).json({
      success: true,
      count: filteredPharmacies.length,
      data: filteredPharmacies.map(pharmacy => ({
        id: pharmacy._id,
        name: pharmacy.name,
        address: pharmacy.address,
        city: pharmacy.city,
        coordinates: pharmacy.coordinates,
        distance: Math.sqrt(
          Math.pow(pharmacy.coordinates.lat - parseFloat(lat), 2) + 
          Math.pow(pharmacy.coordinates.lng - parseFloat(lng), 2)
        ) * 100 // Approximate distance in km
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pharmacies by medication
// @route   GET /api/pharmacies/medication/:medicationId
// @access  Public
exports.getPharmaciesByMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findById(req.params.medicationId)
      .populate('pharmacies.pharmacy');

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Extract pharmacies that have this medication in stock
    const pharmaciesWithMedication = medication.pharmacies
      .filter(p => p.inStock)
      .map(p => ({
        id: p.pharmacy._id,
        name: p.pharmacy.name,
        address: p.pharmacy.address,
        city: p.pharmacy.city,
        phone: p.pharmacy.phone,
        price: p.price
      }));

    res.status(200).json({
      success: true,
      count: pharmaciesWithMedication.length,
      data: pharmaciesWithMedication
    });
  } catch (error) {
    next(error);
  }
};