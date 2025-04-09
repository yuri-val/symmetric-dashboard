import { Box, Chip, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { getStatusColor, getStatusLabel } from './BatchStatusUtils';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

// Animation variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const chipVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8 }
};

const containerStyles = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: 2, 
  border: '1px solid #1976d2', 
  borderRadius: '8px', 
  p: 1,
  position: 'relative',
  boxShadow: 'var(--shadow)'
};

/**
 * StatusFilterChips component for displaying and selecting status filters
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.stats - The stats object containing status counts
 * @param {string} props.direction - The direction of batches ('incoming' or 'outgoing')
 * @param {string} props.title - The title for this group of status filters
 * @param {string|null} props.selectedStatus - The currently selected status
 * @param {function} props.onStatusClick - Function to call when a status is selected
 * @returns {JSX.Element} The rendered StatusFilterChips component
 */
const StatusFilterChips = ({ stats, direction, title, selectedStatus = null, onStatusClick }) => {
  const { theme: themeMode } = useContext(ThemeContext);
  const muiTheme = useTheme();
  const statData = stats[direction] || {};
  const statKeys = Object.keys(statData);

  // Compute chip styles based on theme and selection state
  const getChipStyles = (isSelected, statusColor) => ({
    fontWeight: isSelected ? 'bold' : 'normal',
    '&:hover': { 
      boxShadow: 1,
      backgroundColor: themeMode === 'dark' 
        ? isSelected ? muiTheme.palette[statusColor].dark : 'rgba(70, 70, 70, 0.8)'
        : undefined
    },
    color: themeMode === 'dark' && !isSelected ? 'white' : undefined
  });

  if (statKeys.length === 0) {
    return null;
  }

  return (
    <Box sx={containerStyles}>
      <Typography 
        variant="subtitle2"
        color={themeMode === 'dark' ? 'white' : 'text.primary'}
        sx={{ whiteSpace: 'nowrap', textTransform: 'uppercase' }}
      >
        {title}:
      </Typography>
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <AnimatePresence>
            {statKeys.map((status) => {
              const isSelected = selectedStatus === status;
              const statusColor = getStatusColor(status);
              const displayName = `${getStatusLabel(status)} (${statData[status]})`;

              return (
                <motion.div key={status} variants={chipVariants}>
                  <Chip
                    label={displayName}
                    color={isSelected ? statusColor : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    onClick={() => onStatusClick(direction, status)}
                    sx={getChipStyles(isSelected, statusColor)}
                    aria-pressed={isSelected}
                    data-testid={`status-chip-${status}`}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      </motion.div>
    </Box>
  );
};

StatusFilterChips.propTypes = {
  stats: PropTypes.shape({
    incoming: PropTypes.object,
    outgoing: PropTypes.object
  }).isRequired,
  direction: PropTypes.oneOf(['incoming', 'outgoing']).isRequired,
  title: PropTypes.string.isRequired,
  selectedStatus: PropTypes.string,
  onStatusClick: PropTypes.func.isRequired
};

export default StatusFilterChips;