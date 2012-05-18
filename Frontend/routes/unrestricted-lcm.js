"use strict";

var cliwrapper = require('../common/cliwrapper.js');

var latentNames = ['X', 'Y', 'Z'],
	manifestNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

exports.get = function (req, res, next) {
	res.render('unrestricted-lcm', {
		currentPath: '/unrestricted-lcm/',
		title: 'Unrestricted latent class model'
	});
};

exports.post = function (req, res, next) {
	var i,
		j,
		latentNumber = req.body.latentNumber,
		manifestNumber = req.body.manifestNumber,
		latentDimensions = req.body.latentDimension,
		manifestDimensions = req.body.manifestDimension,
		mods = [],
		commands = "";

	if (!Array.isArray(latentDimensions)) {
		latentDimensions = [latentDimensions];
	}
	if (!Array.isArray(manifestDimensions)) {
		manifestDimensions = [manifestDimensions];
	}

	for (i = 0; i < latentNumber; i++) {
		mods.push(latentNames[i]);
		for (j = 0; j < manifestNumber; j++) {
			mods.push(manifestNames[j] + "|" + latentNames[i]);
		}
	}

	commands =
		"lat " + latentNumber + "\r\n" +
		"man " + manifestNumber + "\r\n" +
		"dim " + latentDimensions.concat(manifestDimensions).join(" ") + "\r\n" +
		"mod " + mods.join(" ") + "\r\n" +
		"dat [" + req.body.data + "]\r\n";

	cliwrapper.callLem(commands, function (err, result) {
		if (err) {
			throw new Error(err);
		}
		res.json({ result: result });
	});
};
