const express = require("express");
const router = express.Router();

const Agent = require("../models/Agent");

// GET all agents
router.get("/", async (req, res) => {
  const agents = await Agent.find();
  res.json(agents);
});

// CREATE agent
router.post("/", async (req, res) => {
  try {
    const agent = new Agent(req.body);
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;