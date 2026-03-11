import Listing from "../models/Listing.js";

export const LISTING_CARD_PROJECTION = {
  title: 1,
  price: 1,
  images: 1,
  species: 1,
  breed: 1,
  status: 1,
  createdAt: 1,
  location: 1,
  sellerId: 1
};

export async function listListingsWithProjection({ filter, sort, limit = 100 }) {
  return Listing.find(filter)
    .select(LISTING_CARD_PROJECTION)
    .populate("sellerId", "_id name email city verifiedPhone")
    .sort(sort)
    .limit(limit)
    .batchSize(100)
    .lean();
}

export async function getListingById(id) {
  return Listing.findById(id)
    .populate("sellerId", "_id name email city verifiedPhone")
    .lean();
}
