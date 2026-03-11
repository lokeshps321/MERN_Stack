import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../api/client.js";
import ListingCard from "../components/ListingCard.jsx";
import { SkeletonCard } from "../components/Skeleton.jsx";

const speciesOptions = ["Dog", "Cat", "Bird", "Rabbit", "Other"];
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" }
];

export default function Browse() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ species: "", city: "", minPrice: "", maxPrice: "", sort: "newest" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const params = { ...activeFilters };
      if (search) params.search = search;
      const res = await api.get("/api/listings", { params });
      setListings(res.data.listings || []);
    } catch (err) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, [filters.species, filters.sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <section className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold">Browse Listings</h1>
        <p className="mt-1 text-sm text-ink/60">Find verified pets available in your area</p>
      </div>

      <form onSubmit={handleSearch} className="card-glass rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={16} className="text-ink/40" />
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/40">Filters</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <input className="input" placeholder="Search (breed, species, city...)" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={filters.species} onChange={(e) => setFilters({ ...filters, species: e.target.value })}>
            <option value="">All Species</option>
            {speciesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input className="input" placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          <input className="input" placeholder="Min ₹" type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          <input className="input" placeholder="Max ₹" type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          <select className="input" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="btn-primary"><Search size={16} /> Search</button>
          <button type="button" onClick={() => { setFilters({ species: "", city: "", minPrice: "", maxPrice: "", sort: "newest" }); setSearch(""); fetchListings(); }} className="btn-secondary">Clear</button>
        </div>
      </form>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && listings.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing, idx) => (
            <div key={listing._id} className={`animate-fade-in stagger-${Math.min(idx + 1, 6)}`}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}

      {!loading && listings.length === 0 && (
        <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center animate-scale-in">
          <Search size={40} className="mx-auto text-ink/20" />
          <h2 className="mt-4 text-xl font-semibold">No listings found</h2>
          <p className="mt-2 text-sm text-ink/50">Try changing your filters or check back soon.</p>
        </div>
      )}
    </section>
  );
}
