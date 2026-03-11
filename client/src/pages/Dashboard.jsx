import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, ClipboardList, Heart, Package, PawPrint, Plus, RefreshCcw, ShieldCheck, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { useLocalUser } from "../utils/localUser.jsx";
import { authedRequest } from "../utils/request.js";
import { useToast } from "../components/Toast.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import StatsCard from "../components/StatsCard.jsx";
import { SkeletonRow } from "../components/Skeleton.jsx";
import { getImageUrl } from "../api/client.js";

export default function Dashboard() {
  const { getToken } = useAuth();
  const { localUser, loading, debugError, refresh } = useLocalUser();
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminTab, setAdminTab] = useState("overview");
  const [dataLoading, setDataLoading] = useState(true);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const reqRes = await authedRequest(getToken, { method: "get", url: "/api/requests" });
      setRequests(reqRes.data.requests || []);

      if (localUser?.role === "seller") {
        const listRes = await authedRequest(getToken, { method: "get", url: "/api/listings", params: { mine: true } });
        setListings(listRes.data.listings || []);
      }

      if (localUser?.role === "admin") {
        try {
          const statsRes = await authedRequest(getToken, { method: "get", url: "/api/admin/stats" });
          setAdminStats(statsRes.data);
        } catch (e) { /* stats endpoint may not exist yet */ }
        try {
          const usersRes = await authedRequest(getToken, { method: "get", url: "/api/admin/users" });
          setAdminUsers(usersRes.data.users || []);
        } catch (e) { /* users endpoint may not exist yet */ }
        const listRes = await authedRequest(getToken, { method: "get", url: "/api/admin/listings", params: { status: "pending_review" } });
        setListings(listRes.data.listings || []);
      }
    } catch (err) {
      console.warn("Dashboard load error:", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (localUser) loadData();
  }, [localUser]);

  const updateStatus = async (id, status) => {
    try {
      await authedRequest(getToken, { method: "patch", url: `/api/requests/${id}/status`, data: { status } });
      toast(`Request ${status}`, "success");
      loadData();
    } catch (err) {
      toast(err?.response?.data?.error || "Action failed", "error");
    }
  };

  const becomeSeller = async () => {
    try {
      await authedRequest(getToken, { method: "patch", url: "/api/users/role", data: { role: "seller" } });
      toast("You're now a seller! You can create listings.", "success");
      refresh();
    } catch (err) {
      toast("Failed to update role", "error");
    }
  };

  const approveAdmin = async (id) => {
    try {
      await authedRequest(getToken, { method: "patch", url: `/api/admin/listings/${id}/approve` });
      toast("Listing approved", "success");
      loadData();
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to approve", "error");
    }
  };

  const rejectAdmin = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await authedRequest(getToken, { method: "patch", url: `/api/admin/listings/${id}/reject`, data: { reason } });
      toast("Listing rejected", "success");
      loadData();
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to reject", "error");
    }
  };

  const deleteListing = async (id) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
    try {
      await authedRequest(getToken, { method: "delete", url: `/api/listings/${id}` });
      toast("Listing deleted", "success");
      loadData();
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to delete", "error");
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-ink/5" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-24 rounded-3xl bg-ink/5" />
          <div className="h-24 rounded-3xl bg-ink/5" />
          <div className="h-24 rounded-3xl bg-ink/5" />
        </div>
        <SkeletonRow count={5} />
      </div>
    );
  }

  if (!localUser) {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  /* ===== ADMIN DASHBOARD ===== */
  if (localUser.role === "admin") {
    return (
      <div className="grid gap-8 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Admin Panel</h1>
            <p className="text-sm text-ink/60 mt-1">Manage listings and users</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadData} className="btn-outline" title="Refresh">
              <RefreshCcw size={16} className={dataLoading ? "animate-spin" : ""} />
            </button>
            <Link to="/profile" className="btn-outline">Edit Profile</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard icon={Users} label="Total Users" value={adminStats?.totalUsers || 0} />
          <StatsCard icon={Package} label="Total Listings" value={adminStats?.totalListings || 0} />
          <StatsCard icon={ClipboardList} label="Pending Review" value={adminStats?.pendingListings || 0} />
          <StatsCard icon={Heart} label="Total Requests" value={adminStats?.totalRequests || 0} />
        </div>

        <div className="card-glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Listings ({listings.length})</h2>
          {listings.length === 0 ? (
            <p className="text-ink/60">No pending listings</p>
          ) : (
            <div className="space-y-3">
              {listings.map((listing) => (
                <div key={listing._id} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-ink/10">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-ink/5 overflow-hidden">
                      {listing.images?.[0] ? (
                        <img src={getImageUrl(listing.images[0])} alt={listing.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-ink/40">No img</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-xs text-ink/60">{listing.species} • ₹{listing.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveAdmin(listing._id)} className="btn-primary text-xs py-1.5">Approve</button>
                    <button onClick={() => rejectAdmin(listing._id)} className="btn-outline text-xs py-1.5 text-red-600">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-4">Users ({adminUsers.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/10">
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-ink/60">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-ink/60">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-ink/60">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-ink/60">Verified</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user) => (
                  <tr key={user._id} className="border-b border-ink/5">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{user.name || "User"}</p>
                        <p className="text-xs text-ink/50">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${user.role === "admin" ? "bg-ember/10 text-ember" : user.role === "seller" ? "bg-moss/10 text-moss" : "bg-ink/10 text-ink/70"}`}>{user.role}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-ink/60">{user.city || "N/A"}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {user.verifiedEmail && <span className="text-xs text-moss">✉️</span>}
                        {user.verifiedPhone && <span className="text-xs text-moss">📱</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ===== SELLER DASHBOARD ===== */
  if (localUser.role === "seller") {
    const activeListings = listings.filter((l) => l.status === "approved").length;
    const pendingListings = listings.filter((l) => l.status === "pending_review").length;
    const incomingRequests = requests.filter((r) => r.status === "requested").length;

    return (
      <div className="grid gap-8 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Seller Dashboard</h1>
            <p className="text-sm text-ink/60 mt-1">Welcome back, {localUser.name || localUser.email}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadData} className="btn-outline" title="Refresh">
              <RefreshCcw size={16} className={dataLoading ? "animate-spin" : ""} />
            </button>
            <Link to="/profile" className="btn-outline">Edit Profile</Link>
            <Link to="/sell" className="btn-primary"><Plus size={16} /> New Listing</Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard icon={Package} label="Active Listings" value={activeListings} />
          <StatsCard icon={Clock} label="Pending Review" value={pendingListings} />
          <StatsCard icon={Heart} label="Incoming Requests" value={incomingRequests} />
        </div>

        <div className="card-glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-4">Your Listings ({listings.length})</h2>
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-ink/20 mb-4" />
              <p className="text-ink/60">You haven't created any listings yet</p>
              <Link to="/sell" className="btn-primary mt-4 inline-flex"><Plus size={16} /> Create Your First Listing</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((listing) => (
                <div key={listing._id} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-ink/10">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-ink/5 overflow-hidden">
                      {listing.images?.[0] ? (
                        <img src={getImageUrl(listing.images[0])} alt={listing.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-ink/40">No img</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-xs text-ink/60">{listing.species} • ₹{listing.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/edit-listing/${listing._id}`} className="btn-outline text-xs py-1.5">Edit</Link>
                    <button onClick={() => deleteListing(listing._id)} className="btn-outline text-xs py-1.5 text-red-600">Delete</button>
                    <StatusBadge status={listing.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-4">Requests ({requests.length})</h2>
          {requests.length === 0 ? (
            <p className="text-ink/60">No requests yet</p>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req._id} className="p-4 rounded-2xl bg-white border border-ink/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{req.listingId?.title}</p>
                      <p className="text-sm text-ink/60">From: {req.buyerId?.name || "Buyer"}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  {req.status === "requested" && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(req._id, "accepted")} className="btn-primary text-xs py-1.5">Accept</button>
                        <button onClick={() => updateStatus(req._id, "rejected")} className="btn-outline text-xs py-1.5 text-red-600">Reject</button>
                      </div>
                      <p className="text-xs text-ink/50">Click Accept to share your contact details with the buyer</p>
                    </div>
                  )}
                  {req.status === "accepted" && (
                    <div className="rounded-xl bg-moss/5 border border-moss/20 p-3 text-xs text-moss">
                      <strong>✓ Accepted</strong> - Buyer can now chat with you to arrange pickup
                    </div>
                  )}
                  {req.status === "rejected" && (
                    <p className="text-xs text-ink/40">Rejected</p>
                  )}
                  {req.status === "completed" && (
                    <p className="text-xs text-moss">✓ Sale completed - Listing marked as sold</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ===== BUYER DASHBOARD ===== */
  return (
    <div className="grid gap-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">My Dashboard</h1>
          <p className="text-sm text-ink/60 mt-1">Welcome back, {localUser.name || localUser.email}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="btn-outline" title="Refresh">
            <RefreshCcw size={16} className={dataLoading ? "animate-spin" : ""} />
          </button>
          <Link to="/profile" className="btn-outline">Edit Profile</Link>
          {localUser.role === "buyer" && (
            <button onClick={becomeSeller} className="btn-primary">Become a Seller</button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatsCard icon={Heart} label="Your Requests" value={requests.length} />
        <StatsCard icon={ShoppingBag} label="Active Requests" value={requests.filter((r) => r.status === "accepted").length} />
      </div>

      <div className="card-glass rounded-3xl p-6">
        <h2 className="text-xl font-semibold mb-4">Your Requests ({requests.length})</h2>
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto text-ink/20 mb-4" />
            <p className="text-ink/60">You haven't made any requests yet</p>
            <Link to="/browse" className="btn-primary mt-4 inline-flex">Browse Listings</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req._id} className="p-4 rounded-2xl bg-white border border-ink/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{req.listingId?.title}</p>
                    <p className="text-sm text-ink/60">Seller: {req.sellerId?.name || "Seller"}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                {req.status === "accepted" && (
                  <div className="space-y-2">
                    <div className="rounded-xl bg-moss/5 border border-moss/20 p-3 text-xs text-moss">
                      <strong>✓ Request Accepted!</strong> Next steps:
                      <ul className="mt-1 space-y-1 list-disc list-inside ml-1">
                        <li>Chat with seller to arrange pickup</li>
                        <li>Verify pet details before payment</li>
                        <li>Meet at safe public location</li>
                      </ul>
                    </div>
                    <Link to={`/chat/${req._id}`} className="btn-primary text-xs py-1.5 inline-block">Go to Chat</Link>
                  </div>
                )}
                {req.status === "requested" && (
                  <p className="text-xs text-ink/50">Waiting for seller to accept your request...</p>
                )}
                {req.status === "rejected" && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
                    <strong>✕ Rejected</strong> - The seller declined this request. The listing is available for others.
                  </div>
                )}
                {req.status === "cancelled" && (
                  <div className="rounded-xl bg-ink/5 border border-ink/20 p-3 text-xs text-ink/60">
                    <strong>✕ Cancelled</strong> - You cancelled this request.
                  </div>
                )}
                {req.status === "completed" && (
                  <p className="text-xs text-moss">✓ Transaction completed successfully!</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Clock icon for stats
function Clock({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
