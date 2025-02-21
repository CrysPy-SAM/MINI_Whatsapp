const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
        console.log("MongoDB Connection Successful");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

main();

app.get("/", async (req, res) => {
    try {
        const chats = await Chat.find().sort({ created_at: -1 });
        res.render("index", { chats });
    } catch (error) {
        console.error("Error rendering index:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/add-chat", async (req, res) => {
    try {
        const { from, to, message } = req.body;
        if (!from || !to || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newChat = new Chat({ from, to, message });
        await newChat.save();
        res.json({ success: true, chat: newChat });
    } catch (error) {
        console.error("Error adding chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/edit-chat/:id", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message cannot be empty" });
        }
        const updatedChat = await Chat.findByIdAndUpdate(
            req.params.id,
            { message },
            { new: true }
        );
        if (!updatedChat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        res.json({ success: true, chat: updatedChat });
    } catch (error) {
        console.error("Error updating chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Fixed Delete Route
app.delete("/delete-chat/:id", async (req, res) => {
    try {
        const deletedChat = await Chat.findByIdAndDelete(req.params.id);
        if (!deletedChat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        res.json({ success: true, message: "Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
