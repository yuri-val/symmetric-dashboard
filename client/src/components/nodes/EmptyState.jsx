import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Empty state component displayed when no nodes are found
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.title] - Title to display
 * @param {string} [props.message] - Message to display
 * @returns {JSX.Element} The rendered EmptyState component
 */
const EmptyState = ({ title = 'No Nodes Found', message = 'There are no nodes available in the system right now.' }) => (
  <motion.div 
    className="bento-item empty-state"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    role="status"
    aria-live="polite"
  >
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="body2" align="center">
        {message}
      </Typography>
    </Box>
  </motion.div>
);

EmptyState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string
};

export default EmptyState;