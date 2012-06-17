"use strict";

var _ = require('underscore'),
	cliwrapper = require('../common/cliwrapper.js');

var latentNames = ['X', 'Y', 'Z'],
	manifestNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

exports.get = function (req, res, next) {
	res.render('unrestricted-lcm', {
		currentPath: '/unrestricted-lcm/',
		title: 'Unrestricted latent class model'
	});
};

var validateInput = function (modelType, latentNumber, manifestNumber, latentDimensions, manifestDimensions, data) {
	var i,
		a,
		b,
		c,
		result = {};

	if (modelType !== 'classic' && modelType !== 'loglinear' && modelType !== 'combined') {
		result.modelType = 'Invalid value ' + modelType;
	}

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
			if (isNaN(parseFloat(b[i])) || !(/^[01-9\.]+$/).test(b[i])) {
				c.push(b[i] + " is not a number");
			}
		}
		if (c.length > 0) {
			result.data = c;
		}
	}

	return result;
};

var getModelSpecification = function (modelType, latentNumber, manifestNumber) {
	var i,
		j;

	switch (modelType) {
	case 'classic':
		return _.flatten(_.map(_.first(latentNames, latentNumber), function (latentName) {
			return _.map(_.first(manifestNames, manifestNumber), function (manifestName) {
				return manifestName + '|' + latentName;
			});
		})).join(' ');
	case 'loglinear':
		return '{' + _.flatten(_.map(_.first(latentNames, latentNumber), function (latentName) {
			return _.map(_.first(manifestNames, manifestNumber), function (manifestName) {
				return latentName + manifestName;
			});
		})).join(',') + '}';
	case 'combined':
		return _.flatten(_.map(_.first(latentNames, latentNumber), function (latentName) {
			return [
				latentName,
				'{' + latentName + '}',
				_.map(_.first(manifestNames, manifestNumber), function (manifestName) {
					return [
						manifestName + '|' + latentName,
						'{' + latentName + manifestName + '}'
					];
				})
			];
		})).join(' ');
	}
};

exports.post = function (req, res, next) {
	var modelType = req.body.modelType,
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

	commands =
		"lat " + latentNumber + "\r\n" +
		"man " + manifestNumber + "\r\n" +
		"dim " + latentDimensions.concat(manifestDimensions).join(" ") + "\r\n" +
		"mod " + getModelSpecification(modelType, latentNumber, manifestNumber) + "\r\n" +
		"dat [" + req.body.data + "]\r\n";

	validationResult = validateInput(
		modelType,
		latentNumber,
		manifestNumber,
		latentDimensions,
		manifestDimensions,
		req.body.data
	);
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
