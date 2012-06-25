"use strict";

exports.index = function (req, res) {
	res.render('index', {
		currentPath: '/',
		title: 'Express'
	});
};

exports.raw = require('./raw');
exports.lcm = require('./lcm');
