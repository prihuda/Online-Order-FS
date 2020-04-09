module.exports = app => {
  const order = require("../controllers/order.controller.js");
	const passport = require('passport');
	require('./../middleware/passport')(passport)
	
	var authenticate = function(req, res, next) {
		passport.authenticate('jwt', function(err, user, info) {
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

  // Create a new Order
  router.post("/", order.create);

  // Retrieve all Orders
  router.get("/", authenticate, order.findAll);

  // Retrieve a single Order with id
  router.get("/:id", order.findOne);

  // Update a Order with id
  router.put("/:id", order.update);

  // Delete a Order with id
  router.delete("/:id", order.delete);

  app.use('/api/v1/order', router);
};
