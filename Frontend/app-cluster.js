"use strict";

var cluster = require('cluster'),
	os = require('os');

exports.run = function () {
	var i;
	for (i = 0; i < os.cpus().length; i++) {
		cluster.fork();
	}

	cluster.on('death', function (worker) {
		console.log('Worker %d died', worker.pid);
		cluster.fork();
	});
};
