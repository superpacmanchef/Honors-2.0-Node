var express = require("express");
var router = express.Router();
var orderDAO = require("../model/order/concreteOrderDAO");
var basketDAO = require("../model/basket/concreteBasketDAO");
const prodcutDAO = require("../model/product/concreteProductDAO");

router.post("/order", (req, res) => {
  basketDAO.getUserBasketProduct(req.user.user_id).then((getBasketRes) => {
    orderDAO.orderBasket(getBasketRes, req.user.user_id).then((orderRes) => {
      Promise.all(
        getBasketRes.map((basket) => {
          return prodcutDAO.updateNumberOfProductsRemaining(
            basket.product_id,
            basket.quantity
          );
        })
      ).then((s) => {
        basketDAO
          .removeAllProductsFromBasket(req.user.user_id)
          .then((removeBasketRes) => {
            res.send(orderRes);
          });
      });
    });
  });
});

router.get("/", (req, res) => {
  console.log(req.user.user_id);
  orderDAO.getAllUserOrdersByUserID(req.user.user_id).then((orders) => {
    res.send(orders);
  });
});

module.exports = router;
