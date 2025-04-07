import React, { useMemo } from 'react';
import {
  TableCell,
  TableRow,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { getStatusColor, getStatusLabel } from './BatchStatusUtils';

// Constants
const ANIMATION_Y_OFFSET = 20;
/**
 * Renders a chip with appropriate color based on status
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Text to display in the chip
 * @param {string} props.color - MUI color for the chip
 * @returns {JSX.Element} The rendered status chip
 */
const StatusChip = ({ label, color }) => (
  <Chip
    label={label}
    color={color}
    size="small"
  />
);

StatusChip.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

/**
 * BatchTableRow component for displaying a single batch row
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.batch - The batch object containing batch details
 * @param {string} props.direction - The direction of the batch ('incoming' or 'outgoing')
 * @param {boolean} props.isExpanded - Whether the row is expanded
 * @param {Function} props.onToggleExpand - Function to toggle row expansion
 * @param {string} props.theme - Current theme ('dark' or 'light')
 * @returns {JSX.Element} The rendered BatchTableRow component
 */
const BatchTableRow = ({ batch, direction, isExpanded, onToggleExpand, theme }) => {
  // Animation variants
  const rowVariants = useMemo(() => ({
    hidden: { opacity: 0, y: ANIMATION_Y_OFFSET },
    visible: { opacity: 1, y: 0 }
  }), []);

  // Calculate background colors based on theme and expanded state
  const backgroundColors = useMemo(() => ({
    hover: theme === 'dark' ? 'rgba(60, 60, 60, 0.5)' : 'rgba(240, 240, 240, 0.5)',
    expanded: theme === 'dark' ? 'rgba(50, 50, 50, 0.8)' : 'rgba(235, 235, 235, 0.8)'
  }), [theme]);

  // Handle expand button click with stopPropagation
  const handleExpandClick = (e) => {
    e.stopPropagation();
    onToggleExpand(batch.batchId);
  };

  // Format date for display
  const formattedDate = useMemo(() => 
    new Date(batch.createTime).toLocaleString()
  , [batch.createTime]);
  return (
    <motion.tr
      variants={rowVariants}
      component={TableRow}
      whileHover={{ backgroundColor: backgroundColors.hover }}
      onClick={() => onToggleExpand(batch.batchId)}
      sx={{ 
        cursor: 'pointer',
        '&.MuiTableRow-root': {
          backgroundColor: isExpanded ? backgroundColors.expanded : 'inherit'
        }
      }}
      aria-expanded={isExpanded}
      aria-label={`Batch ${batch.batchId} details`}
    >
      <TableCell>
        <Box display="flex" alignItems="center">
          <IconButton
            aria-label={isExpanded ? "collapse row" : "expand row"}
            size="small"
            onClick={handleExpandClick}
          >
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {batch.batchId}
        </Box>
      </TableCell>
      <TableCell>{batch.nodeId}</TableCell>
      <TableCell>{batch.channelId}</TableCell>
      <TableCell>
        <StatusChip
          label={getStatusLabel(batch.status)}
          color={getStatusColor(batch.status)}
        />
      </TableCell>
      <TableCell>
        <StatusChip
          label={batch.errorFlag ? 'Yes' : 'No'}
          color={batch.errorFlag ? 'error' : 'success'}
        />
      </TableCell>
      <TableCell>{batch.byteCount}</TableCell>
      <TableCell>{formattedDate}</TableCell>
    </motion.tr>
  );
};

BatchTableRow.propTypes = {
  batch: PropTypes.shape({
    batchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nodeId: PropTypes.string.isRequired,
    channelId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    errorFlag: PropTypes.bool.isRequired,
    byteCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    createTime: PropTypes.oneOfType([
      PropTypes.string, 
      PropTypes.number, 
      PropTypes.instanceOf(Date)
    ]).isRequired
  }).isRequired,
  direction: PropTypes.oneOf(['incoming', 'outgoing']).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['dark', 'light']).isRequired
};

export default BatchTableRow;