const mysql = require("mysql2");

class ProdcutDAO {
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

  getProductByProductID(productID) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "SELECT * from products WHERE product_id = ?",
        [productID],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          resolve(results[0]);
        }
      );
    });
  }

  getNumberofProducts(pageNumber, numberPerPage) {
    return new Promise((resolve, reject) => {
      const offset = pageNumber * numberPerPage;
      this.pool.execute(
        "SELECT * from products Limit ? OFFSET ?",
        [numberPerPage, offset],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  getNumberofProductsByCatagory(pageNumber, numberPerPage, catagory) {
    return new Promise((resolve, reject) => {
      const offset = pageNumber * numberPerPage;
      this.pool.execute(
        "SELECT * from products WHERE catagory = ? ORDER BY name ASC Limit ? OFFSET ? ",
        [catagory, numberPerPage, offset],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  deleteProduct(productID) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "DELETE from products WHERE product_id = ?",
        [productID],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  getNumberofProductsRemaing(productID) {
    console.log(productID);
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "SELECT `#_remaining` from products WHERE product_id = ?",
        [productID],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          resolve(results[0]["#_remaining"]);
        }
      );
    });
  }

  updateNumberOfProductsRemaining(productID, numberBought) {
    return new Promise((resolve, reject) => {
      this.getNumberofProductsRemaing(productID).then((currentRemaining) => {
        const newRemaining = currentRemaining - numberBought;
        console.log(newRemaining);
        console.log(currentRemaining);
        this.pool.execute(
          "UPDATE products SET `#_remaining` = ? WHERE product_id = ?",
          [newRemaining, productID],
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
}

module.exports = ProdcutDAO;
