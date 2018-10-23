'use strict';

var META_SYMBOL = typeof Symbol === 'function' ? Symbol('json-schema-ref-parser metadata') : '__metadata';

/**
 * Stores the specified metadata on the given object value
 *
 * @param  {object} obj - The object to set metadata on
 * @param  {object} metadata - The metadata to store
 */
exports.setMetadata = function (obj, metadata) {
  // Can't create property on primitives (throws in strict mode)
  if (!obj || typeof obj !== 'object') {
    return;
  }

  obj[META_SYMBOL] = metadata;
};

/**
 * Returns the associated metadata-for the given object
 *
 * @param  {object} value - The object to get the metadata from
 * @returns {object|undefined}
 */
exports.getMetadata = function (obj) {
  return obj && obj[META_SYMBOL];
};
