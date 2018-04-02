/**
 * Escapes the string, so it can be safely use in search, etc.
 * @param str
 * @returns {string}
 */

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

module.exports = escapeRegExp;