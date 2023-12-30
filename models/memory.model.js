const mongoose = require("mongoose");

const MemorySchema = new mongoose.Schema({
  momoryownerid: {
      type: String,
      // required: true,
  },  
  momoryname: {
    type: String,
    default:'',
    // required: true,
  },
  
  memory: {
    type: String,
    default:'',
    required: true,
  },
  
  images: {
    type: [String],
    default:[],
  },
  audio: {
    type: String,
    default:'',
  },
});

const Memory = mongoose.model("Memory", MemorySchema);
module.exports = Memory;