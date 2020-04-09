'use strict';
const bcrypt	  = require('bcrypt');
const bcrypt_p	= require('bcrypt-promise');
const jwt		    = require('jsonwebtoken');
const CONFIG	  = require('../../config/config');
const {TE, to}	= require('../../services/util.service');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    full_name: {type: DataTypes.STRING, defaultValue: ''},
    username: {type: DataTypes.STRING, unique: true, allowNull: false},
	  email: {type: DataTypes.STRING, defaultValue: ''},
    phone_number: {type: DataTypes.STRING, defaultValue: ''},
    password: DataTypes.STRING
  }, {});

  Customer.associate = function(models) {
    Customer.hasMany(models.Order, {
		foreignKey: 'user_id',
		onDelete: 'CASCADE'
	});
  };

  Customer.beforeSave(async (user, options) => {
		let err;
		if (user.changed('password')) {
			let salt, hash
			[err, salt] = await to(bcrypt.genSalt(10));
			if(err) TE(err.message, true);

			[err, hash] = await to(bcrypt.hash(user.password, salt));
			if(err) TE(err.message, true);

			user.password = hash;
		}
	});

	Customer.prototype.comparePassword = async function (pw) {
		let err, pass
		if(!this.password) TE('password not set');

		[err, pass] = await to(bcrypt_p.compare(pw, this.password));
		if(err) TE(err);

		if(!pass) TE('invalid password');

		return this;
	}

	Customer.prototype.getJWT = function () {
		let expiration_time = parseInt(CONFIG.jwt_expiration);
		let payload = {
			user_id:this.id,
			role: 'Customer'
		}
		return "Bearer "+jwt.sign(payload, CONFIG.jwt_encryption, {expiresIn: expiration_time});
	};

	Customer.prototype.toWeb = function (pw) {
		let json = this.toJSON();
		return json;
	};

  return Customer;
};