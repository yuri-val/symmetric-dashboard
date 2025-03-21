const DatabaseRepository = require('../repositories/database.repository');
const logger = require('../logger');

class BatchService {
  constructor(config) {
    if (!config) {
      throw new Error('Database configuration is required');
    }
    this.database = new DatabaseRepository(config);
  }

async getBatchStatus() {
  try {
    // Get outgoing batches
    const outgoingBatches = await this.database.executeQuery(
      'SELECT * FROM sym_outgoing_batch ORDER BY create_time DESC LIMIT 100'
    );

    // Get incoming batches
    const incomingBatches = await this.database.executeQuery(
      'SELECT * FROM sym_incoming_batch ORDER BY create_time DESC LIMIT 100'
    );

    // Get status statistics for outgoing batches
    const outgoingStats = await this.database.executeQuery(
      'SELECT status, COUNT(*) as count FROM sym_outgoing_batch GROUP BY status'
    );

    // Get status statistics for incoming batches
    const incomingStats = await this.database.executeQuery(
      'SELECT status, COUNT(*) as count FROM sym_incoming_batch GROUP BY status'
    );

    // Transform data to match frontend expectations
    const transformBatch = (batch) => ({
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
    });

    // Transform stats data
    const transformStats = (stats) => 
      stats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {});

    return {
      outgoing: outgoingBatches.map(transformBatch),
      incoming: incomingBatches.map(transformBatch),
      stats: {
        outgoing: transformStats(outgoingStats),
        incoming: transformStats(incomingStats)
      }
    };
  } catch (error) {
    logger.error('Error in getBatchStatus:', error);
    throw error;
  }
}
}

module.exports = BatchService;