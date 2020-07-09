const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const app = express();

//--------------
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
async function testConnection() {
  connection.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");

    const Customer = function (customer) {
      this.email = customer.email;
      this.name = customer.name;
      this.active = customer.active;
    };

    connection.query(
      "INSERT INTO customers SET ?",
      { email: "stakutis@gmail", name: "chris stakutis", active: true },
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
//-----------------

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
app.set("port", PORT);
app.set("env", NODE_ENV);
app.use(logger("tiny"));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log("Got a request!!!");
  next();
});

app.use("/", require(path.join(__dirname, "routes")));

app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
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
    `Express Server started on Port ${app.get(
      "port"
    )} | Environment : ${app.get("env")}`
  );
});
