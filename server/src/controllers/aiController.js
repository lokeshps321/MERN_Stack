import { chatWithGroq, isInScope } from "../ai/groq.js";

export async function chat(req, res, next) {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message required" });
    }

    if (!isInScope(message)) {
      return res.json({
        reply: "I can only help with buying and selling pets on this marketplace. Ask about listings, pricing, safety, or how requests and chat work."
      });
    }

    const reply = await chatWithGroq(message);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
}
