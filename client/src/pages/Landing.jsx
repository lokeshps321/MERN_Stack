import React from "react";
import { ArrowRight, Heart, MapPin, MessageCircle, PawPrint, Shield, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";

export default function Landing() {
  const { isSignedIn } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden rounded-[36px] p-10 shadow-premium md:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-ember/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blush/30 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="badge">
              <Sparkles size={14} /> Premium Pet Marketplace
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
              Find your perfect <span className="text-ember">companion</span> today.
            </h1>
            <p className="max-w-lg text-base text-ink/70 md:text-lg">
              Curated listings, verified sellers, and a guided workflow for safer pet transfers. Local pickup only for a personal, transparent exchange.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/browse" className="btn-primary group">
                Browse Listings <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              {!isSignedIn && (
                <Link to="/auth" className="btn-outline">Get Started</Link>
              )}
              {isSignedIn && (
                <Link to="/dashboard" className="btn-outline">My Dashboard</Link>
              )}
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-ink/60">
              <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-moss" /> Admin-reviewed</span>
              <span className="flex items-center gap-2"><Shield size={16} className="text-moss" /> Phone verified</span>
              <span className="flex items-center gap-2"><MapPin size={16} className="text-ember" /> Local only</span>
            </div>
          </div>
          <div className="card-glass rounded-[32px] p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember/10 text-ember">
                <PawPrint size={24} />
              </span>
              <div>
                <h2 className="text-xl font-semibold">How it works</h2>
                <p className="text-xs text-ink/50">Simple, safe process</p>
              </div>
            </div>
            <ol className="mt-6 space-y-4 text-sm text-ink/70">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ember text-xs font-bold text-white">1</span>
                Sellers create a listing with details and photos.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ember text-xs font-bold text-white">2</span>
                Admin reviews for safety and accuracy.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ember text-xs font-bold text-white">3</span>
                Buyers request to purchase and chat with sellers.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ember text-xs font-bold text-white">4</span>
                Meet locally and complete the exchange safely.
              </li>
            </ol>
            <div className="mt-6 rounded-2xl bg-ink/5 p-4 text-xs text-ink/60">
              <span className="font-semibold text-ink/80">🔒 Safety first:</span> Payments are not handled in-app. Meet in public places for exchanges.
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-6 sm:grid-cols-3">
        {[
          { icon: Heart, value: "100%", label: "Verified Listings", color: "text-ember" },
          { icon: Users, value: "Safe", label: "Local Exchanges", color: "text-moss" },
          { icon: Star, value: "AI", label: "Smart Assistant", color: "text-ember" }
        ].map((stat) => (
          <div key={stat.label} className="card-glass flex items-center gap-4 rounded-3xl p-6 transition hover:shadow-premium">
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5 ${stat.color}`}>
              <stat.icon size={22} />
            </span>
            <div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-ink/60">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="rounded-[36px] border border-ink/10 bg-white p-10 md:p-14">
        <div className="text-center">
          <span className="badge"><Sparkles size={14} /> Built for trust</span>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Why PetCare?</h2>
          <p className="mt-3 text-sm text-ink/60">Every feature designed to make pet exchange safe and transparent.</p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Admin Review", desc: "Every listing is manually reviewed before going live to ensure quality and safety." },
            { icon: MessageCircle, title: "In-App Chat", desc: "Communicate directly with buyers/sellers through our built-in messaging system." },
            { icon: MapPin, title: "Local Pickup", desc: "Every exchange happens locally. Meet in person for a transparent, safe handoff." },
            { icon: Shield, title: "Verified Sellers", desc: "Phone verification for sellers adds an extra layer of accountability." },
            { icon: Star, title: "AI Assistant", desc: "Built-in AI helps you with questions about listings, pricing, and the marketplace." },
            { icon: Heart, title: "Pet-First", desc: "Our platform prioritizes the well-being of animals above all else." }
          ].map((feature) => (
            <div key={feature.title} className="group rounded-2xl border border-ink/5 p-6 transition hover:border-ember/20 hover:shadow-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember/10 text-ember transition group-hover:bg-ember group-hover:text-white">
                <feature.icon size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink/60 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero rounded-[36px] p-10 text-center shadow-premium md:p-14">
        <h2 className="text-3xl font-semibold md:text-4xl">Ready to find your new best friend?</h2>
        <p className="mt-3 text-sm text-ink/60">Join PetCare and start browsing verified listings in your city.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/browse" className="btn-primary group">
            Explore Now <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </Link>
          {!isSignedIn && (
            <Link to="/auth" className="btn-outline">Create Account</Link>
          )}
        </div>
      </section>
    </div>
  );
}
