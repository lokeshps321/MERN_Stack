import React from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import AIWidget from "./AIWidget.jsx";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-sand text-ink">
      <Navbar />
      <main className="flex-1 px-6 py-8 lg:px-16">{children}</main>
      <Footer />
      <AIWidget />
    </div>
  );
}
