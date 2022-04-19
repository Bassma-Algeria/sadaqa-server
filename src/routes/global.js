const express = require("express");
const router = express.Router();

// handlers
const { signal } = require("./../controllers/global/signal");

router.post("/signal", signal);

module.exports = router;
