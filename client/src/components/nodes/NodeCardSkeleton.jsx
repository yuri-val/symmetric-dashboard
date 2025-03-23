import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Loading fallback component for node cards
 * @component
 * @returns {JSX.Element} The rendered NodeCardSkeleton component
 */
const NodeCardSkeleton = () => (
  <motion.div 
    className="bento-item skeleton"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    aria-label="Loading node data"
  >
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress size={40} color="primary" />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Loading node data...
      </Typography>
    </Box>
  </motion.div>
);

export default NodeCardSkeleton;