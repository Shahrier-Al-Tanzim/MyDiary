const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },
    token:{
        type: String,
        required: true,
      },
})

const token  = mongoose.model("Token", tokenSchema);
module.exports = token;