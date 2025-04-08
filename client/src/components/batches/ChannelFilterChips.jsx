import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Box, Chip, Typography, useTheme, Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { fetchUniqueChannels } from '../../api/models/channels';
import { ThemeContext } from '../../context/ThemeContext';

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

/**
 * Renders a loading state for the channel filter
 * @returns {JSX.Element} Loading state component
 */
const LoadingState = () => (
  <Box sx={{ mb: 2 }}>
    <Skeleton width="180px" height={24} />
    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
      <Skeleton variant="rounded" width={80} height={32} />
      <Skeleton variant="rounded" width={100} height={32} />
      <Skeleton variant="rounded" width={90} height={32} />
    </Box>
  </Box>
);

/**
 * Renders an error state for the channel filter
 * @param {string} errorMessage - The error message to display
 * @returns {JSX.Element} Error state component
 */
const ErrorState = ({ errorMessage }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="error">
      {errorMessage}
    </Typography>
  </Box>
);

ErrorState.propTypes = {
  errorMessage: PropTypes.string.isRequired
};

/**
 * ChannelFilterChips component for displaying and selecting channel filters
 * @component
 * @author Yuri V
 * @param {Object} props - Component props
 * @param {string|null} props.selectedChannel - The currently selected channel ID
 * @param {function} props.onChannelSelect - Function to call when a channel is selected
 * @returns {JSX.Element} The rendered ChannelFilterChips component
 */
const ChannelFilterChips = ({ selectedChannel = null, onChannelSelect }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme: themeMode } = useContext(ThemeContext);
  const muiTheme = useTheme();

  // Compute container styles based on theme
  const containerStyles = useMemo(() => ({
    mb: 3, 
    mt: 1,
    backgroundColor: themeMode === 'dark' ? 'rgba(30, 30, 30, 0.4)' : 'rgba(255, 255, 255, 0.4)',
    borderRadius: 1,
    p: 2
  }), [themeMode]);

  // Compute chip styles based on theme and selection state
  const getChipStyles = useCallback((isSelected) => ({
    fontWeight: isSelected ? 'bold' : 'normal',
    '&:hover': { 
      boxShadow: 1,
      backgroundColor: themeMode === 'dark' 
        ? isSelected ? muiTheme.palette.primary.dark : 'rgba(70, 70, 70, 0.8)'
        : undefined
    },
    color: themeMode === 'dark' && !isSelected ? 'white' : undefined
  }), [themeMode, muiTheme.palette.primary.dark]);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUniqueChannels();
        // Removed console.log
        setChannels(data.map(item => item.channel_id));
      } catch (err) {
        console.error('Error loading channels:', err);
        setError('Failed to load channel filters');
      } finally {
        setLoading(false);
      }
    };

    loadChannels();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState errorMessage={error} />;
  }

  if (channels.length === 0) {
    return null;
  }

  return (
    <Box sx={containerStyles}>
      <Typography 
        variant="subtitle2" 
        gutterBottom
        color={themeMode === 'dark' ? 'white' : 'text.primary'}
      >
        Filter by Channel:
      </Typography>
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <AnimatePresence>
            {channels.map((channelId) => {
              const isSelected = selectedChannel === channelId;
              const displayName = channelId || '(empty)';

              return (
                <motion.div key={channelId || 'empty'} variants={chipVariants}>
                  <Chip
                    label={displayName}
                    color={isSelected ? 'primary' : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    onClick={() => onChannelSelect(channelId)}
                    sx={getChipStyles(isSelected)}
                    aria-pressed={isSelected}
                    data-testid={`channel-chip-${channelId || 'empty'}`}
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

ChannelFilterChips.propTypes = {
  selectedChannel: PropTypes.string,
  onChannelSelect: PropTypes.func.isRequired
};

// Removed defaultProps

export default ChannelFilterChips;