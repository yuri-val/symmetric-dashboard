import React from 'react';
import {
  TableRow,
  TableCell,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';

// Constants
const COLUMN_SPAN = 7;
/**
 * BatchEmptyState component for displaying when no batches are found
 * @component
 * @param {Object} props - Component props
 * @param {('incoming'|'outgoing')} props.direction - The direction of batches ('incoming' or 'outgoing')
 * @returns {JSX.Element} The rendered BatchEmptyState component
 */
const BatchEmptyState = ({ direction }) => (
  <TableRow>
    <TableCell colSpan={COLUMN_SPAN} align="center">
      <Typography variant="body2" color="text.secondary">
        No {direction} batches found
      </Typography>
    </TableCell>
  </TableRow>
);

BatchEmptyState.propTypes = {
  direction: PropTypes.oneOf(['incoming', 'outgoing']).isRequired
};

export default BatchEmptyState;