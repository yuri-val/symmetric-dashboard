import { memo } from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * ErrorDisplay component that displays error messages with animation
 * @component
 * @param {Object} props - Component props
 * @param {string} props.message - The error message to display
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 * @returns {JSX.Element} The rendered ErrorDisplay component
 */
const ErrorDisplay = memo(function ErrorDisplay({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="error-container"
      role="alert"
      aria-live="assertive"
      style={{
        padding: '12px',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '20px',
        border: '1px solid var(--border)'
      }}
    >
      <Typography 
        color="error" 
        gutterBottom
      >
        <span role="img" aria-label="Error">⚠️</span> {message}
      </Typography>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
});

ErrorDisplay.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func
};

export default ErrorDisplay;