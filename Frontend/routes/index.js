/*
 * GET home page.
 */
exports.index = function (req, res) {
	res.render('index', {
		currentPath: '/',
		title: 'Express'
	});
};

exports.raw = require('./raw');
exports.unrestrictedLcm = require('./unrestricted-lcm');
