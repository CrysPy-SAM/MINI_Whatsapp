const mongoose = require("mongoose");
const Chat = require("./models/chat");

async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
        console.log("MongoDB Connected");

        await Chat.deleteMany({});
        
        let allChats = [
            { from: "Neha", to: "Priya", message: "Send me your exam sheets", created_at: new Date() },
            { from: "Rahul", to: "Aman", message: "Are we meeting tomorrow?", created_at: new Date() },
            { from: "Sneha", to: "Rohit", message: "Happy Birthday!", created_at: new Date() },
            { from: "Akash", to: "Divya", message: "Did you complete the assignment?", created_at: new Date() },
            { from: "Ravi", to: "Pankaj", message: "Let's go for a movie this weekend", created_at: new Date() }
        ];

        await Chat.insertMany(allChats);
        console.log("Chats Inserted Successfully");

        mongoose.connection.close();
    } catch (error) {
        console.error("MongoDB Error:", error);
    }
}

main();
