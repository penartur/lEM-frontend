module.exports = {
	linter: 'jslint',
	linterOptions: {
		indent: 4,
		maxlen: 120,
		node: true,
		nomen: true,
		plusplus: true //todo: use underscore
	},
	excludes: ['third-party', 'node_modules', 'bin', 'obj']
};
