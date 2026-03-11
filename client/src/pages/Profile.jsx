import React, { useState } from "react";
import { useUser, useAuth } from "@clerk/react";
import { ArrowLeft, Save, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast.jsx";
import { authedRequest } from "../utils/request.js";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const toast = useToast();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      // Update Clerk profile
      await user.update({
        firstName,
        lastName
      });
      
      // Also update local database
      const fullName = [firstName, lastName].filter(Boolean).join(" ");
      await authedRequest(getToken, {
        method: "patch",
        url: "/api/users/profile",
        data: { name: fullName }
      });
      
      toast("Profile updated successfully!", "success");
      window.location.reload();
    } catch (err) {
      toast(err?.response?.data?.error || err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const switchToBuyer = async () => {
    try {
      setSaving(true);
      await authedRequest(getToken, {
        method: "patch",
        url: "/api/users/role",
        data: { role: "buyer" }
      });
      toast("Switched to buyer role! You can now request pets.", "success");
      window.location.reload();
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to switch role", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center">
        <p className="text-ink/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-ink mb-6 transition">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="card-glass rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-ink/10 flex items-center justify-center">
            <User size={24} className="text-ink/60" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Profile Settings</h1>
            <p className="text-sm text-ink/60">Update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold mb-2">First Name</label>
              <input
                type="text"
                className="input w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Last Name</label>
              <input
                type="text"
                className="input w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-ink/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Email</p>
                <p className="text-xs text-ink/50">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 p-4 rounded-2xl bg-ink/5">
          <h3 className="text-sm font-semibold mb-2">Why update your profile?</h3>
          <ul className="text-xs text-ink/60 space-y-1">
            <li>• Buyers trust sellers with real names</li>
            <li>• Your name appears on all listings</li>
            <li>• Helps build reputation and reviews</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
