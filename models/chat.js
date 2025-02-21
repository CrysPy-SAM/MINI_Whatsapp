const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

chatSchema.pre("save", function (next) {
    this.from = String(this.from || "").toUpperCase();
    this.to = String(this.to || "").toUpperCase();
    next();
});

module.exports = mongoose.model("Chat", chatSchema);
