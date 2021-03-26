var express = require("express");
var router = express.Router();
var productDAO = require("../model/product/concreteProductDAO");

router.get("/", (req, res) => {
  productDAO.getProductByProductID(req.query.productID).then((productRes) => {
    res.send(productRes);
  });
});

router.get("/productPage", (req, res) => {
  productDAO
    .getNumberofProducts(req.query.pageNumber, req.query.noPerPage)
    .then((productPageRes) => {
      res.send(productPageRes);
    });
});

router.get("/productPageCatagory", (req, res) => {
  productDAO
    .getNumberofProductsByCatagory(
      req.query.pageNumber,
      req.query.noPerPage,
      req.query.catagory
    )
    .then((productPageRes) => {
      res.send(productPageRes);
    });
});

router.delete("/", (req, res) => {
  const { productID } = req.body;
  productDAO.deleteProduct(productID).then((productRes) => {
    console.log(productRes);
    res.send(productRes);
  });
});
module.exports = router;
