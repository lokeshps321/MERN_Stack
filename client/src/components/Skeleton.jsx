import React from "react";

export function SkeletonCard() {
  return (
    <div className="card-glass animate-pulse overflow-hidden rounded-3xl shadow-premium">
      <div className="h-44 w-full bg-ink/5" />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded-full bg-ink/10" />
          <div className="h-4 w-16 rounded-full bg-ink/10" />
        </div>
        <div className="h-3 w-24 rounded-full bg-ink/10" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded-full bg-ink/10" />
          <div className="h-3 w-14 rounded-full bg-ink/10" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-2xl border border-ink/10 px-4 py-4">
      <div className="space-y-2">
        <div className="h-4 w-36 rounded-full bg-ink/10" />
        <div className="h-3 w-24 rounded-full bg-ink/10" />
      </div>
      <div className="h-8 w-20 rounded-full bg-ink/10" />
    </div>
  );
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 rounded-full bg-ink/10" style={{ width: `${85 - i * 15}%` }} />
      ))}
    </div>
  );
}
