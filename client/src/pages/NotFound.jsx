import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-10 text-center">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 text-sm text-ink/60">Return to the marketplace home.</p>
      <Link to="/" className="btn-primary mt-4 inline-flex">Go Home</Link>
    </div>
  );
}
