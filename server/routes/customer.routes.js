module.exports = app => {
  const customer = require("../controllers/customer.controller.js");
	const passport = require('passport');
	require('./../middleware/passport')(passport)
	
	var authenticate = function(req, res, next) {
		passport.authenticate('jwt-customer', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) {
				req.session = null;
				return res.status(401).end();
			}
			
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return next();
			});
		})(req, res, next);
	};

  var router = require("express").Router();

  // Create a new Customer
  router.post("/", customer.create);
	
	// Customer login
  router.post("/login", customer.login);
	
	// Customer logout
  router.post("/logout", customer.logout);

  // Get all Customers
  router.get("/", customer.findAll);

  // Get Customer By Id
  router.get("/:id", customer.findOne);

  // Update Customer Data
  router.put("/:id", authenticate, customer.update);

  // Delete Customer Data
  router.delete("/:id", customer.delete);

  app.use('/api/v1/customer', router);
};
