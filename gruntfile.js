module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			files: [
				'gruntfile.js', 
				'himins_js/*.js',
				'experiments/*.js',
			    'test/*.js',
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
	                // DocStrap template and conf.json commented out because DocStrap seems to be incompatible with JSDoc 3.3.2
	                //configure: 'conf.json',
                	//template: './node_modules/ink-docstrap/template'
	            }
	        }
	    },

	    watch: {
	    		scripts: {
	    			files: [
	    				'gruntfile.js', 
						'himins_js/*.js',
						'experiments/*.js',
						'himins_app.js',
						'README.md',
		            	'test/*.js'
					],
					tasks: ['development']
	    		}
	    }

	});

	// plug-in tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// grunt alias task
	grunt.registerTask('default', ['jshint', 'simplemocha', 'jsdoc']);
	grunt.registerTask('development', ['jshint', 'simplemocha']);

};