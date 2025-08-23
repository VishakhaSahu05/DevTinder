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
    const { firstName, lastName, emailId, _id } = req.user;

    if (!membershipAmount[type]) {
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
paymentRouter.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const body = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const payload = JSON.parse(body.toString());
    const paymentDetails = payload.payload.payment.entity;

    // Update payment in DB
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.status = paymentDetails.status;
    await payment.save();

    // Mark user as premium
    const user = await User.findById(payment.userId);
    if (user && paymentDetails.status === "captured") {
      user.isPremium = true;
      user.membershipType = paymentDetails.notes.membershipType || user.membershipType;
      await user.save();
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = paymentRouter;
