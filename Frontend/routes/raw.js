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
		if (err) {
			throw new Error(err);
		}
		//res.render('rawresponse', { title: 'Direct lEM interface', result: result });
		res.json({ commands: req.body.commands, result: result });
	});
};
