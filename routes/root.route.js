var express = require("express");
const router = express.Router();

/* GET Root Url */
router.get("/", function(req, res, next) {
    res.sendStatus(200);
});

module.exports = router;