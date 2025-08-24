// routes/payment.js
const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constants");
const crypto = require("crypto");

// Create Razorpay order
paymentRouter.post("/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const type = membershipType.toLowerCase();
    const { firstName, LastName: lastName, emailId, _id } = req.user;

    if (!membershipAmount[type]) {
      console.log("Invalid membership type:", type);
      return res.status(400).json({ error: "Invalid membership type" });
    }

    const amount = membershipAmount[type] * 100; // in paise

    const order = await razorpayInstance.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: _id.toString(),
        membershipType: type,
      },
    });

    const payment = new Payment({
      userId: _id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
      notes: {
        firstName,
        lastName,
        membershipType: type,
      },
    });

    await payment.save();

    console.log("Payment created:", payment);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      notes: payment.notes,
    });
  } catch (err) {
    console.error("Payment creation failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// Razorpay webhook
paymentRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const webhookSignature = req.headers["x-razorpay-signature"];
      const body = req.body; // raw buffer

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest("hex");

      console.log("Received webhook. Signature:", webhookSignature);
      console.log("Expected signature:", expectedSignature);

      if (webhookSignature !== expectedSignature) {
        console.log("Invalid webhook signature");
        return res.status(400).json({ error: "Invalid signature" });
      }

      const payload = JSON.parse(body.toString());
      const paymentDetails = payload.payload.payment.entity;

      console.log("Webhook payload payment entity:", paymentDetails);
      console.log("Webhook notes:", paymentDetails.notes);

      // Update payment in DB
      const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
      if (!payment) {
        console.log("Payment not found for orderId:", paymentDetails.order_id);
        return res.status(404).json({ error: "Payment not found" });
      }

      payment.status = paymentDetails.status;
      await payment.save();
      console.log("Payment status updated:", payment.status);

      // Mark user as premium
      const user = await User.findById(payment.userId);
      if (!user) {
        console.log("User not found for payment userId:", payment.userId);
      } else {
        console.log("User before update:", user);
        if (paymentDetails.status === "captured" || paymentDetails.status === "authorized") {
          user.isPremium = true;
          user.membershipType = paymentDetails.notes.membershipType || user.membershipType;
          await user.save();
          console.log("User marked as premium:", user);
        } else {
          console.log("Payment not captured yet, user isPremium remains:", user.isPremium);
        }
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);
paymentRouter.get("/premium/verify" , userAuth , async (req,res) =>{
    const user = req.user.toJSON();
    if(user.isPremium){
        return res.json({...user});
    }
    res.json({ ...user });
});

module.exports = paymentRouter;
