import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ShieldCheck } from "lucide-react";
import { getImageUrl } from "../api/client.js";
import WishlistButton from "./WishlistButton.jsx";

export default function ListingCard({ listing }) {
  const image = listing.images?.[0];
  return (
    <Link to={`/listing/${listing._id}`} className="group">
      <div className="card-glass overflow-hidden rounded-3xl shadow-premium transition group-hover:-translate-y-1">
        <div className="h-44 w-full bg-ink/5 relative flex items-center justify-center p-2">
          {image ? (
            <img src={getImageUrl(image)} alt={listing.title} className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink/40">No image</div>
          )}
          <div className="absolute top-3 right-3">
            <WishlistButton listingId={listing._id} />
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <span className="text-sm font-semibold text-ember">₹{listing.price}</span>
          </div>
          <p className="text-sm text-ink/60">{listing.species} {listing.breed ? `• ${listing.breed}` : ""}</p>
          <div className="flex items-center justify-between text-xs text-ink/60">
            <span className="flex items-center gap-1"><MapPin size={14} />{listing.location?.city}</span>
            {listing.sellerId?.verifiedPhone && (
              <span className="flex items-center gap-1 text-moss"><ShieldCheck size={14} />Verified</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
