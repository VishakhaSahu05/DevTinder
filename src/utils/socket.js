const { Chat } = require("../models/chat");

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join a chat room
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log("Joining Room:", roomId);
      socket.join(roomId);
    });

    // Send message
    socket.on("sendMessage", async (data) => {
      try {
        const { senderId, receiverId, text, firstName, time } = data;
        const roomId = [senderId, receiverId].sort().join("_");

        console.log("Message received:", text, "-> Room:", roomId);

        let chat = await Chat.findOne({
          participants: { $all: [senderId, receiverId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [senderId, receiverId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId,
          text,
        });

        await chat.save();

        // Send to everyone in the room
        io.to(roomId).emit("receiveMessage", {
          senderId,
          receiverId,
          firstName,
          text,
          time,
        });
      } catch (err) {
        console.log("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
