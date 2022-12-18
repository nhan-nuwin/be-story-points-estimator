var express = require("express");
var router = express.Router();
const gfynonce = require("gfynonce");

/* GET home page. */
router.put("/room", function (req, res, next) {
  const roomId = gfynonce({ adjectives: 2, separator: "" });
  res.json({ roomId: roomId });
});

module.exports = router;
