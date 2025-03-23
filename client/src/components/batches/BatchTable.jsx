import { useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../context/ThemeContext';
import { getStatusColor, getStatusLabel } from './BatchStatusUtils';

/**
 * BatchTable component for displaying batch data in a table
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.batchList - The list of batches to display
 * @param {string} props.direction - The direction of batches ('incoming' or 'outgoing')
 * @returns {JSX.Element} The rendered BatchTable component
 */
const BatchTable = ({ batchList, direction }) => {
  const { theme } = useContext(ThemeContext);
  
  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.05 
      }
    }
  };
  
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
          backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          transition: 'all 0.3s ease'
        }}
      >
        <Table aria-label={`${direction} batches table`}>
          <TableHead>
            <TableRow>
              <TableCell>Batch ID</TableCell>
              <TableCell>Node ID</TableCell>
              <TableCell>Channel</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Error Flag</TableCell>
              <TableCell>Byte Count</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batchList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No {direction} batches found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              batchList.map((batch) => (
                <motion.tr
                  key={`${batch.batchId}-${batch.nodeId}`}
                  variants={rowVariants}
                  component={TableRow}
                  whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(60, 60, 60, 0.5)' : 'rgba(240, 240, 240, 0.5)' }}
                >
                  <TableCell>{batch.batchId}</TableCell>
                  <TableCell>{batch.nodeId}</TableCell>
                  <TableCell>{batch.channelId}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(batch.status)}
                      color={getStatusColor(batch.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={batch.errorFlag ? 'Yes' : 'No'}
                      color={batch.errorFlag ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{batch.byteCount}</TableCell>
                  <TableCell>
                    {new Date(batch.createTime).toLocaleString()}
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
};

BatchTable.propTypes = {
  batchList: PropTypes.array.isRequired,
  direction: PropTypes.string.isRequired
};

export default BatchTable;