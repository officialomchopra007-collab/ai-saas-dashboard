const Session = require("../models/Session");

exports.createSession = async (req, res) => {
  try {

    const session = await Session.create({
      user: req.user.id,
      title: "New Chat",
      messages: []
    });

    res.json({
      success: true,
      session
    });

  } catch (err) {
    res.status(500).json({message:"Server error"});
  }
};



exports.getSessions = async (req, res) => {

  try{

    const sessions = await Session.find({
      user:req.user.id
    }).sort({createdAt:-1});

    res.json({
      success:true,
      sessions
    });

  }catch(err){
    res.status(500).json({message:"Server error"});
  }

};



exports.chat = async (req, res) => {

  try{

    const {message, sessionId} = req.body;

    const session = await Session.findById(sessionId);

    if(!session){
      return res.status(404).json({message:"Session not found"});
    }

    // Save user message
    session.messages.push({
      role:"user",
      text:message
    });

    // Auto title if first message
    if(session.messages.length === 1){
      session.title = message.slice(0,40);
    }

    // Fallback AI response
    const aiReply =
      `🤖 (Fallback AI Mode) Based on your request: "${message}" 
Here is a structured startup idea:
• Target Market: Indian urban youth
• Business Model: Subscription-based SaaS
• Tech Stack: AI + Mobile App
• Scalability: Cloud-native infrastructure
• Monetization: Freemium → Paid Pro tier
(Real AI response disabled due to quota)`;

    session.messages.push({
      role:"ai",
      text:aiReply
    });

    await session.save();

    res.json({
      success:true,
      reply:aiReply
    });

  }catch(err){
    res.status(500).json({message:"Server error"});
  }

};