import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ShieldCheck, Heart, ArrowLeft, Tag, Flag, Star, MessageCircle } from "lucide-react";
import { useAuth, useUser } from "@clerk/react";
import api, { getImageUrl } from "../api/client.js";
import { authedRequest } from "../utils/request.js";
import { useToast } from "../components/Toast.jsx";
import { useLocalUser } from "../utils/localUser.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { SkeletonText } from "../components/Skeleton.jsx";
import WishlistButton from "../components/WishlistButton.jsx";

export default function ListingDetail() {
  const { id } = useParams();
  const { isSignedIn, user } = useUser();
  const { localUser } = useLocalUser();
  const { getToken } = useAuth();
  const toast = useToast();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/listings/${id}`)
      .then((res) => setListing(res.data.listing))
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch user's requests for this listing (to show chat link)
  useEffect(() => {
    if (isSignedIn && listing?._id) {
      authedRequest(getToken, { method: "get", url: "/api/requests" })
        .then((res) => {
          const reqs = (res.data.requests || []).filter((r) => r.listingId?._id === listing._id);
          setMyRequests(reqs);
        })
        .catch(() => {});
    }
  }, [isSignedIn, listing?._id, getToken]);

  // Fetch seller reviews
  useEffect(() => {
    if (listing?.sellerId?._id) {
      api.get(`/api/reviews/seller/${listing.sellerId._id}`)
        .then((res) => {
          setReviews(res.data.reviews);
          setAvgRating(res.data.averageRating);
        })
        .catch(() => {});
    }
  }, [listing?.sellerId?._id]);

  const sendRequest = async () => {
    try {
      setRequesting(true);
      await authedRequest(getToken, { method: "post", url: "/api/requests", data: { listingId: listing._id } });
      toast("Request sent! Check your dashboard for updates.", "success");
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to send request", "error");
    } finally {
      setRequesting(false);
    }
  };

  const submitReport = async () => {
    if (!reportReason) {
      toast("Please select a reason", "error");
      return;
    }
    try {
      await authedRequest(getToken, {
        method: "post",
        url: "/api/reports",
        data: { listingId: listing._id, reason: reportReason }
      });
      toast("Report submitted. Thank you for keeping our community safe!", "success");
      setShowReport(false);
      setReportReason("");
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to submit report", "error");
    }
  };

  if (loading) return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="animate-pulse h-80 rounded-3xl bg-ink/5" />
        <SkeletonText lines={4} />
      </div>
      <div className="space-y-6">
        <SkeletonText lines={3} />
        <SkeletonText lines={2} />
      </div>
    </div>
  );

  if (!listing) return (
    <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center animate-scale-in">
      <h2 className="text-xl font-semibold">Listing not found</h2>
      <Link to="/browse" className="btn-primary mt-4 inline-flex"><ArrowLeft size={16} /> Back to Browse</Link>
    </div>
  );

  const images = listing.images?.length ? listing.images : [];

  return (
    <div className="animate-fade-in">
      <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-ink mb-6 transition">
        <ArrowLeft size={16} /> Back to Listings
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="card-glass overflow-hidden rounded-3xl">
            {images.length > 0 ? (
              <img src={getImageUrl(images[selectedImg])} alt={listing.title} className="h-80 w-full object-cover transition-all duration-300" />
            ) : (
              <div className="flex h-80 items-center justify-center bg-ink/5 text-sm text-ink/40">
                <Heart size={40} className="text-ink/10" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImg(idx)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${selectedImg === idx ? "border-ember" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={getImageUrl(img)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-4 rounded-3xl border border-ink/10 bg-white p-6">
            <h2 className="text-2xl font-semibold">About this pet</h2>
            <p className="text-sm text-ink/70">{listing.healthNotes || "No additional health notes."}</p>
            <div className="grid gap-3 text-sm text-ink/70 sm:grid-cols-2">
              <div className="flex items-center gap-2"><Tag size={14} className="text-ember" /> Species: <strong>{listing.species}</strong></div>
              <div className="flex items-center gap-2"><Tag size={14} className="text-ember" /> Breed: <strong>{listing.breed || "Not specified"}</strong></div>
              <div className="flex items-center gap-2"><Tag size={14} className="text-ember" /> Age: <strong>{listing.ageMonths ? `${listing.ageMonths} months` : "Unknown"}</strong></div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className={listing.vaccinated ? "text-moss" : "text-ink/30"} />
                Vaccinated: <strong>{listing.vaccinated ? "Yes" : "No"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-glass rounded-3xl p-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-semibold">{listing.title}</h1>
              <div className="flex items-center gap-2">
                <WishlistButton listingId={listing._id} className="hidden sm:flex" />
                <StatusBadge status={listing.status} />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-3xl font-bold text-ember">₹{listing.price?.toLocaleString()}</span>
              {listing.negotiable && <span className="badge">Negotiable</span>}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-ink/60">
              <MapPin size={16} className="text-ember" /> {listing.location?.city}
            </div>

            <div className="mt-6 space-y-3">
              {/* Show chat links for accepted requests */}
              {myRequests.length > 0 && (
                <div className="space-y-2">
                  {myRequests.map((req) => (
                    req.status === "accepted" ? (
                      <Link key={req._id} to={`/chat/${req._id}`} className="btn-primary w-full flex items-center justify-center gap-2">
                        <MessageCircle size={16} /> Chat about {listing.title}
                      </Link>
                    ) : (
                      <div key={req._id} className="btn-outline w-full text-center text-sm">
                        Request {req.status} for {listing.title}
                      </div>
                    )
                  ))}
                </div>
              )}

              {isSignedIn ? (
                <button className="btn-primary w-full" onClick={sendRequest} disabled={requesting}>
                  {requesting ? "Sending..." : "Request to Buy"}
                </button>
              ) : (
                <div className="rounded-2xl bg-ink/5 p-4 text-center">
                  <p className="text-xs text-ink/60">Sign in to request this pet</p>
                  <Link to="/auth" className="btn-outline mt-2 inline-flex text-xs">Sign In</Link>
                </div>
              )}
              
              {/* Report Button */}
              <button
                className="btn-outline w-full mt-2 flex items-center justify-center gap-2 text-ink/50 hover:text-ember"
                onClick={() => setShowReport(!showReport)}
              >
                <Flag size={16} /> Report this listing
              </button>
              
              {showReport && (
                <div className="mt-3 rounded-2xl bg-ink/5 p-4 animate-fade-in">
                  <p className="text-xs font-semibold mb-2">Why are you reporting this listing?</p>
                  <select 
                    className="input text-sm mb-2"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  >
                    <option value="">Select reason</option>
                    <option value="scam">Suspected scam</option>
                    <option value="fake">Fake listing</option>
                    <option value="inappropriate">Inappropriate content</option>
                    <option value="sold">Already sold</option>
                    <option value="duplicate">Duplicate listing</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="flex gap-2">
                    <button className="btn-primary text-xs py-2" onClick={submitReport}>Submit Report</button>
                    <button className="btn-outline text-xs py-2" onClick={() => setShowReport(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-6">
            <h3 className="text-lg font-semibold">Seller</h3>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/10 text-sm font-bold">
                {((listing.sellerId?.name && listing.sellerId.name !== "User") ? listing.sellerId.name : "S")[0].toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold">{(listing.sellerId?.name && listing.sellerId.name !== "User") ? listing.sellerId.name : "Verified Seller"}</p>
                {listing.sellerId?.city && listing.sellerId.city !== "N/A" && (
                  <p className="text-xs text-ink/50">{listing.sellerId.city}</p>
                )}
              </div>
              {listing.sellerId?.verifiedPhone && (
                <ShieldCheck size={18} className="ml-auto text-moss" />
              )}
            </div>
            
            {/* Seller Rating */}
            {avgRating > 0 && (
              <div className="mt-4 pt-4 border-t border-ink/10">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= Math.round(avgRating) ? "fill-ember text-ember" : "text-ink/30"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-ink/50">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="rounded-3xl border border-ink/10 bg-white p-6">
              <h3 className="text-lg font-semibold mb-4">Seller Reviews</h3>
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review._id} className="border-b border-ink/10 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={star <= review.rating ? "fill-ember text-ember" : "text-ink/30"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-ink/50">{review.buyerId?.name || "Anonymous"}</span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-ink/70">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
