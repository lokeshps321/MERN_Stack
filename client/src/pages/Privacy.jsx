import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-ink mb-6 transition">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <div className="card-glass rounded-3xl p-8">
        <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none text-ink/70 space-y-4">
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Email address (required for registration)</li>
            <li>Name and location (for profiles and listings)</li>
            <li>Phone number (optional, for verification)</li>
            <li>Listing information (photos, descriptions, prices)</li>
            <li>Messages between buyers and sellers</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To operate and maintain the marketplace</li>
            <li>To process your listings and transactions</li>
            <li>To communicate with you about the platform</li>
            <li>To detect and prevent fraud</li>
            <li>To improve our services</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Information Sharing</h2>
          <p>We do NOT sell your personal information. We share information only when:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Required by law or legal process</li>
            <li>To enforce our Terms of Service</li>
            <li>With your explicit consent</li>
            <li>Between buyers and sellers for transaction purposes</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
          <p>We implement security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookies</h2>
          <p>We use cookies to enhance your experience. You can disable cookies in your browser settings.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Third-Party Services</h2>
          <p>We use Clerk for authentication and Groq for AI assistance. These services have their own privacy policies.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">8. Children's Privacy</h2>
          <p>PetCare is not intended for children under 18. We do not knowingly collect information from children.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy. We will notify you of significant changes via email or platform notice.</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">10. Contact Us</h2>
          <p>For privacy concerns, contact us at privacy@petcare.local</p>
        </div>
      </div>
    </div>
  );
}
