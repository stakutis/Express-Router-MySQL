const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const chrisTest = async (req, res, next) => {
  try {
    res.status(201).json({ test: 444 });
  } catch (e) {
    next(e);
  }
};
router.route("/chris").get(chrisTest);

module.exports = router;
