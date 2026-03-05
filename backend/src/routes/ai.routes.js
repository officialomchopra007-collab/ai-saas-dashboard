const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const User = require("../models/user.model");
const Chat = require("../models/Chat.model");
const Session = require("../models/ChatSession.model");
const authMiddleware = require("../middleware/auth.middleware");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



/* =========================
   CREATE SESSION
========================= */

router.post("/session", authMiddleware, async (req, res) => {

  const session = await Session.create({
    userId: req.user.id,
    title: "New Chat"
  });

  res.json({
    success: true,
    session
  });

});



/* =========================
   CHAT ENGINE
========================= */

router.post("/chat", authMiddleware, async (req, res) => {

  try {

    const { message, sessionId } = req.body;

    const user = await User.findById(req.user.id);

    if (user.credits <= 0) {
      return res.status(403).json({
        message: "No credits remaining. Upgrade your plan 🚀"
      });
    }


    const session = await Session.findById(sessionId);

    const previousMessages = await Chat.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(10);


    const formattedHistory = previousMessages
      .reverse()
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));


    formattedHistory.push({
      role: "user",
      content: message
    });


    let aiReply;

    try {

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: formattedHistory
      });

      aiReply = completion.choices[0].message.content;

    } catch {

      aiReply = `🤖 (Fallback AI Mode)

Based on your request: "${message}"

Here is a structured startup idea:

• Target Market: Indian urban youth
• Business Model: Subscription-based SaaS
• Tech Stack: AI + Mobile App
• Scalability: Cloud-native infrastructure
• Monetization: Freemium → Paid Pro tier

(Real AI response disabled due to quota)`;

    }


    await Chat.create({
      sessionId,
      userId: req.user.id,
      role: "user",
      content: message
    });


    await Chat.create({
      sessionId,
      userId: req.user.id,
      role: "assistant",
      content: aiReply
    });


    if (session.title === "New Chat") {
      session.title = message.substring(0, 30);
      await session.save();
    }


    user.credits -= 1;
    user.totalMessages += 1;

    await user.save();


    res.json({
      success: true,
      reply: aiReply
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "AI Context Engine Error ❌"
    });

  }

});



/* =========================
   HISTORY
========================= */

router.get("/history/:sessionId", authMiddleware, async (req, res) => {

  const chats = await Chat.find({
    sessionId: req.params.sessionId,
    userId: req.user.id
  }).sort({ createdAt: 1 });

  res.json({
    success: true,
    chats
  });

});



/* =========================
   LIST SESSIONS
========================= */

router.get("/sessions", authMiddleware, async (req, res) => {

  const sessions = await Session.find({
    userId: req.user.id
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    sessions
  });

});



/* =========================
   DELETE SESSION
========================= */

router.delete("/session/:id", authMiddleware, async (req, res) => {

  await Session.deleteOne({
    _id: req.params.id,
    userId: req.user.id
  });

  await Chat.deleteMany({
    sessionId: req.params.id
  });

  res.json({
    success: true
  });

});



module.exports = router;