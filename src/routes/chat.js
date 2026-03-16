const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require("../middlewares/auth");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Gemini connection setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// System prompt — AI ku "nee yaaru, enna pannanum" nu sollurom
const SYSTEM_PROMPT = `You are a helpful customer support assistant for CodeIO, an electronics e-commerce store.
You help customers with:
- Product information (mobiles, laptops, audio, tablets, watches, accessories)
- Order related queries
- Return and refund policies
- General shopping help

Rules:
- Keep answers short and friendly (2-3 sentences max)
- If you don't know something, say "I'll connect you with our support team"
- Don't make up product prices or availability
- Reply in the same language the user writes in (English, Tamil, Tanglish etc.)`;

// POST /api/chat
router.post(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const { message } = req.body;

    // Message illa na error
    if (!message) {
      throw new AppError("Message is required", 400);
    }

    // Chat start — system prompt history la kudukurom
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Understood! I'm the CodeIO customer support assistant. How can I help you today?",
            },
          ],
        },
      ],
    });

    // User message Gemini ku anuppum
    const result = await chat.sendMessage(message);

    // AI response edukum
    const reply = result.response.text();

    // Frontend ku anuppum
    res.json({
      success: true,
      data: {
        userMessage: message,
        aiReply: reply,
      },
    });
  })
);

module.exports = router;
