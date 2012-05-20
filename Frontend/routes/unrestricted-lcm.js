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

var validateInput = function (latentNumber, manifestNumber, latentDimensions, manifestDimensions, data) {
	var i,
		a,
		b,
		c,
		result = {};

	if (latentDimensions.length !== latentNumber) {
		result.latentDimensions = "Length mismatch: expected " + manifestNumber + "; got " + manifestDimensions.length;
	}

	if (manifestDimensions.length !== manifestNumber) {
		result.manifestDimensions =
			"Length mismatch: expected " + manifestNumber + "; got " + manifestDimensions.length;
	}

	a = 1;
	for (i = 0; i < manifestNumber; i++) {
		a *= manifestDimensions[i];
	}

	console.log(manifestDimensions);
	console.log("a: " + a);
	b = data.split(' ');
	if (b.length !== a) {
		result.data = "Length mismatch: expected " + a + "; got " + b.length;
	} else {
		c = [];
		for (i = 0; i < a; i++) {
			if (isNaN(parseFloat(b[i])) || (/[^01-9\.]/).test(b[i])) {
				c.push(b[i] + " is not a number");
			}
		}
		if (c.length > 0) {
			result.data = c;
		}
	}

	return result;
};

exports.post = function (req, res, next) {
	var i,
		j,
		latentNumber = parseInt(req.body.latentNumber, 10),
		manifestNumber = parseInt(req.body.manifestNumber, 10),
		latentDimensions = req.body.latentDimension,
		manifestDimensions = req.body.manifestDimension,
		mods = [],
		validationResult,
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

	validationResult = validateInput(latentNumber, manifestNumber, latentDimensions, manifestDimensions, req.body.data);
	if (validationResult && Object.keys(validationResult).length > 0) {
		console.log(validationResult);
		return res.send({ commands: commands, validationErr: validationResult });
	}

	return cliwrapper.callLem(commands, function (err, result) {
		return res.send({
			commands: commands,
			err: err,
			result: result
		});
	});
};
