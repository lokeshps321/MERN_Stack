import Listing from "../models/Listing.js";
import { getListingById, listListingsWithProjection } from "../repositories/listingRepository.js";

function parseNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function parseImages(bodyImages) {
  if (!bodyImages) return [];
  if (Array.isArray(bodyImages)) return bodyImages;
  if (typeof bodyImages === "string") {
    try {
      const parsed = JSON.parse(bodyImages);
      if (Array.isArray(parsed)) return parsed;
    } catch (err) {
      return bodyImages.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export async function listListings(req, res, next) {
  try {
    const { species, breed, minPrice, maxPrice, city, lat, lng, radiusKm, sort, mine, search } = req.query;

    const filter = {};
    const andFilters = [];

    if (mine === "true") {
      if (!req.user) return res.status(401).json({ error: "Auth required" });
      filter.sellerId = req.user._id;
    } else if (!req.user || req.user.role !== "admin") {
      filter.status = "approved";
      // Exclude expired listings
      andFilters.push({ expiresAt: { $gte: new Date() } });
    }

    if (species) filter.species = species;
    if (breed) filter.breed = breed;
    if (city) filter["location.city"] = { $regex: new RegExp(`^${city}$`, "i") };

    // Search across title, breed, species, health notes, and city
    if (search && search.trim()) {
      andFilters.push({ $text: { $search: search.trim() } });
    }

    const min = parseNumber(minPrice);
    const max = parseNumber(maxPrice);
    if (min !== undefined || max !== undefined) {
      filter.price = {};
      if (min !== undefined) filter.price.$gte = min;
      if (max !== undefined) filter.price.$lte = max;
    }

    const hasGeo = lat && lng && radiusKm;
    if (hasGeo) {
      const radiusMeters = parseNumber(radiusKm) * 1000;
      filter["location.coordinates"] = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseNumber(lng), parseNumber(lat)] },
          $maxDistance: radiusMeters
        }
      };
    }

    if (andFilters.length) {
      filter.$and = andFilters;
    }

    let sortSpec = { createdAt: -1 };
    if (sort === "price_asc") sortSpec = { price: 1, createdAt: -1 };
    if (sort === "price_desc") sortSpec = { price: -1, createdAt: -1 };
    if (sort === "newest" || !sort) sortSpec = { createdAt: -1 };

    const listings = await listListingsWithProjection({ filter, sort: sortSpec, limit: 100 });
    res.json({ listings });
  } catch (err) {
    next(err);
  }
}

export async function getListing(req, res, next) {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const isOwner = req.user && listing.sellerId?._id?.toString() === req.user._id.toString();
    if (listing.status !== "approved" && (!req.user || req.user.role !== "admin") && !isOwner) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ listing });
  } catch (err) {
    next(err);
  }
}

export async function createListing(req, res, next) {
  try {
    let images = [];
    if (req.files?.length) {
      images = req.files.map((file) => file.path);
    } else {
      images = parseImages(req.body.images);
    }

    // Set expiry date to 60 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);

    const listing = await Listing.create({
      sellerId: req.user._id,
      title: req.body.title,
      species: req.body.species,
      breed: req.body.breed,
      ageMonths: req.body.ageMonths,
      gender: req.body.gender,
      vaccinated: req.body.vaccinated,
      healthNotes: req.body.healthNotes,
      price: req.body.price,
      negotiable: req.body.negotiable,
      images,
      location: {
        city: req.body.city,
        coordinates: [req.body.lng, req.body.lat]
      },
      status: "pending_review",
      expiresAt
    });

    res.status(201).json({ listing });
  } catch (err) {
    next(err);
  }
}

export async function updateListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const isOwner = listing.sellerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" });

    const updates = { ...req.body };
    
    // Handle images: merge existing with newly uploaded
    let images = [...(listing.images || [])];
    
    // Remove existing images if new ones are provided via existingImages parameter
    if (updates.existingImages) {
      try {
        images = typeof updates.existingImages === "string" 
          ? JSON.parse(updates.existingImages) 
          : updates.existingImages;
        delete updates.existingImages;
      } catch (e) {
        images = [];
      }
    }
    
    // Add newly uploaded images
    if (req.files?.length) {
      const newImages = req.files.map((file) => file.path);
      images = [...images, ...newImages];
    }
    
    // Limit to 6 images total
    updates.images = images.slice(0, 6);

    if (updates.city || updates.lat || updates.lng) {
      updates.location = {
        city: updates.city || listing.location.city,
        coordinates: [updates.lng ?? listing.location.coordinates[0], updates.lat ?? listing.location.coordinates[1]]
      };
    }

    if (isOwner) {
      updates.status = "pending_review";
      updates.rejectReason = undefined;
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ listing: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const isOwner = listing.sellerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" });

    await listing.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
