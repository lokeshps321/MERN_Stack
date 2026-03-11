import React from "react";
import { Link } from "react-router-dom";
import { PawPrint, Heart } from "lucide-react";
import { useAuth } from "@clerk/react";

export default function Footer() {
  const { isSignedIn } = useAuth();

  return (
    <footer className="border-t border-ink/10 bg-white/50 px-6 py-10 lg:px-16">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-3 text-lg font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sand">
              <PawPrint size={16} />
            </span>
            PetCare
          </Link>
          <p className="mt-3 text-sm text-ink/50 leading-relaxed">
            Local pet marketplace built for safer, transparent pet exchanges.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-ink/60">
            <Link to="/browse" className="hover:text-ink transition">Browse Listings</Link>
            {!isSignedIn ? (
              <Link to="/auth" className="hover:text-ink transition">Sign In / Sign Up</Link>
            ) : (
              <Link to="/dashboard" className="hover:text-ink transition">Dashboard</Link>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Info</h4>
          <div className="flex flex-col gap-2 text-sm text-ink/60">
            <span>Local pickup only</span>
            <span>Admin-reviewed listings</span>
            <span>AI-powered assistant</span>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2 border-t border-ink/10 pt-6 text-xs text-ink/40">
        <p className="flex items-center gap-1">Made with <Heart size={12} className="text-ember" /> for pets</p>
        <p>© {new Date().getFullYear()} PetCare Marketplace</p>
      </div>
    </footer>
  );
}
