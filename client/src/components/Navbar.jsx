import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { PawPrint, Menu, X, Bell, Heart } from "lucide-react";
import { UserButton, useAuth } from "@clerk/react";
import { useLocalUser } from "../utils/localUser.jsx";
import { authedRequest } from "../utils/request.js";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 text-sm font-semibold transition ${isActive ? "text-ember" : "text-ink/70 hover:text-ink"}`;

export default function Navbar() {
  const { localUser } = useLocalUser();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (localUser?.role === "admin") {
      authedRequest(getToken, { method: "get", url: "/api/admin/stats" })
        .then((res) => setPendingCount(res.data.pendingListings || 0))
        .catch(() => {});
    }
  }, [localUser, getToken]);

  return (
    <header className="sticky top-0 z-40 bg-sand/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 lg:px-16">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sand">
            <PawPrint size={20} />
          </span>
          PetCare
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/browse" className={navLinkClass}>Browse</NavLink>
          {localUser?.role === "seller" && <NavLink to="/sell" className={navLinkClass}>Sell</NavLink>}
          {localUser?.role === "buyer" && (
            <NavLink to="/wishlist" className={navLinkClass}>
              <Heart size={16} /> Wishlist
            </NavLink>
          )}
          {localUser && (
            <NavLink to="/dashboard" className={navLinkClass}>
              {localUser.role === "admin" ? (
                <>
                  Admin Panel
                  {pendingCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ember text-[10px] text-white">
                      {pendingCount}
                    </span>
                  )}
                </>
              ) : "Dashboard"}
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {isLoaded && !isSignedIn && (
            <Link to="/auth" className="btn-outline">Login</Link>
          )}
          {isLoaded && isSignedIn && (
            <UserButton afterSignOutUrl="/" />
          )}
          <Link to="/browse" className="btn-primary hidden sm:inline-flex">Explore</Link>
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-ink/10 bg-sand px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/browse" className={navLinkClass} onClick={() => setMobileOpen(false)}>Browse</NavLink>
            {localUser?.role === "seller" && <NavLink to="/sell" className={navLinkClass} onClick={() => setMobileOpen(false)}>Sell</NavLink>}
            {localUser?.role === "buyer" && (
              <NavLink to="/wishlist" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                <Heart size={16} /> Wishlist
              </NavLink>
            )}
            {localUser && (
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                {localUser.role === "admin" ? (
                  <>
                    Admin Panel
                    {pendingCount > 0 && (
                      <span className="flex h-5 px-1.5 items-center justify-center rounded-full bg-ember text-[10px] text-white">
                        {pendingCount} pending
                      </span>
                    )}
                  </>
                ) : "Dashboard"}
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
