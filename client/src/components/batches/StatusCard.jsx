import { useContext, useMemo } from 'react';
import { Card, CardContent, Typography, Chip, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../context/ThemeContext';
import { getStatusColor, getStatusLabel } from './BatchStatusUtils';

// Animation variants for consistent animations
const cardAnimationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, width: 'fit-content' },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
  whileHover: { scale: 1.03, y: -4 }
};
/**
 * StatusCard component for displaying batch status counts
 * @component
 * @param {Object} props - Component props
 * @param {string} props.status - The status code
 * @param {number} props.count - The count of batches with this status
 * @param {boolean} props.isSelected - Whether this status is currently selected
 * @param {function} props.onStatusClick - Function to call when card is clicked
 * @param {string} [props.statusLabel] - Optional override for the status label
 * @returns {JSX.Element} The rendered StatusCard component
 */
const StatusCard = ({ status, count, isSelected = false, onStatusClick = () => {}, statusLabel = null }) => {
  const { theme: themeMode } = useContext(ThemeContext);
  const muiTheme = useTheme();

  // Get the status color once
  const statusColor = useMemo(() => getStatusColor(status), [status]);

  // Determine if using default color
  const isDefaultColor = useMemo(() => statusColor === 'default', [statusColor]);

  // Get the display label once
  const displayLabel = useMemo(() => 
    statusLabel || getStatusLabel(status), 
    [status, statusLabel]
  );

  // Compute card styles once
  const cardStyles = useMemo(() => ({
    height: '100%',
    borderLeft: `4px solid ${isDefaultColor ? '#9e9e9e' : ''}`,
    borderColor: !isDefaultColor ? muiTheme.palette[statusColor].main : undefined,
    backgroundColor: themeMode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: isSelected ? 6 : 1,
    outline: isSelected 
      ? `2px solid ${!isDefaultColor 
          ? (themeMode === 'dark' ? '#fff' : muiTheme.palette[statusColor].main) 
          : '#9e9e9e'}`
      : 'none',
    transform: isSelected ? 'scale(1.03)' : 'scale(1)'
  }), [isDefaultColor, isSelected, muiTheme.palette, statusColor, themeMode]);

  // Compute chip styles once
  const chipStyles = useMemo(() => ({ 
    mt: 1,
    color: themeMode === 'dark' ? 'white' : undefined,
    '& .MuiChip-label': {
      color: themeMode === 'dark' ? 'white' : undefined
    }
  }), [themeMode]);

  // Compute aria label once
  const ariaLabel = useMemo(() => 
    `${displayLabel} status count${isSelected ? ' (selected)' : ''}`,
    [displayLabel, isSelected]
  );
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <motion.div {...cardAnimationVariants}>
        <Card 
          sx={cardStyles}
          onClick={() => onStatusClick(status)}
          role="button"
          aria-label={ariaLabel}
          aria-pressed={isSelected}
        >
          <CardContent>
            <Typography variant="h6" component="div" align="center">
              {count}
            </Typography>
            <Typography variant="body2" component="div" align="center">
              <Chip
                label={displayLabel}
                color={statusColor}
                size="small"
                sx={chipStyles}
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
  count: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  onStatusClick: PropTypes.func,
  statusLabel: PropTypes.string
};

export default StatusCard;