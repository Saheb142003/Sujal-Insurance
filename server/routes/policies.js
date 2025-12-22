const express = require("express");
const router = express.Router();
const Policy = require("../models/Policy");
const auth = require("../middleware/auth");

// @route   POST api/policies
// @desc    Create a policy
// @access  Private
router.post("/", auth, async (req, res) => {
  const {
    clientName,
    vehicleNo,
    vehicleType,
    policyType,
    phone,
    startDate,
    endDate,
    amount,
    discount,
  } = req.body;

  try {
    const newPolicy = new Policy({
      clientName,
      vehicleNo,
      vehicleType,
      policyType,
      phone,
      startDate,
      endDate,
      amount,
      discount: discount || 0,
    });

    const policy = await newPolicy.save();
    res.json(policy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/policies
// @desc    Get all policies
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const policies = await Policy.find().sort({ createdAt: -1 });
    res.json(policies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/policies/:id
// @desc    Update a policy
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const {
    clientName,
    vehicleNo,
    vehicleType,
    vehicleDetails,
    policyType,
    phone,
    startDate,
    endDate,
    amount,
    discount,
  } = req.body;

  // Build policy object
  const policyFields = {};
  if (clientName) policyFields.clientName = clientName;
  if (vehicleNo) policyFields.vehicleNo = vehicleNo;
  if (vehicleType) policyFields.vehicleType = vehicleType;
  if (policyType) policyFields.policyType = policyType;
  if (phone) policyFields.phone = phone;
  if (startDate) policyFields.startDate = startDate;
  if (endDate) policyFields.endDate = endDate;
  if (amount) policyFields.amount = amount;
  if (discount !== undefined) policyFields.discount = discount;

  try {
    let policy = await Policy.findById(req.params.id);

    if (!policy) return res.status(404).json({ msg: "Policy not found" });

    policy = await Policy.findByIdAndUpdate(
      req.params.id,
      { $set: policyFields },
      { new: true }
    );

    res.json(policy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/policies/:id
// @desc    Delete a policy
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let policy = await Policy.findById(req.params.id);

    if (!policy) return res.status(404).json({ msg: "Policy not found" });

    await Policy.findByIdAndDelete(req.params.id);

    res.json({ msg: "Policy removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/policies/date/:date
// @desc    Get policies starting or expiring on a specific date
// @access  Private
router.get("/date/:date", auth, async (req, res) => {
  try {
    // Parse the date string (YYYY-MM-DD) and force it to be treated as UTC start of day
    const dateStr = req.params.date;
    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    const starting = await Policy.find({
      startDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const expiring = await Policy.find({
      endDate: { $gte: startOfDay, $lte: endOfDay },
    });

    res.json({ starting, expiring });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/policies/stats
// @desc    Get policy statistics (Public)
// @access  Public
router.get("/stats", async (req, res) => {
  try {
    const totalPolicies = await Policy.countDocuments();
    const distinctClients = await Policy.distinct("clientName");
    const totalClients = distinctClients.length;

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisYear = await Policy.countDocuments({
      startDate: { $gte: startOfYear },
    });

    const thisMonth = await Policy.countDocuments({
      startDate: { $gte: startOfMonth },
    });

    const lastMonth = await Policy.countDocuments({
      startDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    res.json({
      totalPolicies,
      totalClients,
      thisYear,
      thisMonth,
      lastMonth,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
