const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post("/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const type = membershipType.toLowerCase(); // normalize
    const { firstName, LastName: lastName, emailId } = req.user;

    // Safety check
    if (!membershipAmount[type]) {
      return res.status(400).json({ error: "Invalid membership type" });
    }

    const amount = membershipAmount[type] * 100; // in paise

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: type,
      },
    });

    // Save in DB
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
      notes: {
        firstName,
        lastName,
      },
    });

    const savedPayment = await payment.save();

    // Send response to frontend
    res.json({
      amount: savedPayment.amount,
      currency: savedPayment.currency,
      orderId: savedPayment.orderId,
      notes: savedPayment.notes,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment creation failed:", error);
    res.status(500).json({ error: error.message });
  }
});
paymentRouter.post("/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers("X-Razorpay-Signature");
    const isWebHookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!isWebHookValid) {
      return res.status(400).json({ error: "Invalid webhook signature" });
    }
    //Update my payment status in DB
    //Update the user as premium

    //return success response to razorpay
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    const user = await User.findById({_id:payment.userId});
    user.isPremium = true;
    user.membershipType = paymentDetails.notes.membership_type;
    await user.save();
    // Handle the webhook event
    const event = req.body.event;
    // switch (event) {
    //   case "payment.captured":
    //     // Handle payment captured event
    //     break;
    //   case "payment.failed":
    //     // Handle payment failed event
    //     break;
    //   default:
    //     return res.status(400).json({ error: "Unknown event" });
    // }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = paymentRouter;
