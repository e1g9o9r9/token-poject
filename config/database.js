
const configValues = {"username":"egor","password":"1234"};

module.exports = {
    database: 'mongodb://' + configValues.username + ':' + configValues.password + '@ds249355.mlab.com:49355/something',
    secret: 'mysecret'
};