const express = require("express");
const searchfunction = require("../controllers/searchController");
const router = express.Router();

router.post("/search",searchfunction);

module.exports = router