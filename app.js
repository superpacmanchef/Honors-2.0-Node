var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var userDAO = require("./model/user/concreteUserDAO");
var bcrypt = require("bcrypt");
var session = require("express-session");
const redis = require("redis");

let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

var userRouter = require("./routes/user");
var basketRouter = require("./routes/basket");
var productRouter = require("./routes/product");
var orderRouter = require("./routes/order");
var reviewRouter = require("./routes/review");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "BIG BUMS",
    store: new RedisStore({
      host: "localhost",
      port: 6379,
      client: redisClient,
    }),
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 10000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(username);
    console.log(password);
    userDAO
      .getUserByEmail(username)
      .then((res) => {
        console.log(res);
        bcrypt.compare(password, res.password, (err, result) => {
          if (err) {
            console.log(err);
            return done(null, false, { message: err });
          } else {
            console.log(result);

            if (result) {
              return done(null, res);
            } else {
              return done(null, false, {
                message: "wrong suernaem or apssword",
              });
            }
          }
        });
      })
      .catch((err) => {
        return done(err, false, { message: "wrong username or password" });
      });
  })
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log(user);
  return done(null, user.user_id);
});
passport.deserializeUser((user, done) => {
  console.log(user);
  userDAO.getUserByUserID(user).then((res) => {
    return done(null, res);
  });
});

app.use("/", userRouter);
app.use("/basket", basketRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/review", reviewRouter);
/*
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
*/

module.exports = app;
