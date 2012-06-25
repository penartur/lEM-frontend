"use strict";

var _ = require('underscore'),
	cliwrapper = require('../common/cliwrapper.js');

var latentNames = ['X', 'Y', 'Z'],
	manifestNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

exports.get = function (req, res, next) {
	res.render('lcm', {
		currentPath: '/lcm/',
		title: 'Latent class model'
	});
};

var toInt = function (strValue) {
	return parseInt(strValue, 10);
};

var validateInput = function (
	modelType,
	latentNumber,
	manifestNumber,
	latentDimensions,
	manifestDimensions,
	manifestOrders,
	dataType,
	data,
	respondentsNumber,
	answers
) {
	var i,
		a,
		b,
		c,
		result = {};

	if (modelType === 'classic' || modelType === 'loglinear' || modelType === 'combined') {
		if (manifestOrders.length) {
			result.manifestOrders = 'manifestOrders passed for ' + modelType;
		}
	} else if (modelType === 'croon') {
		if (manifestOrders.length !== manifestNumber) {
			result.manifestOrders =
				'Length mismatch: expected ' + manifestNumber + '; got ' + manifestOrders.length;
		}
	} else {
		result.modelType = 'Invalid value ' + modelType;
	}

	if (latentDimensions.length !== latentNumber) {
		result.latentDimensions = "Length mismatch: expected " + manifestNumber + "; got " + manifestDimensions.length;
	}

	if (manifestDimensions.length !== manifestNumber) {
		result.manifestDimensions =
			"Length mismatch: expected " + manifestNumber + "; got " + manifestDimensions.length;
	}

	if (dataType === 'raw') {
		if (!data) {
			result.data = 'Missing data';
		} else {

			a = 1;
			for (i = 0; i < manifestNumber; i++) {
				a *= manifestDimensions[i];
			}

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
		}
	} else if (dataType === 'plain') {
		if (!answers) {
			result.answers = 'Missing answers';
		} else if (answers.length !== manifestNumber) {
			result.answers =
				'Invalid number of answers per respondent: ' +
				'expected ' + manifestNumber + ', got ' + answers.length;
		} else {
			a = {};
			for (i = 0; i < manifestNumber; i++) {
				if (answers[i].length !== respondentsNumber) {
					a[i] =
						'Invalid number of respondents for question: ' +
						'expected ' + respondentsNumber + ', got ' + respondentsNumber;
				}
			}
			if (!_.isEmpty(a)) {
				result.answers = a;
			}
		}
	} else {
		result.dataType = 'Invalid value ' + dataType;
	}

	return result;
};

var getModelSpecification = function (modelType, latentNumber, manifestNumber, manifestOrders) {
	var i,
		j;

	switch (modelType) {
	case 'classic':
		return _.flatten(_.map(_.first(latentNames, latentNumber), function (latentName) {
			return [
				latentName,
				_.map(_.first(manifestNames, manifestNumber), function (manifestName) {
					return manifestName + '|' + latentName;
				})
			];
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
	case 'croon':
		return _.flatten(_.map(_.first(latentNames, latentNumber), function (latentName) {
			return [
				latentName,
				_.map(_.first(manifestNames, manifestNumber), function (manifestName, i) {
					return manifestName + '|' + latentName + ' ' + manifestOrders[i];
				})
			];
		})).join(' ');
	}
};

//answersT is respondentId => questionId => value dictionary
var getDataFromPlain = function (manifestDimensions, answersT, currentValues) {
	currentValues = currentValues || [];

	var sliced;
	if (!manifestDimensions.length) {
		return _.size(_.filter(answersT, _.bind(_.isEqual, null, currentValues)));
	}

	sliced = manifestDimensions.slice(1);
	return _.map(_.range(1, manifestDimensions[0] + 1), function (i) {
		return getDataFromPlain(sliced, answersT, _.flatten([currentValues, i]));
	});
};

var getData = function (manifestNumber, manifestDimensions, dataType, rawData, respondentsNumber, answers) {
	if (dataType === 'raw') {
		return rawData;
	} else {
		return getDataFromPlain(
			_.map(manifestDimensions, toInt),
			_.zip.apply(null, _.map(answers, function (perRespondent) {
				if (!Array.isArray(perRespondent)) {
					perRespondent = [perRespondent];
				}
				return _.map(perRespondent, toInt);
			}))
		);
	}
};

exports.post = function (req, res, next) {
	var modelType = req.body.modelType,
		latentNumber = toInt(req.body.latentNumber),
		manifestNumber = toInt(req.body.manifestNumber),
		latentDimensions = req.body.latentDimension,
		manifestDimensions = req.body.manifestDimension,
		manifestOrders = req.body.manifestOrders,
		dataType = req.body.dataType,
		data = req.body.data,
		respondentsNumber = toInt(req.body.respondentsNumber),
		answers = req.body.answers,
		validationResult,
		commands = "";

	if (!Array.isArray(latentDimensions)) {
		latentDimensions = [latentDimensions];
	}
	if (!Array.isArray(manifestDimensions)) {
		manifestDimensions = [manifestDimensions];
	}
	if (!Array.isArray(manifestOrders)) {
		manifestOrders = [manifestOrders];
	}

	validationResult = validateInput(
		modelType,
		latentNumber,
		manifestNumber,
		latentDimensions,
		manifestDimensions,
		manifestOrders,
		dataType,
		data,
		respondentsNumber,
		answers
	);
	if (!_.isEmpty(validationResult)) {
		console.log(req.body);
		console.log(validationResult);
		return res.send({ validationErr: validationResult });
	}

	commands =
		"lat " + latentNumber + "\r\n" +
		"man " + manifestNumber + "\r\n" +
		"dim " + latentDimensions.concat(manifestDimensions).join(" ") + "\r\n" +
		"mod " + getModelSpecification(modelType, latentNumber, manifestNumber, manifestOrders) + "\r\n" +
		"dat [" + getData(manifestNumber, manifestDimensions, dataType, data, respondentsNumber, answers) + "]\r\n";

	return cliwrapper.callLem(commands, function (err, result) {
		return res.send({
			commands: commands,
			err: err,
			result: result
		});
	});
};
