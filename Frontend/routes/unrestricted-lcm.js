var cliwrapper = require('../common/cliwrapper.js');

exports.get = function (req, res, next) {
	res.render('unrestricted-lcm', { title: 'Unrestricted latent class model' });
};

exports.post = function (req, res, next) {
	console.log(req.body);
	var commands =
		"lat " + req.body.lat + "\r\n" +
		"man " + req.body.man + "\r\n" +
		"dim " + req.body.dim + "\r\n" +
		"mod " + req.body.mod + "\r\n" +
		"dat [" + req.body.dat + "]\r\n";
	cliwrapper.callLem(commands, function (err, result) {
		if (err) {
			throw new Error(err);
		}
		res.json({ result: result });
	});
};
