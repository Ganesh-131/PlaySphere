const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createGame, joinGame, startGame } = require("../controllers/gameController");

router.post("/create", authMiddleware, createGame);
router.post("/join", authMiddleware, joinGame);
router.post("/start", authMiddleware, startGame);

module.exports = router;