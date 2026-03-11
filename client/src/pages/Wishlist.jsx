import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { Heart, ShoppingBag, RefreshCcw, Package } from "lucide-react";
import { useLocalUser } from "../utils/localUser.jsx";
import { authedRequest } from "../utils/request.js";
import { useToast } from "../components/Toast.jsx";
import { getImageUrl } from "../api/client.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Wishlist() {
  const { getToken } = useAuth();
  const { localUser } = useLocalUser();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (!localUser) return;
    if (localUser.role !== "buyer") {
      toast("Wishlist is only available for buyers", "error");
      navigate("/dashboard");
      return;
    }
    loadWishlist();
  }, [localUser]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const res = await authedRequest(getToken, { method: "get", url: "/api/wishlist" });
      setWishlistItems(res.data.wishlist?.listings || []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      toast("Failed to load wishlist", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (listingId) => {
    try {
      await authedRequest(getToken, {
        method: "delete",
        url: `/api/wishlist/${listingId}`
      });
      toast("Removed from wishlist", "success");
      loadWishlist();
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to remove", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-ink/5" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-64 rounded-3xl bg-ink/5" />
          <div className="h-64 rounded-3xl bg-ink/5" />
          <div className="h-64 rounded-3xl bg-ink/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">My Wishlist</h1>
          <p className="text-sm text-ink/60 mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? "pet" : "pets"} saved
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadWishlist} className="btn-outline" title="Refresh">
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <Link to="/browse" className="btn-primary">
            <ShoppingBag size={16} /> Browse More Pets
          </Link>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="card-glass rounded-3xl p-12 text-center">
          <Heart size={64} className="mx-auto text-ink/20 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-ink/60 mb-6">Save your favorite pets to compare and contact sellers later!</p>
          <Link to="/browse" className="btn-primary inline-flex">
            <ShoppingBag size={16} /> Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => {
            const listing = item.listingId;
            if (!listing) return null;

            return (
              <div
                key={listing._id}
                className="card-glass rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/listing/${listing._id}`} className="block">
                  <div className="aspect-square overflow-hidden bg-ink/5">
                    {listing.images?.[0] ? (
                      <img
                        src={getImageUrl(listing.images[0])}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink/40">
                        <Package size={48} />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4 space-y-3">
                  <Link to={`/listing/${listing._id}`}>
                    <h3 className="font-semibold text-lg line-clamp-1 hover:text-ember transition-colors">
                      {listing.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 text-sm text-ink/60">
                    <span className="px-2 py-1 rounded-full bg-ink/10 text-xs font-medium">
                      {listing.species}
                    </span>
                    {listing.breed && (
                      <span className="px-2 py-1 rounded-full bg-ink/10 text-xs font-medium">
                        {listing.breed}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-ember">₹{listing.price.toLocaleString()}</p>
                      {listing.location?.city && (
                        <p className="text-xs text-ink/50">{listing.location.city}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromWishlist(listing._id)}
                      className="p-2 rounded-full hover:bg-red-50 text-ink/40 hover:text-red-500 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>

                  <Link
                    to={`/listing/${listing._id}`}
                    className="btn-primary w-full text-sm py-2 block text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
