var mysql = require("mysql2");

class BasketDAO {
  constructor() {
    this.pool = mysql.createPool({
      host: "localhost",
      user: "root",
      database: "honors2.0",
      waitForConnections: "true",
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  createBasket(basketID, userID) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "INSERT into basket VALUES (?,?)",
        [basketID, userID],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  getUserBasketIDByUserID(userID) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "SELECT basket_id from basket WHERE user_id = ?",
        [userID],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          resolve(results[0]);
        }
      );
    });
  }

  getUserBasketProduct(userID) {
    console.log(userID);
    return new Promise((resolve, reject) => {
      this.getUserBasketIDByUserID(userID).then((res) => {
        console.log(res.basket_id);
        this.pool.execute(
          "SELECT * from basket_products INNER JOIN products ON basket_products.product_id = products.product_id WHERE basket_products.basket_id = ?",
          [res.basket_id],
          (err, results, fields) => {
            if (err) {
              reject(err);
            }
            resolve(results);
          }
        );
      });
    });
  }

  addProductToBasket(userID, productID, quantity) {
    return new Promise((resolve, reject) => {
      this.boolIsProductInBasket(productID, userID).then((inBasket) => {
        console.log(inBasket);
        if (inBasket) {
          this.getUserBasketIDByUserID(userID).then((res) => {
            this.pool.execute(
              "INSERT into basket_products VALUES  (?,?,?)",
              [res.basket_id, productID, quantity],
              (err, results, fields) => {
                if (err) {
                  reject(err);
                }
                resolve(results);
              }
            );
          });
        } else {
          resolve(false);
        }
      });
    });
  }

  removeProductFromBasket(userID, productID) {
    return new Promise((resolve, reject) => {
      console.log(productID);
      this.getUserBasketIDByUserID(userID).then((res) => {
        console.log(res);
        this.pool.execute(
          "DELETE from basket_products WHERE basket_id = ? && product_id = ?",
          [res.basket_id, productID],
          (err, results, fields) => {
            if (err) {
              reject(err);
            }
            resolve(results);
          }
        );
      });
    });
  }

  removeAllProductsFromBasket(userID) {
    return new Promise((resolve, reject) => {
      this.getUserBasketIDByUserID(userID).then((res) => {
        this.pool.execute(
          "DELETE from basket_products WHERE basket_id = ?",
          [res.basket_id],
          (err, results, fields) => {
            if (err) {
              reject(err);
            }
            resolve(results);
          }
        );
      });
    });
  }

  boolIsProductInBasket(productID, userID) {
    return new Promise((resolve, reject) => {
      this.getUserBasketIDByUserID(userID).then((basketID) => {
        console.log(basketID);
        console.log("bums");
        this.pool.execute(
          "SELECT * from basket_products WHERE basket_id = ? AND product_id = ?",
          [basketID.basket_id, productID],
          (err, results, fields) => {
            if (err) {
              reject(err);
            } else if (results) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        );
      });
    });
  }
}

module.exports = BasketDAO;
