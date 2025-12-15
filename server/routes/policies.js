const express = require("express");
const router = express.Router();
const Policy = require("../models/Policy");
const auth = require("../middleware/auth");

// @route   POST api/policies
// @desc    Create a policy
// @access  Private
router.post("/", auth, async (req, res) => {
  const { clientName, vehicleNo, phone, startDate, endDate, amount } = req.body;

  try {
    const newPolicy = new Policy({
      clientName,
      vehicleNo,
      phone,
      startDate,
      endDate,
      amount,
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
  const { clientName, vehicleNo, phone, startDate, endDate, amount } = req.body;

  // Build policy object
  const policyFields = {};
  if (clientName) policyFields.clientName = clientName;
  if (vehicleNo) policyFields.vehicleNo = vehicleNo;
  if (phone) policyFields.phone = phone;
  if (startDate) policyFields.startDate = startDate;
  if (endDate) policyFields.endDate = endDate;
  if (amount) policyFields.amount = amount;

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
    const queryDate = new Date(req.params.date);

    // Create start and end of the day for the query
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

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

module.exports = router;
