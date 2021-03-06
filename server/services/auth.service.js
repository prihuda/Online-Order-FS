const { Customer } 	    = require('../database/models');
const validator     = require('validator');
const { to, TE }    = require('../services/util.service');

const createUser = async (userInfo) => {
    let user, err;

    if(validator.isEmail(userInfo.email)) {
        [err, user] = await to(Customer.create(userInfo));
        if(err) TE('User already exists with that email.');

        return user;

    } else {
        TE('A valid email was not entered.');
    }
}
module.exports.createUser = createUser;


const authUser = async function(userInfo){
    if(!userInfo.password) TE('Please enter a password to login');

    let err, user;
    if (validator.isEmail(userInfo.email)) {
        [err, user] = await to(Customer.findOne({ where:{ email:userInfo.email } }));
        if(err) TE(err.message);
    } else {
        TE('A valid email was not entered');
    }

    if (!user) TE('Not registered');

    [err, user] = await to(user.comparePassword(userInfo.password));

    if (err) TE(err.message);

    return user;

}
module.exports.authUser = authUser;