exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/goalstrive-app';
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

//JWT practice

// module.exports = {
// 	'secret': 'mygoalstrivesecret',
// 	'database': 'mongodb://test:test123@ds149144.mlab.com:49144/goalstrive-app'
// }