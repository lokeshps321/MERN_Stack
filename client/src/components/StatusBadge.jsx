import React from "react";

const STYLES = {
  requested: "bg-amber-100 text-amber-700 border-amber-200",
  accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-600 border-red-200",
  completed: "bg-sky-100 text-sky-700 border-sky-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
  pending_review: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  sold: "bg-sky-100 text-sky-700 border-sky-200",
  draft: "bg-gray-100 text-gray-500 border-gray-200",
  archived: "bg-gray-100 text-gray-500 border-gray-200",
  buyer: "bg-sky-100 text-sky-700 border-sky-200",
  seller: "bg-emerald-100 text-emerald-700 border-emerald-200",
  admin: "bg-purple-100 text-purple-700 border-purple-200"
};

const LABELS = {
  pending_review: "Pending Review",
  requested: "Requested",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
  cancelled: "Cancelled",
  approved: "Approved",
  sold: "Sold",
  draft: "Draft",
  archived: "Archived",
  buyer: "Buyer",
  seller: "Seller",
  admin: "Admin"
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || "bg-gray-100 text-gray-500 border-gray-200";
  const label = LABELS[status] || status;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${style}`}>
      {label}
    </span>
  );
}
