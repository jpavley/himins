module.exports = function(grunt) {

	var banner = '/*n<%= pkg.name %> <%= pkg.version %>';
	banner += '- <%= pkg.description %>n<%= pkg.repository.url %>n';
	banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>n*/n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			files: [
				'gruntfile.js', 
				'himins_js/*.js',
				'experiments/*.js'
			],
		}
	});

	// plub-in tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// grunt alias task
	grunt.registerTask('default', ['jshint']);
};