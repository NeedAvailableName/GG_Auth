//quy định các tuyến đường (path) khi sử dụng trang web

const passport = require("passport");
const express = require("express");
const app = express();

module.exports = app => {
  /*app.get("/auth/test", (req, res) => {
    res.send("Auth Working properly");
  });*/
  
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ]
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/");
    }
  );
//get: nhận 2 tham số: đường dẫn và hàm trả về
//đường dẫn được định nghĩa trong thẻ href trong file html
//req là request (yêu cầu), res là response (trả lời)
  
  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
