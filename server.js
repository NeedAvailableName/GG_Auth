const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const path = require('path');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AYjGykIvXc8JndNYUKtQXNp3QUryjghWEjs8A5EwI9BKi64vWGQEWJ65XVa07PoZ6WD-m__Ev94H-xKT',
  'client_secret': 'EJ7gTFVqBLYe9wUgiPdxcayK4y8i7rb_XuPqj6HILNucbOKwCkdkxUfPBDURg0xvRqbmKpUeVUzbPZMl'
});

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const auth = require("./routes/api/auth");
//const posts = require("./routes/api/posts");

require("./models/User.js");

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ["somesecretsauce"]
  })
);

// MongoDB configuration
const db = require("./config/keys").mongoURI;

// Use mongoose to connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./config/passport");

//Use routes from routes folder
//app.use("/api/auth", auth);
//app.use("/api/posts", posts);

require("./routes/api/auth.js")(app);
//require("./routes/api/posts.js")(app);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//app.get('/', (req, res) => res.render('index'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App running on port ${port}`));