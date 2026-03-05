const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAIResponse(messages) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a high-level AI business strategist for India. Give practical, scalable, modern ideas with execution clarity.",
        },
        ...messages,
      ],
    });

    return {
      success: true,
      content: completion.choices[0].message.content,
    };
  } catch (error) {
    console.error("OpenAI Error:", error.message);

    return {
      success: false,
      content:
        "🚀 Smart Business Idea for India: Launch an AI-powered WhatsApp automation agency helping local businesses automate leads, follow-ups, and customer support. Focus on Tier-2 cities for rapid growth.",
    };
  }
}

module.exports = generateAIResponse;