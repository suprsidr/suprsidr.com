var express = require("express"),
  path = require("path"),
  app = express(),
  compression = require("compression"),
  routes = require('../routes/index'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  fs = require("fs");

var ItemProvider = require("../itemprovider-mongodb").ItemProvider,
  itemProvider = new ItemProvider(),
  uuid = require("uuid");

itemProvider.open(function() {});

app.use(compression());
app.set("jsonp callback", true);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../")));
app.use("/", routes); // our routes are in routes/index.js

app.listen(80, function() {
  console.log("Server is listening on port 80");
});
