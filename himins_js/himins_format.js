/**
 * @fileOverview formats text and resolves functions for display
 * User passes in a context and a template and format returns a rendered string
 * @module
 * @requires linewrap
 * @requires underscore
 * @requires mustache
 * @requires colors
 */


// includes
var
  linewrap = require('linewrap'),
  mustache = require('mustache'),
  colors = require('colors/safe');

// constants
var
  defaultTheme = {
    silly: 'rainbow',
    input: 'gray',
    verbose: 'cyan',
    prompt: 'magenta',
    info: 'green',
    data: 'inverse',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
  };

/** 
 * Transforms context and template into text.
 * Waps text to fit column specified by indent and columnWidth.
 * (See Mustache documentation for context and template usage.)
 * Styles text according to style
 * (See Colors documenation for style.)
 * Returns the rendered text.
 * @param {Object} context properties and values for template
 * @param {String} template text with variable for subsitution
 * @param {Number} indent how many spaces from the left to indent
 * @param {Number} width the length of the column
 * @param {String} style attribute from standard Colors theme
 * @returns {String} text
 */
var formatText = function(context, template, indent, width, style) {

  var
    output = "",
    wrap = linewrap(indent, width, {skipScheme: 'ansi-color'});

  colors.setTheme(defaultTheme);

  output = mustache.render(template, context);
  output = wrap(output);

  if (style.length > 0) {
    output = colors[style](output);
  }

  return output;
};
module.exports.formatText = formatText;

