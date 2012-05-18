"use strict";

var express = require('express');
var routes = require('./routes');
var config = require('./config');

exports.run = function () {
	var app = module.exports = express.createServer();

	// Configuration

	app.configure(function () {
		/*jslint nomen:true*/
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.set('view options', { layout: false });
		app.use(express.logger());
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router);
		/*jslint es5:true*/
		app.use(express.static(__dirname + '/public'));
	});

	app.configure('development', function () {
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function () {
		app.use(express.errorHandler());
	});

	// Routes

	app.get('/', routes.index);
	app.get('/raw/', routes.raw.get);
	app.post('/raw/', routes.raw.post);
	app.get('/unrestricted-lcm/', routes.unrestrictedLcm.get);
	app.post('/unrestricted-lcm/', routes.unrestrictedLcm.post);

	app.listen(config.port, function () {
		console.log(
			"Express server %d listening on port %d in %s mode",
			process.pid,
			app.address().port,
			app.settings.env
		);
	});

};
