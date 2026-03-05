const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role:String,
  text:String
});

const sessionSchema = new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  title:{
    type:String,
    default:"New Chat"
  },

  messages:[messageSchema]

},{
  timestamps:true
});

module.exports = mongoose.model("Session",sessionSchema);