const mocker = require('./_builder.mock');
let masterUser = mocker('users');

masterUser.email = 'test+uri.maxima@gmail.com';
masterUser.password = 'thisisapassword';

module.exports = {
    users: masterUser,
    accounts: mocker('accounts')
}