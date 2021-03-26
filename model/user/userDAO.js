const mysql = require("mysql2");

class UserDAO {
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

  insertUser(userID, email, password, fname, sname) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "INSERT into users VALUES (?,?,?,?,?)",
        [userID, email, password, fname, sname],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  getUserByUserID(userID) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "SELECT * from users WHERE user_id = ?",
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

  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "SELECT * from users WHERE email = ?",
        [email],
        (err, results, fields) => {
          if (err) {
            reject(err);
          }

          resolve(results[0]);
        }
      );
    });
  }

  getUserInfoByUserID(userID) {
    return new Promise((resolve, reject) => {
      this.pool.execute(
        "SELECT email , first_name , surname from users WHERE user_id = ?",
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
}

module.exports = UserDAO;
