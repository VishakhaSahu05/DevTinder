// const cron = require("node-cron");
// const { subDays, startOfDays, endOfDays } = require("date-fns");
// const connectionRequest = require("../models/connectionRequest");

// cron.schedule("*0 8 * * *", async () => {
//   try {
//     const yesterday = subDays(new Date(), 1);
//     const yesterdayStart = startOfDay(yesterday);
//     const yesterdayEnd = endOfDay(yesterday);
//     const pendingRequest = await connectionRequest
//       .find({
//         status: "interested",
//         createdAt: {
//           $gte: yesterdayStart,
//           $lt: yesterdayEnd,
//         },
//       })
//       .populate("fromUserId toUserId");

//     const listOfEmails = [
//       new Set(pendingRequests.map((req) => req.toUserId.emailId)),
//     ];

//     for (const email of listOfEmails) {
//       //Send Emails
//       try {
//         const res = await sendEmails.run(
//           "New Friend Request pending for" + email,
//           "There are so many friend request pendingRequest, please login to DevTinder to accept or reject the request"
//         );
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   } catch (err) {
//     console.error(err);
//   }
// });
