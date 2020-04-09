const { Driver, Customer, OrderItem, Product }	= require('../database/models');
const validator		= require('validator');
const passport		= require('passport');
const {to}				= require('await-to-js');
require('./../middleware/passport')(passport)

// Create and Save a new Driver
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Data can not be empty!"
    });
    return;
  }

  if (validator.isMobilePhone(
		req.body.data.attributes.phone_number, 'id-ID')) {
		Driver.create(req.body.data.attributes)
			.then(user => {
				let data = user.toWeb();
				req.session.token = user.getJWT();
				req.session.user_id = data.id;
				req.session.type = 'drv';
				res.status(200).send({
					message: "success retrieve data",
					status: true,
					data: {
						id: data.id,
						fullname: data.full_name,
						phonenumber: data.phone_number,
						type: 'driver'
					}
				});
			})
			.catch(err => {
				let mesg;
				if (err.errors[0].type == 'unique violation') mesg = 'Phone number is already registered.';
				else mesg = err.message;
				res.status(500).send({
					message: mesg,
					status: false
				});
			});
	} else {
		return res.status(500).send({
			message: 'A valid mobile phone number was not entered.',
			status: false
		});
	}
};

exports.login = (req, res, next) => {
	console.log('Pre-authenticate');
	passport.authenticate('login-driver', (err, user, info) => {
		if (err) {
			console.log(err);
		}
		if (info != undefined) {
			console.log(info.message);
			res.status(404).send({
				message: info.message,
				status: false
			});
		} else {
			req.logIn(user, err => {
				if (err) { return next(err); }
				let data = user.toWeb();
				req.session.token = user.getJWT();
				req.session.user_id = data.id;
				req.session.type = 'drv';
				res.status(200).send({
					message: "success retrieve data",
					status: true,
					data: {
						id: data.id,
						fullname: data.full_name,
						phonenumber: data.phone_number,
						type: 'driver'
					}
				});
			});
		}
	})(req, res, next); 
};

// Update a Driver by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
	Driver.findOne({ where: { id: id }})
		.then(record => {
			record.update(req.body.data.attributes)
				.then(updatedRecord => {
					let data = updatedRecord.toWeb();
					res.send({
						message: "success retrieve data",
						status: true,
						data: {
							id: data.id,
							fullname: data.full_name,
							phonenumber: data.phone_number,
							type: 'driver'
						}
					}); 
				})
				.catch(err => {
					res.status(500).send({
						message: err.message,
						status: false
					});
				});
		})
		.catch(err => {
			res.status(500).send({
				message: err.message,
				status: false
			});
		});
};

// Retrieve all Orders
exports.findOrders = async (req, res) => {
	let err, drv;
	[err, drv] = await to(Driver.findByPk(req.session.user_id));
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	
	let orders;
	[err, orders] = await to(drv.getOrders({
		attributes:
			['id', ['createdAt', 'date'], 'status'],
		order: [['createdAt', 'ASC']],
		include: [{
			model: Customer,
			as: 'customer',
			attributes: ['id', ['full_name', 'customer_name'], 'phone_number']
		}, {
			model: OrderItem,
			as: 'order_detail',
			attributes: ['id', 'quantity'],
			include: {
				model: Product,
				attributes: ['id', 'name']
			}
		}]
	}));
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	let data = JSON.stringify(orders, null, 2)
	console.log('data = ', data);
	res.send({
		message: "success retrieve data",
		status: true,
		data: orders
	});
};

// Update Status
exports.SetStatus = async (req, res) => {
	console.log(req.body.data);
	let err, drv;
	[err, drv] = await to(Driver.findByPk(req.session.user_id));
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	
	let order;
	[err, order] = await to(drv.getOrders({where: {id: req.body.data.attributes.id}}));
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	let dataz = {
		status: req.body.data.attributes.status
	};
	
	[err, order] = await to(order[0].update(dataz))
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	
	let data = JSON.stringify(order, null, 2)
	console.log('data = ', data);
	res.send({
		message: "success retrieve data",
		status: true,
	});
};

exports.logout = (req, res, next) => {
	req.session = null;
	console.log('LOGOUT: req.user= ', req.user);
	res.status(200).send("Logged out."); 
};



// Retrieve all Drivers from the database.
exports.findAll = (req, res) => {
  Driver.findAll({
		attributes: {
			exclude: ['createdAt', 'updatedAt']
		}
	})
    .then(data => {
      res.send({
        message: "success retrieve data",
				status: true,
				data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving drivers.",
					status: false
      });
    });
};

// Find a single Driver with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Driver.findByPk(id, {
		attributes: {
			exclude: ['createdAt', 'updatedAt']
		}
	})
    .then(data => {
      res.send({
        message: "success retrieve data",
				status: true,
				data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Driver with id=" + id,
				status: false
      });
    });
};

// Delete a Driver with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Driver.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Driver was deleted successfully!",
					status: true
        });
      } else {
        res.send({
          message: `Cannot delete Driver with id=${id}. Maybe Driver was not found!`,
					status: false
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Driver with id=" + id,
				status: false
      });
    });
};
