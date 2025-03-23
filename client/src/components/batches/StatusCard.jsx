import { useContext } from 'react';
import { Card, CardContent, Typography, Chip, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../context/ThemeContext';
import { getStatusColor, getStatusLabel } from './BatchStatusUtils';

/**
 * StatusCard component for displaying batch status counts
 * @component
 * @param {Object} props - Component props
 * @param {string} props.status - The status code
 * @param {number} props.count - The count of batches with this status
 * @returns {JSX.Element} The rendered StatusCard component
 */
const StatusCard = ({ status, count }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, width: 'fit-content' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.03, y: -4 }}
      >
        <Card 
          sx={{ 
            height: '100%',
            borderLeft: `4px solid ${getStatusColor(status) === 'default' ? '#9e9e9e' : ''}`,
            borderColor: getStatusColor(status) !== 'default' ? 
              theme => theme.palette[getStatusColor(status)].main : undefined,
            backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease'
          }}
          role="region"
          aria-label={`${getStatusLabel(status)} status count`}
        >
          <CardContent>
            <Typography variant="h6" component="div" align="center">
              {count}
            </Typography>
            <Typography variant="body2" component="div" align="center">
              <Chip
                label={getStatusLabel(status)}
                color={getStatusColor(status)}
                size="small"
                sx={{ 
                  mt: 1,
                  color: theme === 'dark' ? 'white' : undefined,
                  '& .MuiChip-label': {
                    color: theme === 'dark' ? 'white' : undefined
                  }
                }}
              />
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );
};

StatusCard.propTypes = {
  status: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired
};

export default StatusCard;