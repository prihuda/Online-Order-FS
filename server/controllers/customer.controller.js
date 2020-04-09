const { Customer } = require('../database/models');
const passport     = require('passport');
require('./../middleware/passport')(passport)

// Create and Save a new Customer
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Data can not be empty!"
    });
    return;
  }

	Customer.create(req.body.data.attributes)
		.then(user => {
			let data = user.toWeb();
			req.session.token = user.getJWT();
			req.session.user_id = data.id;
			req.session.type = 'cst';
			res.status(200).send({
				message: "success retrieve data",
				status: true,
				data: {
					id: data.id,
					fullname: data.full_name,
					username: data.username,
					email: data.email,
					phonenumber: data.phone_number,
					type: 'customer'
				}
			});
		})
		.catch(err => {
			let mesg;
			if (err.errors[0].type == 'unique violation') mesg = 'Username is already registered.';
			else mesg = err.message;
			res.status(500).send({
				message: mesg,
				status: false
			});
		});
};

exports.login = (req, res, next) => {
	console.log('Pre-authenticate');
	passport.authenticate('login-customer', (err, user, info) => {
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
				req.session.type = 'cst';
				res.status(200).send({
					message: "success retrieve data",
					status: true,
					data: {
						id: data.id,
						fullname: data.full_name,
						username: data.username,
						email: data.email,
						phonenumber: data.phone_number,
						type: 'customer'
					}
				});
			});
		}
	})(req, res, next); 
};

// Update a Customer by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
	Customer.findOne({ where: { id: id }})
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
							username: data.username,
							email: data.email,
							phonenumber: data.phone_number,
							type: 'customer'
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

exports.logout = (req, res, next) => {
	req.session = null;
	console.log('LOGOUT: req.user= ', req.user);
	res.status(200).send("Logged out."); 
};

// Retrieve all Customer from the database.
exports.findAll = (req, res) => {
  Customer.findAll({
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
          err.message || "Some error occurred while retrieving customers.",
					status: false
      });
    });
};

// Find a single Customer with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Customer.findByPk(id, {
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
        message: "Error retrieving Customer with id=" + id,
				status: false
      });
    });
};

// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Customer.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Customer was deleted successfully!",
					status: true
        });
      } else {
        res.send({
          message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`,
					status: false
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Customer with id=" + id,
				status: false
      });
    });
};
