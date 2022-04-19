const router = require("express").Router();

const { addVisit } = require("../controllers/visits/addVisit");

router.get("/addVisit", addVisit);

module.exports = router;
