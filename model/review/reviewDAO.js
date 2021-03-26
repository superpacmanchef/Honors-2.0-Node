const mysql = require("mysql2");

class ReviewDAO {
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

  addProductReview(userID, productID, review) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "INSERT into reviews VALUES (?,?,?)",
        [productID, userID, review],
        (err, results, feilds) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  getProductReviews(productID) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "SELECT * from reviews WHERE product_id = ?",
        [productID],
        (err, results, feilds) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  getUserReviews(userID) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "SELECT * from reviews WHERE user_id = ?",
        [userID],
        (err, results, feilds) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }
}

module.exports = ReviewDAO;
