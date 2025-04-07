import React from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Default column configuration for the batch table
 */
const DEFAULT_COLUMNS = [
  { id: 'batchId', label: 'Batch ID', tooltip: 'Unique identifier for the batch' },
  { id: 'nodeId', label: 'Node ID', tooltip: 'ID of the node associated with this batch' },
  { id: 'channelId', label: 'Channel', tooltip: 'Communication channel used for this batch' },
  { id: 'status', label: 'Status', tooltip: 'Current status of the batch' },
  { id: 'errorFlag', label: 'Error Flag', tooltip: 'Indicates if the batch has errors' },
  { id: 'byteCount', label: 'Byte Count', tooltip: 'Size of the batch in bytes' },
  { id: 'createTime', label: 'Created', tooltip: 'When the batch was created' },
];

/**
 * BatchTableHeader component for displaying the table header
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} [props.columns] - Custom column configuration
 * @param {boolean} [props.showTooltips=false] - Whether to show tooltips on column headers
 * @returns {JSX.Element} The rendered BatchTableHeader component
 */
const BatchTableHeader = ({ columns = DEFAULT_COLUMNS, showTooltips = false }) => (
  <TableHead>
    <TableRow>
      {columns.map(column => (
        <TableCell key={column.id}>
          {showTooltips && column.tooltip ? (
            <Tooltip title={column.tooltip} arrow placement="top">
              <span>{column.label}</span>
            </Tooltip>
          ) : (
            column.label
          )}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

BatchTableHeader.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      tooltip: PropTypes.string,
    })
  ),
  showTooltips: PropTypes.bool,
};

export default BatchTableHeader;