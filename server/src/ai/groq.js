import fetch from "node-fetch";

const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

const APP_KNOWLEDGE = `
**About PetCare App:**

PAYMENTS: PetCare does NOT handle payments directly. Buyers and sellers arrange payment offline (cash, UPI, bank transfer, etc.) when they meet. We recommend meeting in public places and verifying the pet before payment.

HOW IT WORKS:
1. Sellers create listings with photos, price, and pet details
2. Listings go to admin for approval (usually within 24 hours)
3. Buyers browse listings and click "Request to Buy" 
4. Seller receives the request and can accept/reject
5. Once accepted, buyer and seller can chat via Messages
6. They meet in person, verify the pet, and complete payment offline
7. Seller marks the request as "completed" after successful sale

REQUESTS: 
- Click "Request to Buy" on a listing to show interest
- Sellers can accept, reject, or mark as completed
- Only completed requests can leave reviews
- Buyers can cancel pending requests

MESSAGING:
- Chat is only available after seller accepts your request
- Messages are tied to each request
- Both parties can see full conversation history

REVIEWS & RATINGS:
- Only buyers can leave reviews after completed transactions
- Ratings are 1-5 stars with optional comment
- Reviews appear on seller's profile permanently
- One review per transaction (cannot be changed)

REPORTING:
- Click "Report this listing" to flag suspicious content
- Reasons: scam, fake, inappropriate, sold, duplicate, other
- Listings with 5+ reports are auto-hidden
- Admin reviews all reports

LISTING EXPIRY:
- Listings automatically expire after 60 days
- Expired listings are archived (not visible in search)
- Sellers can re-list if pet is still available

SAFETY TIPS:
- Always meet in public places
- Bring a friend or family member
- Verify pet health before payment
- Check seller reviews and ratings
- Never pay in advance without seeing the pet
- Report suspicious listings immediately

VERIFICATION:
- Verified phone badge means seller's phone is confirmed
- Email verification required for all users
- Admin approval required for all new listings

PRICING:
- Sellers set their own prices
- "Negotiable" badge means price can be discussed
- PetCare doesn't take commission or handle payments
`;

const SYSTEM_PROMPT = `You are the PetCare marketplace assistant. You help users with questions about:
1. Buying and selling pets on this platform
2. How the PetCare app works (payments, requests, messaging, reviews)
3. Safety tips and platform policies
4. Listing guidance and pricing advice

${APP_KNOWLEDGE}

Strict rules:
- Use the app knowledge above to answer questions about how PetCare works
- If asked about payments, clearly state that PetCare does NOT handle payments - users arrange offline
- If the user asks about anything outside the pet marketplace scope, refuse briefly and redirect to marketplace help
- Do not provide medical, legal, or veterinary advice
- Do not generate or suggest illegal activity
- Keep answers concise, practical, and polite
- For technical issues, suggest contacting support`;

const IN_SCOPE_KEYWORDS = [
  "listing",
  "sell",
  "buy",
  "price",
  "breed",
  "pet",
  "pets",
  "puppy",
  "puppies",
  "kitten",
  "kittens",
  "adopt",
  "adoption",
  "marketplace",
  "seller",
  "buyer",
  "request",
  "chat",
  "pickup",
  "policy",
  "safety",
  "available",
  "find",
  "search",
  "payment",
  "pay",
  "money",
  "how to",
  "how does",
  "review",
  "rating",
  "report",
  "message",
  "verification",
  "approve",
  "expired"
];

export function isInScope(message) {
  const text = message.toLowerCase();
  return IN_SCOPE_KEYWORDS.some((word) => text.includes(word));
}

export async function chatWithGroq(userMessage) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.3,
      max_tokens: 400,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Groq API error: ${response.status} ${body}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "";
  return content.trim();
}
