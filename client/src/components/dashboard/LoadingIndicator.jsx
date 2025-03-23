import { memo } from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * LoadingIndicator component that displays a loading message with animation
 * @component
 * @param {Object} props - Component props
 * @param {string} props.message - The loading message to display
 * @returns {JSX.Element} The rendered LoadingIndicator component
 */
const LoadingIndicator = memo(function LoadingIndicator({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center', padding: '40px' }}
      role="status"
      aria-live="polite"
    >
      <Typography 
        variant="h6" 
        color="textSecondary"
        style={{ 
          color: 'var(--text-secondary)'
        }}
      >
        {message}
      </Typography>
    </motion.div>
  );
});

LoadingIndicator.propTypes = {
  message: PropTypes.string
};

LoadingIndicator.defaultProps = {
  message: 'Loading dashboard data...'
};

export default LoadingIndicator;