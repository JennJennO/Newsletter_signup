const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//use 'static' to access static local files (ie: css and images folders)
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  // pulls input based on 'name' in html file
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  // mailchimp API endpoint
  const url = "https://us14.api.mailchimp.com/3.0/lists/92fabec190";

  const options = {
    method: "POST",
    auth: "jennjenno:950fba9f3ecd6409b42e11205c9ce52f-us14"
  }

  const requestHTTPS = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  requestHTTPS.write(jsonData);
  requestHTTPS.end();

});

// ?? adding .html to '/failure' stops the button from re-routing back to the home page
app.post("/failure", function(req, res) {
  res.redirect("/");
});

// 'process.env.PORT' is a dynamic port for the Heroku cloud server
app.listen(process.env.PORT || 3000, function() {
  console.log("The server is running on port 3000.");
});

// API key: 950fba9f3ecd6409b42e11205c9ce52f-us14
// List ID: 92fabec190
// url: https://usX.api.mailchimp.com/3.0/lists
// myURL: https://us14.api.mailchimp.com/3.0/lists/92fabec190
