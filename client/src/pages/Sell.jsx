import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { CheckCircle2, ImagePlus, Loader2, ArrowLeft } from "lucide-react";
import { authedRequest } from "../utils/request.js";
import { useToast } from "../components/Toast.jsx";
import { useLocalUser } from "../utils/localUser.jsx";

export default function Sell() {
  const { getToken } = useAuth();
  const { localUser } = useLocalUser();
  const navigate = useNavigate();
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
    title: "", species: "Dog", breed: "", ageMonths: "", gender: "unknown",
    vaccinated: false, price: "", negotiable: false, healthNotes: "",
    city: "", lat: 12.9716, lng: 77.5946
  });

  if (localUser && localUser.role !== "seller" && localUser.role !== "admin") {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center animate-scale-in">
        <h2 className="text-xl font-semibold">You need to be a seller</h2>
        <p className="mt-2 text-sm text-ink/60">Update your role in the dashboard to create listings.</p>
        <Link to="/dashboard" className="btn-primary mt-6 inline-flex">Go to Dashboard</Link>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // Max 4 images
    setImages(files);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      Object.keys(form).forEach(k => data.append(k, form[k]));
      images.forEach(f => data.append("images", f));

      await authedRequest(getToken, {
        method: "post",
        url: "/api/listings",
        data,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess(true);
      toast("Listing created successfully! Pending admin review.", "success");
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to save listing", "error");
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="card-glass flex flex-col items-center justify-center rounded-[32px] p-16 text-center animate-scale-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-moss/10 text-moss mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold">Listing Submitted!</h2>
        <p className="mt-2 text-ink/60 max-w-sm">
          Your listing is now pending admin review. We'll verify the details to ensure community safety.
        </p>
        <div className="mt-8 flex gap-4">
          <button onClick={() => { setSuccess(false); setForm({...form, title: ""}); setImages([]); setPreviews([]); }} className="btn-outline">Add Another</button>
          <Link to="/dashboard" className="btn-primary">View Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-ink mb-2 transition">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold">List a Pet</h1>
          <p className="mt-1 text-sm text-ink/60">Fill in the details to find them a new home.</p>
        </div>
      </div>

      <form onSubmit={submit} className="card-glass rounded-[32px] p-8 space-y-8">
        {/* Images */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-ink/80">Photos (Max 4)</label>
          <div className="flex flex-wrap gap-4">
            {previews.map((p, i) => (
              <div key={i} className="h-24 w-24 overflow-hidden rounded-2xl border border-ink/10 animate-scale-in">
                <img src={p} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {previews.length < 4 && (
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 text-ink/40 transition hover:border-ember hover:bg-ember/5 hover:text-ember cursor-pointer">
                <ImagePlus size={24} />
                <span className="mt-1 text-[10px] font-semibold uppercase">Add Photo</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Title</label>
            <input required className="input" placeholder="e.g. Playful Golden Retriever Puppy" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Species</label>
            <select className="input" value={form.species} onChange={e => setForm({...form, species: e.target.value})}>
              {["Dog", "Cat", "Bird", "Rabbit", "Other"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Breed</label>
            <input className="input" placeholder="e.g. Golden Retriever" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Age (months)</label>
            <input type="number" className="input" placeholder="0" value={form.ageMonths} onChange={e => setForm({...form, ageMonths: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Gender</label>
            <select className="input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Price (₹)</label>
            <input required type="number" className="input" placeholder="20000" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Location (City)</label>
            <input required className="input" placeholder="Bangalore" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-ink/80 mb-1.5 block">Description & Health Notes</label>
            <textarea className="input min-h-[120px] resize-y py-3" placeholder="Describe the pet's personality, health history, and any special requirements..." value={form.healthNotes} onChange={e => setForm({...form, healthNotes: e.target.value})}></textarea>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl bg-ink/[0.03] p-6 border border-ink/5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="h-5 w-5 rounded border-ink/20 text-ember focus:ring-ember" checked={form.vaccinated} onChange={e => setForm({...form, vaccinated: e.target.checked})} />
            <span className="text-sm font-semibold text-ink/80">Pet is vaccinated</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="h-5 w-5 rounded border-ink/20 text-ember focus:ring-ember" checked={form.negotiable} onChange={e => setForm({...form, negotiable: e.target.checked})} />
            <span className="text-sm font-semibold text-ink/80">Price is negotiable</span>
          </label>
        </div>

        <div className="pt-4 border-t border-ink/10 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto px-10">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
