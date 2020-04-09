const JwtStrategy 					= require('passport-jwt').Strategy;
const LocalStrategy					= require('passport-local').Strategy;
const { Customer, Driver }	= require('../database/models');
const CONFIG        				= require('../config/config');
const { to, TE }    				= require('../services/util.service');
const validator     				= require('validator');

module.exports = function(passport) {
	passport.use('login-customer', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	}, async (username, password, done) => {
		let err, user;
		console.log('Login');
		[err, user] = await to(Customer.findOne({ where:{ username:username } }));
		if (err) return done(err);
		
    if (!user) {
			return done(null, false, {message: 'Incorrect username or password.'});
		}
		
		[err, user] = await to(user.comparePassword(password));
    if (err) return done(err);
		
		if (user) {
			return done(null, user);
		} else {
			return done(null, false, {message: 'Incorrect username or password.'});
		}
	}));
	
	passport.use('login-driver', new LocalStrategy({
		usernameField: 'phonenumber',
		passwordField: 'password'
	}, async (phonenumber, password, done) => {
		let err, user;
		if (validator.isMobilePhone(phonenumber, 'id-ID')) {
			[err, user] = await to(Driver.findOne({ where:{ phone_number:phonenumber } }));
			if (err) return done(err);
		} else {
				return done(null, false, {message: 'A valid mobile phone number was not entered.'});
    }
		
    if (!user) {
			return done(null, false, {message: 'Incorrect mobile phone number or password.'});
		}
		
		[err, user] = await to(user.comparePassword(password));
    if (err) return done(err);
		
		if (user) {
			return done(null, user);
		} else {
			return done(null, false, {message: 'Incorrect mobile phone number or password.'});
		}
	}));
	
	var opts = {};
	var getJwtToken = function(req) {
		let token = null;
		if (req && req.session.token) {
			token = req.session.token.split(' ')[1];
		}
		return token;
	};
    
	opts.jwtFromRequest = getJwtToken;
	opts.secretOrKey = CONFIG.jwt_encryption;

	passport.use('jwt', new JwtStrategy(opts, async function(jwt_payload, done) {
		let err, user;
		
		[err, user] = await to(Customer.findByPk(jwt_payload.user_id));
		if (err) return done(err, false);
		
		if (user) {
			return done(null, user);
		} else {
			return done(null, false, {message: 'User does not exist.'});
		}
	}));
	
	passport.use('jwt-customer', new JwtStrategy(opts, async function(jwt_payload, done) {
		let err, user;
		
		if (jwt_payload.role != 'Customer') return done(null, false, {message: 'Not authorized.'});
		
		[err, user] = await to(Customer.findByPk(jwt_payload.user_id));
		if (err) return done(err, false);
		
		if (user) {
			return done(null, user);
		} else {
			return done(null, false, {message: 'User does not exist.'});
		}
	}));
	
	passport.use('jwt-driver', new JwtStrategy(opts, async function(jwt_payload, done) {
		let err, user;
		
		if (jwt_payload.role != 'Driver') return done(null, false, {message: 'Not authorized.'});
		
		[err, user] = await to(Driver.findByPk(jwt_payload.user_id));
		if (err) return done(err, false);
		
		if (user) {
			return done(null, user);
		} else {
			return done(null, false, {message: 'User does not exist.'});
		}
	}));
	
	passport.serializeUser(function(user, done) {
		console.log('serializeUser');
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		console.log('deserializeUser');
		done(null, user);
	});
}