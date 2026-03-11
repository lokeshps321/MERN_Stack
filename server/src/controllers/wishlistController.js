import Wishlist from "../models/Wishlist.js";
import Listing from "../models/Listing.js";

export async function getWishlist(req, res, next) {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate("listings.listingId", "title species breed price images location status");

    if (!wishlist) {
      return res.json({ wishlist: { listings: [] } });
    }

    // Filter out listings that are no longer approved or available
    const validListings = wishlist.listings.filter(item => {
      const listing = item.listingId;
      const notExpired = !listing?.expiresAt || listing.expiresAt > new Date();
      return listing && listing.status === "approved" && notExpired;
    });

    // Update wishlist if any listings were removed
    if (validListings.length !== wishlist.listings.length) {
      wishlist.listings = validListings;
      await wishlist.save();
    }

    res.json({ wishlist: { ...wishlist.toObject(), listings: validListings } });
  } catch (err) {
    next(err);
  }
}

export async function addToWishlist(req, res, next) {
  try {
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ error: "Listing ID is required" });
    }

    // Verify listing exists and is approved
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.status !== "approved") {
      return res.status(403).json({ error: "This listing is not available" });
    }

    // Check if user already has this in wishlist
    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.user._id,
        listings: [{ listingId }]
      });
    } else {
      // Check if already in wishlist
      const exists = wishlist.listings.some(
        item => item.listingId.toString() === listingId.toString()
      );

      if (exists) {
        return res.json({ message: "Already in wishlist", wishlist });
      }

      wishlist.listings.unshift({ listingId });
      await wishlist.save();
    }

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate("listings.listingId", "title species breed price images location status");

    res.json({ message: "Added to wishlist", wishlist: populatedWishlist });
  } catch (err) {
    next(err);
  }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const { listingId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.json({ message: "Wishlist is empty", wishlist: { listings: [] } });
    }

    wishlist.listings = wishlist.listings.filter(
      item => item.listingId.toString() !== listingId
    );

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate("listings.listingId", "title species breed price images location status");

    res.json({ message: "Removed from wishlist", wishlist: populatedWishlist });
  } catch (err) {
    next(err);
  }
}

export async function checkWishlistStatus(req, res, next) {
  try {
    const { listingId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.json({ inWishlist: false });
    }

    const inWishlist = wishlist.listings.some(
      item => item.listingId.toString() === listingId
    );

    res.json({ inWishlist });
  } catch (err) {
    next(err);
  }
}
