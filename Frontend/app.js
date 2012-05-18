var cluster = require('cluster');
var config = require('./config');
var appCluster = require('./app-cluster');
var appWorker = require('./app-worker');

if (config.clusterize && cluster.isMaster) {
	appCluster.run();
} else {
	appWorker.run();
}
