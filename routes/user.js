var express = require("express");
var router = express.Router();
var userDAO = require("../model/user/concreteUserDAO");
var basketDAO = require("../model/basket/concreteBasketDAO");
var orderDAO = require("../model/order/concreteOrderDAO");
var { v4: uuidv4 } = require("uuid");
var bcrypt = require("bcrypt");
const passport = require("passport");
var saltRounds = 10;

router.post("/reg", (req, res, next) => {
  const { username, password, fname, sname } = req.body;
  const id = uuidv4();
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      res.send(false);
    } else {
      userDAO.insertUser(id, username, hash, fname, sname).then((userRes) => {
        basketDAO
          .createBasket(uuidv4(), id)
          .then((basketRes) => {
            res.send(true);
          })
          .catch((err) => {
            console.log(err);
            res.send(err);
          });
      });
    }
  });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send(req.isAuthenticated());
});

router.get("/userInfo", (req, res) => {
  if (req.isAuthenticated()) {
    userDAO.getUserInfoByUserID(req.user.user_id).then((userRes) => {
      res.send(userRes);
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
