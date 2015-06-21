module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			files: [
				'gruntfile.js', 
				'himins_js/*.js',
				'experiments/*.js',
				'himins_app.js'
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
		},

		jsdoc: {
	        dist: {
	            src: [
	            	'himins_app.js', 
	            	'himins_js/*.js',
	            	'experiments/*.js',
	            	'test/*.js',
	            	'README.md'
	            ],
	            jsdoc: './node_modules/.bin/jsdoc',
	            options: {
	            	verbose: true,
	                destination: 'docs',
	                'private': false,
	                configure: './node_modules/jsdoc/conf.json',
                	template: './node_modules/ink-docstrap/template'
	            }
	        }
	    }

	});

	// plug-in tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-jsdoc');

	// grunt alias task
	grunt.registerTask('default', ['jshint', 'simplemocha', 'jsdoc']);
};