const Pharmacy = require('../models/pharmacy.model');
const Medication = require('../models/medication.model');

// @desc    Get all pharmacies with pagination, search, and city filter
// @route   GET /api/pharmacies
// @access  Public
exports.getPharmacies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

   let query = {};

if (req.query.search) {
  const searchRegex = new RegExp(req.query.search, 'i'); // 'i' = case insensitive
  query = {
    $or: [
      { name: searchRegex },
      { city: searchRegex },
      { address: searchRegex }
    ]
  };
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


// @desc    Get single pharmacy with its medications and stock info
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
        medications: medications.map(med => {
          const stockInfo = med.pharmacies.find(p => p.pharmacy.toString() === pharmacy._id.toString());
          return {
            id: med._id,
            name: med.name,
            inStock: stockInfo ? stockInfo.inStock : false,
            price: stockInfo ? stockInfo.price : null
          };
        })
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
    req.body.owner = req.user.id;

    // Check if user with role 'pharmacy' already has a pharmacy
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

    // Authorization: only owner or admin
    if (pharmacy.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this pharmacy'
      });
    }

    // Prevent owner field update
    if (req.body.owner) delete req.body.owner;

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

    // Authorization: only owner or admin
    if (pharmacy.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this pharmacy'
      });
    }

    // Remove pharmacy reference from medications
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

// @desc    Get pharmacies near a location (approximate distance filter)
// @route   GET /api/pharmacies/location/:lat/:lng/:distance
// @access  Public
exports.getPharmaciesByLocation = async (req, res, next) => {
  try {
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);
    const distanceKm = parseInt(req.params.distance, 10) || 10;

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude'
      });
    }

    // Fetch all pharmacies (in real app, use geospatial queries)
    const pharmacies = await Pharmacy.find();

    // Approximate filtering by Euclidean distance (not accurate for large distances)
    const filteredPharmacies = pharmacies.filter(pharmacy => {
      if (!pharmacy.coordinates || typeof pharmacy.coordinates.lat !== 'number' || typeof pharmacy.coordinates.lng !== 'number') {
        return false;
      }
      const latDiff = pharmacy.coordinates.lat - lat;
      const lngDiff = pharmacy.coordinates.lng - lng;
      const approxDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // approx km per degree
      return approxDistance <= distanceKm;
    });

    res.status(200).json({
      success: true,
      count: filteredPharmacies.length,
      data: filteredPharmacies.map(pharmacy => {
        const latDiff = pharmacy.coordinates.lat - lat;
        const lngDiff = pharmacy.coordinates.lng - lng;
        const approxDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
        return {
          id: pharmacy._id,
          name: pharmacy.name,
          address: pharmacy.address,
          city: pharmacy.city,
          coordinates: pharmacy.coordinates,
          distance: approxDistance.toFixed(2)
        };
      })
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pharmacies that have a specific medication in stock
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

    // Filter pharmacies where medication is in stock
    const pharmaciesWithMedication = medication.pharmacies
      .filter(p => p.inStock && p.pharmacy)
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
