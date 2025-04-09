/**
 * @module QueryBuilder
 * @description Utility class for building SQL queries
 * @author Yuri V
 */

/**
 * Utility class for building SQL queries
 * @class QueryBuilder
 */
class QueryBuilder {
  /**
   * Creates a new query builder
   * @param {string} tableName - The table to query
   */
  constructor(tableName) {
    this.tableName = tableName;
    this.conditions = [];
    this.params = [];
    this.orderBy = '';
    this.limit = '';
    this.groupBy = '';
    this.selectFields = '*';
  }

  /**
   * Sets the fields to select
   * @param {string} fields - Fields to select
   * @returns {QueryBuilder} This builder instance
   */
  select(fields) {
    this.selectFields = fields;
    return this;
  }

  /**
   * Adds a condition to the query
   * @param {string} condition - The condition
   * @param {any} value - The parameter value
   * @returns {QueryBuilder} This builder instance
   */
  where(condition, value) {
    if (value !== undefined && value !== null) {
      this.conditions.push(condition);
      this.params.push(value);
    }
    return this;
  }

  /**
   * Sets the ORDER BY clause
   * @param {string} field - Field to order by
   * @param {string} direction - Sort direction
   * @returns {QueryBuilder} This builder instance
   */
  order(field, direction = 'DESC') {
    this.orderBy = `ORDER BY ${field} ${direction}`;
    return this;
  }

  /**
   * Sets the LIMIT clause
   * @param {number} count - Maximum number of records
   * @returns {QueryBuilder} This builder instance
   */
  limitTo(count) {
    this.limit = `LIMIT ${count}`;
    return this;
  }

  /**
   * Sets the GROUP BY clause
   * @param {string} field - Field to group by
   * @returns {QueryBuilder} This builder instance
   */
  group(field) {
    this.groupBy = `GROUP BY ${field}`;
    return this;
  }

  /**
   * Builds the SQL query
   * @returns {Object} Object with query string and parameters
   */
  build() {
    let query = `SELECT ${this.selectFields} FROM ${this.tableName}`;
    
    if (this.conditions.length > 0) {
      query += ' WHERE ' + this.conditions.join(' AND ');
    }
    
    if (this.groupBy) {
      query += ' ' + this.groupBy;
    }
    
    if (this.orderBy) {
      query += ' ' + this.orderBy;
    }
    
    if (this.limit) {
      query += ' ' + this.limit;
    }
    
    return { query, params: this.params };
  }
}

module.exports = QueryBuilder;