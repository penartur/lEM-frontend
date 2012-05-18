"use strict";

var spawn = require('child_process').spawn;
var config = require('../config');

//callback is function(err, result)
exports.callLem = function (input, callback) {
	var result = "",
		error = "",
		wrapper = spawn(config.pathToCliWrapper);

	wrapper.stdout.on('data', function (data) {
		result += data;
	});
	wrapper.stderr.on('data', function (data) {
		error += data;
	});
	wrapper.on('exit', function (code) {
		if (code !== 0) {
			error = "Return code is " + code + "\r\n" + error;
		}
		if (error !== "") {
			return callback(error);
		}
		return callback(false, result);
	});
	wrapper.stdin.write(input);
	wrapper.stdin.end();
};
