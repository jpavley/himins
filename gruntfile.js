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

	});

	// plub-in tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// grunt alias task
	grunt.registerTask('default', ['jshint']);
};