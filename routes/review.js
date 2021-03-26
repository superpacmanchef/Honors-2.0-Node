var express = require("express");
var router = express.Router();
var orderDAO = require("../model/order/concreteOrderDAO");
var basketDAO = require("../model/basket/concreteBasketDAO");
const prodcutDAO = require("../model/product/concreteProductDAO");
var reviewDAO = require("../model/review/concreteReviewDAO");

router.get("/user", (req, res) => {
  reviewDAO.getUserReviews(req.user.user_id).then((reviews) => {
    res.send(reviews);
  });
});

router.get("/product", (req, res) => {
  const { productID } = req.query;
  reviewDAO.getProductReviews(productID).then((reviews) => {
    res.send(reviews);
  });
});

router.post("/", (req, res) => {
  const { productID, review } = req.body;
  console.log(req.user.user_id);
  console.log(productID);
  console.log(review);
  reviewDAO
    .addProductReview(req.user.user_id, productID, review)
    .then((reviewRes) => {
      res.send(reviewRes);
    });
});

module.exports = router;
