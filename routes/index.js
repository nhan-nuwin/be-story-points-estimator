var express = require("express");
var router = express.Router();
const randimals = require("randimals");

/* GET home page. */
router.put("/room", function (req, res, next) {
  const roomId = randimals({
    adjectives: 1,
    animals: 1,
    case: "capital",
    separator: "none",
    format: "snake",
  });
  res.json({ roomId: roomId });
});

module.exports = router;
