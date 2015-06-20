module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			files: [
				'gruntfile.js', 
				'himins_js/*.js',
				'experiments/*.js'
			],
		},

		simplemocha: {
			options: {
				globals: [],
				timeout: 3000,
				ignoreLeaks: false,
				ui: 'bdd',
				reporter: 'spec'
			},
			all: { 
				src: ['test/*.js'] 
			}
		}

	});

	// plub-in tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');

	// grunt alias task
	grunt.registerTask('default', ['jshint', 'simplemocha']);
};