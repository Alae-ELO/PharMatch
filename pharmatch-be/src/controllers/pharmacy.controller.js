const Pharmacy = require('../models/pharmacy.model');
const Medication = require('../models/medication.model');

// @desc    Get all pharmacies
// @route   GET /api/pharmacies
// @access  Public
exports.getPharmacies = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
  
      let query = {};
  
      if (req.query.search) {
        query.$text = { $search: req.query.search };
      }
  
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
        data: result.docs
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

// @desc    Get pharmacies by location
// @route   GET /api/pharmacies/location
// @access  Public
exports.getPharmaciesByLocation = async (req, res, next) => {
    try {
      const { latitude, longitude } = req.query;
  
      if (!latitude || !longitude) {
        return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
      }

      // Convert coordinates to numbers
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
  
      // First try to find pharmacies using the 2dsphere index
      let pharmacies = await Pharmacy.find({
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

      // If no results found with location field, try coordinates field
      if (pharmacies.length === 0) {
        pharmacies = await Pharmacy.find({
          'coordinates.lat': { $exists: true },
          'coordinates.lng': { $exists: true },
          $expr: {
            $and: [
              { $gte: ['$coordinates.lat', lat - 0.5] },
              { $lte: ['$coordinates.lat', lat + 0.5] },
              { $gte: ['$coordinates.lng', lng - 0.5] },
              { $lte: ['$coordinates.lng', lng + 0.5] }
            ]
          }
        });
      }
  
      console.log('Found pharmacies:', pharmacies.length); // Debug log
  
      res.status(200).json({
        success: true,
        count: pharmacies.length,
        data: pharmacies
      });
    } catch (error) {
      console.error('Error in getPharmaciesByLocation:', error); // Debug log
      next(error);
    }
  };
  
  


// @desc    Search pharmacies by city or region
// @route   GET /api/pharmacies/search
// @access  Public
exports.searchPharmacies = async (req, res, next) => {
    try {
      const { city, region } = req.query;
  
      const query = {};
      if (city) query.city = new RegExp(city, 'i');
      if (region) query.region = new RegExp(region, 'i');
  
      const pharmacies = await Pharmacy.find(query);
  
      res.status(200).json({
        success: true,
        count: pharmacies.length,
        data: pharmacies
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

    // If user is a pharmacy owner, first get all pharmacies and check ownership
    if (req.user.role === 'pharmacy') {
      // Get all pharmacies in the database
      const allPharmacies = await Pharmacy.find({});
      
      // Check if user already owns any pharmacies
      const userPharmacies = await Pharmacy.find({ owner: req.user.id });
      
      if (userPharmacies.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'You already own pharmacies. Please select from your existing pharmacies.',
          data: userPharmacies
        });
      }

      // Check if selected pharmacy already has an owner
      if (req.body.selectedPharmacyId) {
        const selectedPharmacy = await Pharmacy.findById(req.body.selectedPharmacyId);
        if (selectedPharmacy && selectedPharmacy.owner) {
          return res.status(400).json({
            success: false,
            message: 'This pharmacy already has an owner',
            data: allPharmacies
          });
        }
      }

      // Return all available pharmacies for selection
      return res.status(200).json({
        success: true,
        message: 'Please select a pharmacy or create a new one',
        data: allPharmacies
      });
    }

    const pharmacy = await Pharmacy.create(req.body);

    res.status(201).json({
      success: true,
      data: pharmacy
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
      data: pharmacy
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
        hours: p.pharmacy.hours,
        coordinates: p.pharmacy.coordinates,
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