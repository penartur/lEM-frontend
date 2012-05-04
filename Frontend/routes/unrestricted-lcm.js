var cliwrapper = require('../common/cliwrapper.js');

var latentNames = ['X', 'Y', 'Z'];
var manifestNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

exports.get = function (req, res, next) {
	res.render('unrestricted-lcm', { title: 'Unrestricted latent class model' });
};

exports.post = function (req, res, next) {
	//console.log(req.body);
	var latentNumber = req.body.latentNumber;
	var manifestNumber = req.body.manifestNumber;
	var latentDimensions = req.body.latentDimension;
	if (!Array.isArray(latentDimensions)) latentDimensions = [latentDimensions];
	var manifestDimensions = req.body.manifestDimension;
	if (!Array.isArray(manifestDimensions)) manifestDimensions = [manifestDimensions];

	var mods = [];
	for (var i = 0; i < latentNumber; i++) {
		mods.push(latentNames[i]);
		for (var j = 0; j < manifestNumber; j++) {
			mods.push(manifestNames[j] + "|" + latentNames[i]);
		}
	}

	/*console.log({
		latentNumber: latentNumber,
		manifestNumber: manifestNumber,
		latentDimensions: latentDimensions,
		manifestDimensions: manifestDimensions,
		mods: mods
	});*/

	var commands =
		"lat " + latentNumber + "\r\n" +
		"man " + manifestNumber + "\r\n" +
		"dim " + latentDimensions.concat(manifestDimensions).join(" ") + "\r\n" +
		"mod " + mods.join(" ") + "\r\n" +
		"dat [" + req.body.data + "]\r\n";
	//res.json({ result: commands });return;
	cliwrapper.callLem(commands, function (err, result) {
		if (err) {
			throw new Error(err);
		}
		res.json({ result: result });
	});
};
