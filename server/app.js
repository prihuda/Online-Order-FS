const express       = require("express");
const bodyParser    = require("body-parser");
const cors          = require("cors");
const cookieSession = require('cookie-session');
const passport      = require('passport');

const app = express();

app.disable('x-powered-by');

var corsOptions = {
  origin: "http://localhost:8080",
	credentials: true
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

let maxAge = new Date(Date.now() + 60 * 60 * 1000);
app.use(cookieSession({
  name: 'session',
  keys: ["key 1"],
	cookie: {
		path: '/',
		maxAge: maxAge
	}
}));

require("./routes/customer.routes")(app);
require("./routes/driver.routes")(app);
require("./routes/product.routes")(app);
require("./routes/order.routes")(app);
require("./routes/orderitem.routes")(app);

const db = require("./database/models");

db.sequelize.sync();

//drop the table if it already exists
/* db.sequelize.sync({ force: true }).then(() => {
   console.log("Drop and re-sync db.");
}); */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "GET TO DA SHOPPA!" });
});

app.use(function (req, res, next) {
  res.status(404).send("Not found.")
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
