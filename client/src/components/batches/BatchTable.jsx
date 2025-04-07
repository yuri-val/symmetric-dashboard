import React, { useContext, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Collapse,
  TableCell,
} from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../context/ThemeContext';
import BatchTableHeader from './BatchTableHeader';
import BatchTableRow from './BatchTableRow';
import BatchDetailsRow from './BatchDetailsRow';
import BatchEmptyState from './BatchEmptyState';

// Constants
const CELL_SPAN = 8;
const ANIMATION_DURATION = 0.5;
const STAGGER_DELAY = 0.05;
/**
 * Renders a batch row with its expandable details
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.batch - The batch data
 * @param {string} props.direction - The direction of the batch
 * @param {string|null} props.expandedBatchId - Currently expanded batch ID
 * @param {Function} props.onToggleExpand - Function to toggle expansion
 * @param {string} props.theme - Current theme
 * @returns {JSX.Element} The rendered batch row with details
 */
const BatchRowWithDetails = ({ batch, direction, expandedBatchId, onToggleExpand, theme }) => {
  const isExpanded = expandedBatchId === batch.batchId;

  return (
    <React.Fragment key={`${batch.batchId}-${batch.nodeId}`}>
      <BatchTableRow 
        batch={batch} 
        direction={direction} 
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        theme={theme}
      />
      <TableRow>
        <TableCell 
          style={{ paddingBottom: 0, paddingTop: 0 }} 
          colSpan={CELL_SPAN}
        >
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <BatchDetailsRow 
              batch={batch} 
              direction={direction} 
              isOpen={isExpanded} 
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

BatchRowWithDetails.propTypes = {
  batch: PropTypes.shape({
    batchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nodeId: PropTypes.string.isRequired
  }).isRequired,
  direction: PropTypes.oneOf(['incoming', 'outgoing']).isRequired,
  expandedBatchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.oneOf([null])]),
  onToggleExpand: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired
};

/**
 * BatchTable component for displaying batch data in a table
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.batchList - The list of batches to display
 * @param {('incoming'|'outgoing')} props.direction - The direction of batches
 * @returns {JSX.Element} The rendered BatchTable component
 */
const BatchTable = ({ batchList, direction }) => {
  const { theme } = useContext(ThemeContext);
  const [expandedBatchId, setExpandedBatchId] = useState(null);

  // Animation variants
  const tableVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: ANIMATION_DURATION,
        staggerChildren: STAGGER_DELAY
      }
    }
  }), []);

  // Get background color based on theme
  const getBackgroundColor = useMemo(() => 
    theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'
  , [theme]);
  // Toggle row expansion
  const handleRowClick = (batchId) => {
    setExpandedBatchId(prevId => prevId === batchId ? null : batchId);
  };

  // Determine if table has content
  const hasContent = batchList.length > 0;
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className="table-container"
    >
      <TableContainer 
        component={Paper}
        sx={{
          backgroundColor: getBackgroundColor,
          transition: 'all 0.3s ease'
        }}
      >
        <Table aria-label={`${direction} batches table`}>
          <BatchTableHeader />
          <TableBody>
            {!hasContent ? (
              <BatchEmptyState direction={direction} />
            ) : (
              batchList.map((batch) => (
                <BatchRowWithDetails
                  key={`${batch.batchId}-${batch.nodeId}`}
                  batch={batch}
                  direction={direction}
                  expandedBatchId={expandedBatchId}
                  onToggleExpand={handleRowClick}
                  theme={theme}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
};

BatchTable.propTypes = {
  batchList: PropTypes.arrayOf(
    PropTypes.shape({
      batchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nodeId: PropTypes.string.isRequired,
      // Add other batch properties that are used in child components
    })
  ).isRequired,
  direction: PropTypes.oneOf(['incoming', 'outgoing']).isRequired
};

export default BatchTable;