const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const getStats = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "./stats.json"));
    const stats = JSON.parse(data);
    const playerStats = stats.find(
      (player) => player.id === Number(req.params.id)
    );
    if (!playerStats) {
      const err = new Error("Player stats not found");
      err.status = 404;
      throw err;
    }
    res.json(playerStats);
  } catch (e) {
    next(e);
  }
};
router.route("/api/v1/stats/:id").get(getStats);

const createStats = async (req, res, next) => {
  try {
    const data = fs.readFileSync(statsFilePath);
    const stats = JSON.parse(data);
    const newStats = {
      id: req.body.id,
      wins: req.body.wins,
      losses: req.body.losses,
      points_scored: req.body.points_scored,
    };
    stats.push(newStats);
    fs.writeFileSync(statsFilePath, JSON.stringify(stats));
    res.status(201).json(newStats);
  } catch (e) {
    next(e);
  }
};

router.route("/api/v1/stats").post(createStats);

const chrisTest = async (req, res, next) => {
  try {
    res.status(201).json({ test: 444 });
  } catch (e) {
    next(e);
  }
};
router.route("/chris").get(chrisTest);

module.exports = router;
