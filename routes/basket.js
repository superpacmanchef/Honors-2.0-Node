var express = require("express");
var router = express.Router();
var basketDAO = require("../model/basket/concreteBasketDAO");
var { v4: uuidv4 } = require("uuid");
const prodcutDAO = require("../model/product/concreteProductDAO");

router.post("/basket", (req, res) => {
  basketDAO
    .createBasket(uuidv4(), req.user.user_id)
    .then((basketRes) => {
      res.send(basketRes);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

router.get("/basket", (req, res) => {
  basketDAO.getUserBasketProduct(req.user.user_id).then((basketProductRes) => {
    console.log(basketProductRes);
    res.send(basketProductRes);
  });
});

router.post("/product", (req, res) => {
  const { productID, quantity } = req.body;
  prodcutDAO.getNumberofProductsRemaing(productID).then((numberRemaining) => {
    if (numberRemaining > 0) {
      basketDAO
        .addProductToBasket(req.user.user_id, productID, quantity)
        .then((basketProductRes) => {
          console.log(basketProductRes);
          res.send(basketProductRes);
        });
    } else {
      res.send("OUT OF STOCK");
    }
  });
});

router.delete("/product", (req, res) => {
  const { productID } = req.body;
  basketDAO
    .removeProductFromBasket(req.user.user_id, productID)
    .then((basketProductRes) => {
      res.send(basketProductRes);
    });
});

module.exports = router;
