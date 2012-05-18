var cluster = require('cluster');
var os = require('os');

exports.run = function () {
	for (var i = 0; i < os.cpus().length; i++) {
		cluster.fork();
	}

	cluster.on('death', function (worker) {
		console.log('Worker %d died', worker.pid);
		cluster.fork();
	});
}
