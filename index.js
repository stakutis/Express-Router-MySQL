/****************************************************
 * Chris Stakutis   chris.stakutis@gmail.com
 *
 * This file is a short stub that shows a simple node/express REST
 * app, using sub-routing, AND it shows a simple use of mysql too!
 */

const express = require("express");
//const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const app = express();

//-------------- MySQL usage/example ---------------
const mysql = require("mysql");
const dbConfig = require("./db.config.js");

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

// open the MySQL connection
function testConnection() {
  connection.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");

    connection.query(
      "INSERT INTO customers SET ?",
      {
        email: "stakutis@gmailThurs",
        name: "chris stakutisThurs",
        active: true,
      },
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created customer! ");
        //result(null, { id: res.insertId, ...newCustomer });
      }
    );
  });
}
testConnection();
//-----------------

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Set up some standard middlewares...
app.use(logger("tiny")); // Logs-out (console) each request
//app.use(bodyParser.json());  // No longer needed in newer express...use the next line
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
); // This allows forms to be sent and decoded

// Let's add-in our own middleware just for fun.
// It does nothing, but chains thru to the next.
app.use((req, res, next) => {
  console.log("Got a request!!!");
  next();
});

// Let's tell express that we have some static files that can be
// served. Somehow, express looks at the specified folder/contents
// and any incoming GET that matches items/files in that tree it will
// just regular html-serve them. So, in our build tree, we have a './mystatic/'
// folder, but the incoming GET doesn't specify that part, only what it wants
// inside it.  So, in our case: GET http://localhost:3000/test.txt
app.use(express.static("mystatic"));

// Mount our sub-router
app.use("/", require(path.join(__dirname, "routes"))); // Sub-router!!!

// Simplest case; handle a an API GET of a certain path.
// Send back json data.
app.get("/fish", (req, res) => {
  console.log("/fish was called!");
  res.json({ test: "fish", much: "soup" });
});

// Force an error and see if our app.use for errors catches it
app.get("/errtest", (req, res) => {
  console.log("/errtest was called!");
  throw new Error("Stakutis error");
});

// This post expects the json-input to have at least a .username field
app.post("/fish", (req, res) => {
  console.log("POST to /fish!!");
  console.log("body is:", req.body);
  console.log("username:", req.body.username);
  res.json({ happy: true });
});

// Last ditch...nothing matched the request
app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err); // Calling 'next()' with a param means we're signalling an error

  // We could have just completed the request here with our own return json/value/etc
});

// Here we setup an error handler.  If some code calls next() with a parameter
// or something 'throws', these types of middlewares get called.
app.use((err, req, res, next) => {
  console.log("ERRRRRROR caught!");
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(
    `Express Server started on Port ${PORT} | Environment : ${NODE_ENV}`
  );
});
