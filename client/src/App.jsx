import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RedirectToSignIn, useAuth } from "@clerk/react";
import Layout from "./components/Layout.jsx";
import Landing from "./pages/Landing.jsx";
import Browse from "./pages/Browse.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Sell from "./pages/Sell.jsx";
import EditListing from "./pages/EditListing.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Chat from "./pages/Chat.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import { useLocalUser } from "./utils/localUser.jsx";

function RequireAuth({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <div className="flex items-center justify-center py-20"><p className="text-sm text-ink/60 animate-pulse">Loading...</p></div>;
  if (!isSignedIn) return <RedirectToSignIn />;
  return children;
}

function RequireRole({ role, children }) {
  const { localUser, loading } = useLocalUser();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded || loading) return <div className="flex items-center justify-center py-20"><p className="text-sm text-ink/60 animate-pulse">Loading...</p></div>;
  if (!isSignedIn || !localUser) return <RedirectToSignIn />;
  if (localUser.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/sell" element={<RequireRole role="seller"><Sell /></RequireRole>} />
        <Route path="/edit-listing/:id" element={<RequireAuth><EditListing /></RequireAuth>} />
        <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />
        <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
        <Route path="/chat/:id" element={<RequireAuth><Chat /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
