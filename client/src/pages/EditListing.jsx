import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { CheckCircle2, ImagePlus, Loader2, ArrowLeft, X } from "lucide-react";
import { useLocalUser } from "../utils/localUser.jsx";
import { authedRequest } from "../utils/request.js";
import { useToast } from "../components/Toast.jsx";
import { getImageUrl } from "../api/client.js";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { localUser } = useLocalUser();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedExisting, setRemovedExisting] = useState([]);

  const [form, setForm] = useState({
    title: "",
    species: "Dog",
    breed: "",
    ageMonths: "",
    gender: "unknown",
    vaccinated: false,
    price: "",
    negotiable: false,
    healthNotes: "",
    city: "",
    lat: "",
    lng: ""
  });

  useEffect(() => {
    if (!localUser || !id) return;
    if (localUser.role !== "seller" && localUser.role !== "admin") {
      toast("Only sellers can edit listings", "error");
      navigate("/dashboard");
      return;
    }
    loadListing();
  }, [id, localUser]);

  const loadListing = async () => {
    try {
      const res = await authedRequest(getToken, { method: "get", url: `/api/listings/${id}` });
      const listing = res.data.listing;

      // Check ownership - localUser uses 'id' not '_id'
      const sellerId = listing.sellerId?._id?.toString();
      const userId = localUser.id?.toString();
      const isOwner = sellerId === userId;
      const isAdmin = localUser.role === "admin";

      if (!isOwner && !isAdmin) {
        toast("You can only edit your own listings", "error");
        navigate("/dashboard");
        return;
      }

      setForm({
        title: listing.title || "",
        species: listing.species || "Dog",
        breed: listing.breed || "",
        ageMonths: listing.ageMonths ?? "",
        gender: listing.gender || "unknown",
        vaccinated: listing.vaccinated || false,
        price: listing.price || "",
        negotiable: listing.negotiable || false,
        healthNotes: listing.healthNotes || "",
        city: listing.location?.city || "",
        lat: listing.location?.coordinates?.[1] || "",
        lng: listing.location?.coordinates?.[0] || ""
      });
      setExistingImages(listing.images || []);
    } catch (err) {
      console.error("Failed to load listing:", err);
      const errorMsg = err?.response?.data?.error || "Failed to load listing";
      toast(`${errorMsg} (ID: ${id})`, "error");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 6 - existingImages.length + removedExisting.length - images.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (filesToAdd.length < files.length) {
      toast(`Maximum ${6 - existingImages.length + removedExisting.length} images allowed`, "error");
    }
    
    setImages((prev) => [...prev, ...filesToAdd]);
    const newPreviews = filesToAdd.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setRemovedExisting((prev) => [...prev, existingImages[index]]);
  };

  const restoreExistingImage = (index) => {
    setRemovedExisting((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      
      Object.keys(form).forEach((k) => {
        if (form[k] !== "" && form[k] !== null && form[k] !== undefined) {
          data.append(k, form[k]);
        }
      });

      // Append remaining existing images
      const remainingExisting = existingImages.filter((_, idx) => !removedExisting.includes(existingImages[idx]));
      if (remainingExisting.length > 0) {
        data.append("existingImages", JSON.stringify(remainingExisting));
      }

      // Append new image files
      images.forEach((f) => data.append("images", f));

      await authedRequest(getToken, {
        method: "patch",
        url: `/api/listings/${id}`,
        data,
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccess(true);
      toast("Listing updated! Pending review.", "success");
    } catch (err) {
      console.error("Update failed:", err);
      toast(err?.response?.data?.error || "Failed to update listing", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-ink/60 animate-pulse">Loading listing...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card-glass flex flex-col items-center justify-center rounded-[32px] p-16 text-center animate-scale-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-moss/10 text-moss mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold">Listing Updated!</h2>
        <p className="mt-2 text-ink/60 max-w-sm">
          Your changes have been saved. The listing will be reviewed again before going live.
        </p>
        <div className="mt-8 flex gap-4">
          <button onClick={() => { setSuccess(false); }} className="btn-outline">Edit Again</button>
          <Link to="/dashboard" className="btn-primary">View Dashboard</Link>
        </div>
      </div>
    );
  }

  const remainingImageSlots = 6 - existingImages.length + removedExisting.length - images.length;

  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-ink mb-2 transition">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold">Edit Listing</h1>
          <p className="mt-1 text-sm text-ink/60">Update your pet listing details.</p>
        </div>
      </div>

      <form onSubmit={submit} className="card-glass rounded-[32px] p-8 space-y-8">
        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <label className="mb-3 block text-sm font-semibold text-ink/80">Current Photos</label>
            <div className="flex flex-wrap gap-4">
              {existingImages.map((img, i) => {
                const isRemoved = removedExisting.includes(img);
                if (isRemoved) return null;
                return (
                  <div key={i} className="relative h-24 w-24 overflow-hidden rounded-2xl border border-ink/10 animate-scale-in">
                    <img src={getImageUrl(img)} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
                      title="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* New Images */}
        {previews.length > 0 && (
          <div>
            <label className="mb-3 block text-sm font-semibold text-ink/80">New Photos to Add</label>
            <div className="flex flex-wrap gap-4">
              {previews.map((p, i) => (
                <div key={i} className="relative h-24 w-24 overflow-hidden rounded-2xl border border-ink/10 animate-scale-in">
                  <img src={p} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add More Images */}
        {remainingImageSlots > 0 && (
          <div>
            <label className="mb-3 block text-sm font-semibold text-ink/80">
              Add More Photos (Max {6 - existingImages.length + removedExisting.length} total)
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 text-ink/40 transition hover:border-ember hover:bg-ember/5 hover:text-ember">
                <ImagePlus size={24} />
                <span className="mt-1 text-[10px] font-semibold uppercase">Add Photo</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Title</label>
            <input
              required
              className="input"
              placeholder="e.g. Playful Golden Retriever Puppy"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Species</label>
            <select
              className="input"
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
            >
              {["Dog", "Cat", "Bird", "Rabbit", "Other"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Breed</label>
            <input
              className="input"
              placeholder="e.g. Golden Retriever"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Age (months)</label>
            <input
              type="number"
              className="input"
              placeholder="0"
              value={form.ageMonths}
              onChange={(e) => setForm({ ...form, ageMonths: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Gender</label>
            <select
              className="input"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Price (₹)</label>
            <input
              required
              type="number"
              className="input"
              placeholder="20000"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Location (City)</label>
            <input
              required
              className="input"
              placeholder="Bangalore"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Description & Health Notes</label>
            <textarea
              className="input min-h-[120px] resize-y py-3"
              placeholder="Describe the pet's personality, health history, and any special requirements..."
              value={form.healthNotes}
              onChange={(e) => setForm({ ...form, healthNotes: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl bg-ink/[0.03] p-6 border border-ink/5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-ink/20 text-ember focus:ring-ember"
              checked={form.vaccinated}
              onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })}
            />
            <span className="text-sm font-semibold text-ink/80">Pet is vaccinated</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-ink/20 text-ember focus:ring-ember"
              checked={form.negotiable}
              onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
            />
            <span className="text-sm font-semibold text-ink/80">Price is negotiable</span>
          </label>
        </div>

        <div className="pt-4 border-t border-ink/10 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto px-10">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Changes"}
          </button>
        </div>

        <p className="text-xs text-ink/50 text-center pt-4 border-t border-ink/10">
          ⚠️ After saving, your listing will be reviewed again before going live.
        </p>
      </form>
    </div>
  );
}
