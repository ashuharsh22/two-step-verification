var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

var messagebird = require("messagebird")("5s9EjYbYpHHB8z4Rr0G6oppWH");

var app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("step1");
});

app.post("/step2", function (req, res) {
  var number = req.body.number;
  var params = {
    originator: "",
    type: "sms",
  };
  messagebird.verify.create(number, params, function (err, response) {
    if (err) {
      console.log(err);
      res.render("step1", {
        error: err.errors[0].description,
      });
    } else {
      console.log(response);
      res.render("step2", {
        id: response.id,
      });
    }
  });
});

app.post("/step3", function (req, res) {
  var id = req.body.id;
  var token = req.body.token;

  messagebird.verify.verify(id, token, function (err, response) {
    if (err) {
      res.render("step2", {
        error: err.errors[0].description,
        id: id,
      });
    } else {
      res.render("step3");
    }
  });
});

app.listen(8000);
