import { Grid, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import StatusCard from './StatusCard';
import { getStatusLabel } from './BatchStatusUtils';

// Animation variants for consistent animations
const emptyStateVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};
/**
 * StatusCardList component for displaying a collection of batch status cards
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.stats - The stats object containing status counts
 * @param {string} props.direction - The direction of batches ('incoming' or 'outgoing')
 * @param {string} props.title - The title for this group of status cards
 * @param {string|null} props.selectedStatus - The currently selected status
 * @param {function} props.onStatusClick - Function to call when a status card is clicked
 * @returns {JSX.Element} The rendered StatusCardList component
 */
const StatusCardList = ({ stats, direction, title, selectedStatus, onStatusClick }) => {
  const statData = stats[direction] || {};
  const statKeys = Object.keys(statData);

  /**
   * Renders the empty state when no batches are found
   * @returns {JSX.Element} The empty state component
   */
  const renderEmptyState = () => (
    <motion.div
      {...emptyStateVariants}
      style={{ width: '100%' }}
    >
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary" align="center">
          No {direction} batches found
        </Typography>
      </Grid>
    </motion.div>
  );

  /**
   * Renders the status cards for each batch status
   * @returns {JSX.Element[]} Array of StatusCard components
   */
  const renderStatusCards = () => 
    statKeys.map(status => (
      <StatusCard 
        key={`${direction}-${status}`} 
        status={status} 
        count={statData[status]}
        isSelected={selectedStatus === status}
        onStatusClick={() => onStatusClick(direction, status)}
        statusLabel={getStatusLabel(status)}
      />
    ));
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} className="bento-grid">
        <AnimatePresence>
          {statKeys.length === 0 
            ? renderEmptyState() 
            : renderStatusCards()
          }
        </AnimatePresence>
      </Grid>
    </Box>
  );
};

StatusCardList.propTypes = {
  stats: PropTypes.shape({
    incoming: PropTypes.object,
    outgoing: PropTypes.object
  }).isRequired,
  direction: PropTypes.oneOf(['incoming', 'outgoing']).isRequired,
  title: PropTypes.string.isRequired,
  selectedStatus: PropTypes.string,
  onStatusClick: PropTypes.func
};

StatusCardList.defaultProps = {
  selectedStatus: null,
  onStatusClick: () => {}
};

export default StatusCardList;