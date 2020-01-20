const express = require("express");
const { createUser, login } = require("../controllers/users");

const router = express.Router({ mergeParams: true });

router.route("/register").post(createUser);
router.post("/login", login);

module.exports = router;
