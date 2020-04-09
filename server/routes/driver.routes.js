module.exports = app => {
  const driver = require("../controllers/driver.controller.js");
	const passport = require('passport');
	require('./../middleware/passport')(passport)
	
	var authenticate = function(req, res, next) {
		passport.authenticate('jwt-driver', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) {
				req.session = null;
				return res.status(401).send('Please log in again.');
			}
			
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				console.log('req.user.id= ', req.user.id);
				return next();
			});
		})(req, res, next);
	};

  var router = require("express").Router();

  // Create a new Driver
  router.post("/", driver.create);
	
	// Driver login
  router.post("/login", driver.login);
	
	// Driver logout
  router.post("/logout", driver.logout);

  // Retrieve all Orders
  router.get("/:id/orders", authenticate, driver.findOrders);

  // Update a Driver with id
  router.put("/:id", authenticate, driver.update);
	
	// Update Status
  router.put("/:id/status", authenticate, driver.SetStatus);
	
	// Retrieve a single Driver with id
  //router.get("/:id", driver.findOne);
	
	// Retrieve all Drivers
  //router.get("/", driver.findAll);

  // Delete a Driver with id
  //router.delete("/:id", driver.delete);

  app.use('/api/v1/driver', router);
};
