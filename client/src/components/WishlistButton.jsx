import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { Heart } from "lucide-react";
import { authedRequest } from "../utils/request.js";
import { useToast } from "./Toast.jsx";
import { useLocalUser } from "../utils/localUser.jsx";

export default function WishlistButton({ listingId, className = "" }) {
  const { getToken } = useAuth();
  const { localUser } = useLocalUser();
  const toast = useToast();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);

  // Only show for buyers
  if (!localUser || localUser.role !== "buyer") {
    return null;
  }

  useEffect(() => {
    checkWishlistStatus();
  }, [listingId]);

  const checkWishlistStatus = async () => {
    try {
      const res = await authedRequest(getToken, {
        method: "get",
        url: `/api/wishlist/check/${listingId}`
      });
      setInWishlist(res.data.inWishlist);
    } catch (err) {
      console.error("Failed to check wishlist status:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (inWishlist) {
        await authedRequest(getToken, {
          method: "delete",
          url: `/api/wishlist/${listingId}`
        });
        setInWishlist(false);
        toast("Removed from wishlist", "success");
      } else {
        const res = await authedRequest(getToken, {
          method: "post",
          url: "/api/wishlist",
          data: { listingId }
        });
        setInWishlist(true);
        toast("Added to wishlist", "success");
      }
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to update wishlist", "error");
    }
  };

  if (loading) {
    return (
      <button
        className={`p-2 rounded-full hover:bg-ink/10 transition-colors ${className}`}
        title="Loading..."
      >
        <Heart size={18} className="text-ink/30" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleWishlist}
      className={`p-2 rounded-full hover:bg-ink/10 transition-colors ${
        inWishlist ? "text-red-500" : "text-ink/40 hover:text-red-500"
      } ${className}`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
    </button>
  );
}
