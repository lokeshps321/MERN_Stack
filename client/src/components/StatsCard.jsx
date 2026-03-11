import React, { useEffect, useState } from "react";

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
}

export default function StatsCard({ icon: Icon, value, label, color = "text-ember", suffix = "" }) {
  const animatedValue = useCountUp(typeof value === "number" ? value : 0);
  const displayVal = typeof value === "number" ? animatedValue : value;

  return (
    <div className="card-glass group flex items-center gap-4 rounded-3xl p-6 transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5">
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5 ${color} transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={22} />
      </span>
      <div>
        <p className="text-2xl font-bold tabular-nums">{displayVal}{suffix}</p>
        <p className="text-xs text-ink/60">{label}</p>
      </div>
    </div>
  );
}
