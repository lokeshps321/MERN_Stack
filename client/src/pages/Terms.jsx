import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-ink mb-6 transition">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <div className="card-glass rounded-3xl p-8">
        <h1 className="text-3xl font-semibold mb-6">Terms of Service</h1>
        <div className="prose prose-sm max-w-none text-ink/70 space-y-4">
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using PetCare, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Use License</h2>
          <p>PetCare grants you a limited, non-exclusive, non-transferable license to use the platform for browsing and listing pets.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide accurate information in listings</li>
            <li>Do not post fraudulent or misleading content</li>
            <li>Respect other users and communicate professionally</li>
            <li>Comply with all applicable laws regarding pet sales</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Payment Disclaimer</h2>
          <p>PetCare does NOT handle payments. All transactions are arranged directly between buyers and sellers. We recommend meeting in public places and verifying pets before payment.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Listing Expiry</h2>
          <p>Listings automatically expire after 60 days and are archived. Sellers can re-list if the pet is still available.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Prohibited Conduct</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Selling illegal or prohibited animals</li>
            <li>Misrepresenting pet health or breed</li>
            <li>Harassing other users</li>
            <li>Posting spam or commercial advertisements</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">8. Disclaimer</h2>
          <p>PetCare is a marketplace platform only. We do not guarantee the quality, safety, or legality of listed items. Users are responsible for their own transactions.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact</h2>
          <p>For questions about these Terms, contact us at support@petcare.local</p>
        </div>
      </div>
    </div>
  );
}
