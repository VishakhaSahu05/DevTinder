// utils/socket.js (Corrected)
// We no longer need to require("socket.io") here.

const initializeSocket = (io) => { // The 'io' instance is received as a parameter
  io.on("connection", (socket) => {
    // connection logic here
    socket.on("joinChat", ({userId , targetUserId}) => {
       const roomId = [userId , targetUserId].sort().join("_");
       console.log("Joining Room : " + roomId);
       socket.join(roomId);
    });

      socket.on("sendMessage", (data) => {
      const { senderId, receiverId, text, firstName, time } = data;
      const roomId = [senderId, receiverId].sort().join("_");

      console.log("Message received:", text, "-> Room:", roomId);

      // ✅ This is the fix for messages sending twice.
      // It broadcasts to everyone in the room EXCEPT the sender.
      socket.to(roomId).emit("receiveMessage", {
        senderId,
        receiverId,
        firstName,
        text,
        time,
      });
    });
     socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;