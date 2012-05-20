"use strict";

var cliwrapper = require('../common/cliwrapper.js');

exports.get = function (req, res, next) {
	res.render('raw', {
		currentPath: '/raw/',
		title: 'Direct lEM interface'
	});
};

exports.post = function (req, res, next) {
	console.log(req.body);
	cliwrapper.callLem(req.body.commands, function (err, result) {
		res.json({
			commands: req.body.commands,
			err: err,
			result: result
		});
	});
};
