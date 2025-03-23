import { Grid, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import StatusCard from './StatusCard';

/**
 * StatusCardList component for displaying a collection of batch status cards
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.stats - The stats object containing status counts
 * @param {string} props.direction - The direction of batches ('incoming' or 'outgoing')
 * @param {string} props.title - The title for this group of status cards
 * @returns {JSX.Element} The rendered StatusCardList component
 */
const StatusCardList = ({ stats, direction, title }) => {
  const statData = stats[direction] || {};
  const statKeys = Object.keys(statData);
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} className="bento-grid">
        <AnimatePresence>
          {statKeys.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" align="center">
                  No {direction} batches found
                </Typography>
              </Grid>
            </motion.div>
          ) : (
            statKeys.map(status => (
              <StatusCard 
                key={`${direction}-${status}`} 
                status={status} 
                count={statData[status]} 
              />
            ))
          )}
        </AnimatePresence>
      </Grid>
    </Box>
  );
};

StatusCardList.propTypes = {
  stats: PropTypes.object.isRequired,
  direction: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default StatusCardList;