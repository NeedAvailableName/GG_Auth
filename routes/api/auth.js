//quy định các tuyến đường (path) khi sử dụng trang web

const passport = require("passport");
const express = require("express");
const paypal = require('paypal-rest-sdk');
const app = express();
const ejs = require('ejs');

app.set('view engineer', 'ejs');
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

  //paypal
  //app.get('/', (req, res) => res.render('index'));

  app.post('/auth/google/callback/pay', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/auth/google/callback/success",
          "cancel_url": "http://localhost:3000/auth/google/callback/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Giftcode",
                  "sku": "001",
                  "price": "25.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "25.00"
          },
          "description": "Giftcode free from Lien quan mobile"
      }]
  };
  
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
  
  });
  
  app.get('/auth/google/callback/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "25.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          // res.send('Success, this is your giftcode: ABCDEF123456');
          res.render('giftcode');
      }
    });
  });
  
  app.get('/auth/google/callback/cancel', (req, res) => {
    // res.send('Cancelled'));
    res.redirect("/")
  });
};
