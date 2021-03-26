const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

class OrderDAO {
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

  getOrderIDsByUserID(userID) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "SELECT order_id from orders WHERE user_id = ?",
        [userID],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }

          resolve(results);
        }
      );
    });
  }

  getOrderProductsByOrderID(order_id) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "SELECT * from order_products INNER JOIN products ON order_products.product_id = products.product_id WHERE order_products.order_id = ?",
        [order_id],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          console.log(results);
          resolve(results);
        }
      );
    });
  }

  orderBasket(products, user_id) {
    const order_id = uuidv4();
    return new Promise((resolve, reject) => {
      this.insertOrder(order_id, user_id).then((res) => {
        this.insertProductsIntoOrder(products, order_id).then((res) => {
          resolve(res);
        });
      });
    });
  }

  insertOrder(order_id, user_id) {
    console.log(order_id);
    console.log(user_id);
    console.log("bums");
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "INSERT into orders VALUES (?,?)",
        [order_id, user_id],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  insertProductsIntoOrder(products, order_id) {
    return new Promise((resolve, reject) => {
      resolve(
        Promise.all(
          products.map((product) => {
            return this.insertProductIntoOrder(
              product.product_id,
              order_id,
              product.quantity
            ).then((res) => {
              return res;
            });
          })
        ).then((res) => {
          console.log(res);
          return res;
        })
      );
    });
  }

  insertProductIntoOrder(product_id, order_id, quantity) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "INSERT into order_products VALUES (?,?,?)",
        [product_id, order_id, quantity],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  getAllUserOrdersByUserID(userID) {
    return new Promise((resolve, reject) => {
      return this.getOrderIDsByUserID(userID).then((orderIDs) => {
        resolve(
          Promise.all(
            orderIDs.map((orderID) => {
              return this.getOrderProductsByOrderID(orderID.order_id).then(
                (products) => {
                  return products;
                }
              );
            })
          ).then((res) => {
            return res;
          })
        );
      });
    });
  }
}

module.exports = OrderDAO;
