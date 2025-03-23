import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Error message component for node data fetching errors
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.message] - Error message to display
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 * @returns {JSX.Element} The rendered ErrorMessage component
 */
const ErrorMessage = ({ message, onRetry }) => (
  <motion.div 
    className="bento-item error-message"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    role="alert"
    aria-live="assertive"
  >
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h6" gutterBottom>😕 Oops, something's off!</Typography>
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
        {message || "We couldn't fetch the node data. Please try again."}
      </Typography>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        style={{
          padding: '8px 16px',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer'
        }}
      >
        Try Again
      </motion.button>
    </Box>
  </motion.div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func.isRequired
};

export default ErrorMessage;