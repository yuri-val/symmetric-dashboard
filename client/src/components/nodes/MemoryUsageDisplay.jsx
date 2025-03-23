import { Box, LinearProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Component to display memory usage with a progress bar
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.memoryUsage - Memory usage data object with used and total properties
 * @returns {JSX.Element} The rendered MemoryUsageDisplay component
 */
const MemoryUsageDisplay = ({ memoryUsage }) => {
  if (!memoryUsage) return 'N/A';
  
  const usedMB = Math.round(memoryUsage.used / (1024 * 1024) * 10) / 10;
  const totalMB = Math.round(memoryUsage.total / (1024 * 1024) * 10) / 10;
  const percentage = Math.round((memoryUsage.used / memoryUsage.total) * 100);
  
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={percentage} 
          color={percentage > 80 ? "error" : percentage > 60 ? "warning" : "primary"} 
          aria-label={`Memory usage: ${percentage}%`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        />
      </Box>
      <Box sx={{ minWidth: 35, mt: 0.5 }}>
        <Typography variant="body2">
          {`${usedMB}MB / ${totalMB}MB (${percentage}%)`}
        </Typography>
      </Box>
    </Box>
  );
};

MemoryUsageDisplay.propTypes = {
  memoryUsage: PropTypes.shape({
    used: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  })
};

export default MemoryUsageDisplay;