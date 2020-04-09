'use strict';
const bcrypt	  = require('bcrypt');
const bcrypt_p	= require('bcrypt-promise');
const jwt		    = require('jsonwebtoken');
const CONFIG	  = require('../../config/config');
const {TE, to}	= require('../../services/util.service');

module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    full_name: {type: DataTypes.STRING, defaultValue: ''},
		phone_number: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: DataTypes.STRING
  }, {});

  Driver.associate = function(models) {
    Driver.hasMany(models.Order, {
			foreignKey: 'driver_id',
			onDelete: 'CASCADE'
		});
  };

  Driver.beforeSave(async (user, options) => {
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

	Driver.prototype.comparePassword = async function (pw) {
		let err, pass
		if(!this.password) TE('password not set');

		[err, pass] = await to(bcrypt_p.compare(pw, this.password));
		if(err) TE(err);

		if(!pass) TE('invalid password');

		return this;
	}

	Driver.prototype.getJWT = function () {
		let expiration_time = parseInt(CONFIG.jwt_expiration);
		let payload = {
			user_id:this.id,
			role: 'Driver'
		}
		return "Bearer "+jwt.sign(payload, CONFIG.jwt_encryption, {expiresIn: expiration_time});
	};

	Driver.prototype.toWeb = function (pw) {
		let json = this.toJSON();
		return json;
	};

  return Driver;
};