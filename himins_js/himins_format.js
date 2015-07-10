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
  colors = require('colors');

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
    error: 'red'
  };

var getDefaultTheme = function() {
  return defaultTheme;
};

var setDefaultTheme = function(newTheme) {
  defaultTheme = newTheme;
};


/** 
 * Transforms context and template into text.
 * Waps text to fit column specified by indent and columnWidth.
 * Styles text according to style
 * Returns the rendered text.
 * @param {String} context
 * @param {String} template
 * @param {Number} indent
 * @param {Number} width
 * @param {String} style
 * @returns {String} text
 */
var formatText = function(context, template, indent, width, style) {
  //console.log('*** himins_format.js formatText(%s, %s, %d, %d)', client.name, text, indent, columnWidth);

  var
    result = text,
    wrap = linewrap(indent, columnWidth, {skipScheme: 'ansi-color'});

  result = resolveFunctions(client, text);
  result = renderFormatCodes(result);
  result = wrap(result);
  return result;
};
module.exports.formatText = formatText;

