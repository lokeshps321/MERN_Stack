import React, { useEffect, useState } from "react";
import { Shield, Package, Users, AlertTriangle, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { useAuth } from "@clerk/react";
import { authedRequest } from "../utils/request.js";
import { useToast } from "../components/Toast.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [pendingListings, setPendingListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await authedRequest(getToken, { method: "get", url: "/api/admin/stats" });
      setStats(statsRes.data);
      const listingsRes = await authedRequest(getToken, { method: "get", url: "/api/admin/listings?status=pending_review" });
      setPendingListings(listingsRes.data.listings || []);
      const reportsRes = await authedRequest(getToken, { method: "get", url: "/api/reports?status=pending" });
      setReports(reportsRes.data.reports || []);
      const usersRes = await authedRequest(getToken, { method: "get", url: "/api/admin/users" });
      setUsers(usersRes.data.users || []);
    } catch (err) {
      toast("Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const approveListing = async (id) => {
    try {
      await authedRequest(getToken, { method: "patch", url: `/api/admin/listings/${id}/approve` });
      toast("Listing approved!", "success");
      loadData();
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to approve", "error");
    }
  };

  const rejectListing = async (id) => {
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

  const resolveReport = async (id, status) => {
    try {
      await authedRequest(getToken, { method: "patch", url: `/api/reports/${id}`, data: { status } });
      toast(`Report marked as ${status}`, "success");
      loadData();
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to update", "error");
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-sm text-ink/60 animate-pulse">Loading admin dashboard...</p></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold flex items-center gap-3">
          <Shield size={32} className="text-ember" />
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-ink/60">Manage listings, users, and reports</p>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card-glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-ink/60 uppercase tracking-wide">Total Users</p><p className="text-3xl font-bold mt-1">{stats.totalUsers}</p></div>
              <Users size={40} className="text-ink/20" />
            </div>
          </div>
          <div className="card-glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-ink/60 uppercase tracking-wide">Total Listings</p><p className="text-3xl font-bold mt-1">{stats.totalListings}</p></div>
              <Package size={40} className="text-ink/20" />
            </div>
          </div>
          <div className="card-glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-ink/60 uppercase tracking-wide">Pending Review</p><p className="text-3xl font-bold mt-1 text-amber-600">{stats.pendingListings}</p></div>
              <Clock size={40} className="text-amber-200" />
            </div>
          </div>
          <div className="card-glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-ink/60 uppercase tracking-wide">Total Requests</p><p className="text-3xl font-bold mt-1">{stats.totalRequests}</p></div>
              <AlertTriangle size={40} className="text-ink/20" />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 border-b border-ink/10">
        {["overview", "listings", "reports", "users"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium transition ${activeTab === tab ? "border-b-2 border-ember text-ember" : "text-ink/60 hover:text-ink"}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === "listings" && `(${pendingListings.length})`}{tab === "reports" && `(${reports.length})`}{tab === "users" && `(${users.length})`}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="card-glass rounded-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button onClick={() => setActiveTab("listings")} className="btn-primary flex items-center justify-center gap-2"><Package size={18} /> Review Listings</button>
              <button onClick={() => setActiveTab("reports")} className="btn-outline flex items-center justify-center gap-2"><AlertTriangle size={18} /> View Reports</button>
              <button onClick={() => setActiveTab("users")} className="btn-outline flex items-center justify-center gap-2"><Users size={18} /> Manage Users</button>
            </div>
          </div>
          {pendingListings.length > 0 && (
            <div className="card-glass rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Pending Listings</h2>
              <div className="space-y-3">
                {pendingListings.slice(0, 5).map((listing) => (
                  <div key={listing._id} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-ink/10">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-ink/5 overflow-hidden">
                        {listing.images?.[0] ? <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-ink/40">No img</div>}
                      </div>
                      <div>
                        <p className="font-medium">{listing.title}</p>
                        <p className="text-xs text-ink/60">{listing.species} • ₹{listing.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveListing(listing._id)} className="btn-primary text-xs py-1.5"><CheckCircle size={14} className="inline mr-1" /> Approve</button>
                      <button onClick={() => rejectListing(listing._id)} className="btn-outline text-xs py-1.5 text-red-600"><XCircle size={14} className="inline mr-1" /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "listings" && (
        <div className="card-glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Listings ({pendingListings.length})</h2>
          {pendingListings.length === 0 ? (
            <div className="text-center py-12 text-ink/60"><CheckCircle size={48} className="mx-auto mb-4 text-moss/50" /><p>No pending listings to review</p></div>
          ) : (
            <div className="space-y-4">
              {pendingListings.map((listing) => (
                <div key={listing._id} className="p-4 rounded-2xl bg-white border border-ink/10">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 rounded-xl bg-ink/5 overflow-hidden flex-shrink-0">
                      {listing.images?.[0] ? <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-ink/40">No img</div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{listing.title}</h3>
                          <p className="text-sm text-ink/60 mt-1">{listing.species} {listing.breed && `• ${listing.breed}`} • {listing.ageMonths} months • {listing.gender}</p>
                          <p className="text-sm font-medium text-ember mt-1">₹{listing.price} {listing.negotiable && "(Negotiable)"}</p>
                          <p className="text-xs text-ink/50 mt-1">Location: {listing.location?.city}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => approveListing(listing._id)} className="btn-primary"><CheckCircle size={16} className="inline mr-1" /> Approve</button>
                          <button onClick={() => rejectListing(listing._id)} className="btn-outline text-red-600 hover:bg-red-50"><XCircle size={16} className="inline mr-1" /> Reject</button>
                        </div>
                      </div>
                      {listing.healthNotes && <div className="mt-3 p-3 rounded-xl bg-ink/5"><p className="text-xs font-semibold mb-1">Health Notes:</p><p className="text-sm text-ink/70">{listing.healthNotes}</p></div>}
                      <div className="mt-2 flex items-center gap-2 text-xs text-ink/50"><Clock size={12} />Listed {new Date(listing.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "reports" && (
        <div className="card-glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-4">Reported Listings ({reports.length})</h2>
          {reports.length === 0 ? (
            <div className="text-center py-12 text-ink/60"><CheckCircle size={48} className="mx-auto mb-4 text-moss/50" /><p>No pending reports</p></div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report._id} className="p-4 rounded-2xl bg-white border border-ink/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${report.reason === "scam" ? "bg-red-100 text-red-700" : report.reason === "fake" ? "bg-amber-100 text-amber-700" : "bg-ink/10 text-ink/70"}`}>{report.reason}</span>
                        <span className="text-xs text-ink/50">Reported by {report.reporterId?.name || "Anonymous"}</span>
                      </div>
                      {report.listingId && <div><p className="font-medium">{report.listingId.title}</p><p className="text-sm text-ink/60">₹{report.listingId.price} • {report.listingId.species}</p></div>}
                      {report.description && <p className="text-sm text-ink/70 mt-2 p-2 rounded-lg bg-ink/5">{report.description}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => resolveReport(report._id, "resolved")} className="btn-primary text-xs py-1.5"><CheckCircle size={14} className="inline mr-1" /> Resolved</button>
                      <button onClick={() => resolveReport(report._id, "dismissed")} className="btn-outline text-xs py-1.5">Dismiss</button>
                      {report.listingId && <a href={`/listing/${report.listingId._id}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-1.5"><Eye size={14} className="inline mr-1" /> View</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="card-glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-4">All Users ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/10">
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-ink/60">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-ink/60">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-ink/60">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-ink/60">Verified</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-ink/60">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-ink/5 hover:bg-ink/2">
                    <td className="py-3 px-4"><div><p className="font-medium">{user.name || "User"}</p><p className="text-xs text-ink/50">{user.email}</p></div></td>
                    <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${user.role === "admin" ? "bg-ember/10 text-ember" : user.role === "seller" ? "bg-moss/10 text-moss" : "bg-ink/10 text-ink/70"}`}>{user.role}</span></td>
                    <td className="py-3 px-4 text-sm text-ink/60">{user.city || "N/A"}</td>
                    <td className="py-3 px-4"><div className="flex gap-1">{user.verifiedEmail && <span className="text-xs text-moss" title="Email verified">✉️</span>}{user.verifiedPhone && <span className="text-xs text-moss" title="Phone verified">📱</span>}</div></td>
                    <td className="py-3 px-4 text-sm text-ink/60">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
