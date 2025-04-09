/**
 * @module BatchConstants
 * @description Constants and enums for batch-related operations
 * @author Yuri V
 */

/**
 * Batch directions enum
 * @readonly
 * @enum {string}
 */
const DIRECTION = Object.freeze({
  INCOMING: 'incoming',
  OUTGOING: 'outgoing'
});

/**
 * Valid batch directions array
 * @constant {string[]}
 */
const VALID_DIRECTIONS = Object.freeze([
  DIRECTION.INCOMING,
  DIRECTION.OUTGOING
]);

/**
 * Default batch query limit
 * @constant {number}
 */
const DEFAULT_BATCH_LIMIT = 100;

module.exports = {
  DIRECTION,
  VALID_DIRECTIONS,
  DEFAULT_BATCH_LIMIT
};