/**
 * @module BatchTransformer
 * @description Transformer functions for batch-related data
 * @author Yuri V
 */

/**
 * Transforms a batch record to the expected format
 * @param {Object} batch - Raw batch record from database
 * @returns {Object} Transformed batch object
 */
const transformBatch = (batch) => {
  return {
    batchId: batch.batch_id,
    nodeId: batch.node_id,
    channelId: batch.channel_id,
    status: batch.status,
    errorFlag: batch.error_flag === 1,
    byteCount: batch.byte_count,
    dataEventCount: batch.data_event_count,
    createTime: batch.create_time,
    loadTime: batch.load_time,
    routerId: batch.router_id
  };
};

/**
 * Transforms batch statistics to a map of status codes to counts
 * @param {Array} stats - Array of status statistics
 * @returns {Object} Map of status codes to counts
 */
const transformStats = (stats) => {
  return stats.reduce((acc, curr) => {
    acc[curr.status] = curr.count;
    return acc;
  }, {});
};

/**
 * Transforms a data entry to the expected format
 * @param {Object} data - Raw data entry from database
 * @returns {Object} Transformed data entry
 */
const transformDataEntry = (data) => {
  return {
    dataId: data.data_id,
    tableName: data.table_name,
    eventType: data.event_type,
    rowData: data.row_data,
    oldData: data.old_data,
    pkData: data.pk_data,
    createTime: data.create_time,
    sourceNodeId: data.source_node_id,
    channelId: data.channel_id,
    triggerHistId: data.trigger_hist_id
  };
};

/**
 * Transforms a data event to the expected format
 * @param {Object} event - Raw data event from database
 * @returns {Object} Transformed data event
 */
const transformDataEvent = (event) => {
  return {
    dataId: event.data_id,
    batchId: event.batch_id,
    routerId: event.router_id,
    createTime: event.create_time,
    tableId: event.table_name
  };
};

module.exports = {
  transformBatch,
  transformStats,
  transformDataEntry,
  transformDataEvent
};