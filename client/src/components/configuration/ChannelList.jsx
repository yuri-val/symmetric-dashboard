import { useContext } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText, Typography, Box, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

/**
 * ChannelList component for displaying channel configuration
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.channels - Array of channel objects
 * @returns {JSX.Element} The rendered ChannelList component
 */
const ChannelList = ({ channels }) => {
  const { theme } = useContext(ThemeContext);
  
  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    hover: { scale: 1.02, backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }
  };

  return (
    <Box>
      {channels.length === 0 ? (
        <Typography 
          variant="body2" 
          color="textSecondary"
          sx={{ fontStyle: 'italic', py: 2, textAlign: 'center' }}
          aria-live="polite"
        >
          No channels available
        </Typography>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={listVariants}
        >
          <List aria-label="Channels configuration list">
            <AnimatePresence>
              {channels.map((channel) => (
                <motion.div 
                  key={channel.id}
                  variants={itemVariants}
                  whileHover="hover"
                  transition={{ duration: 0.2 }}
                >
                  <ListItem 
                    divider 
                    sx={{ 
                      borderRadius: 'var(--radius-sm)',
                      mb: 1,
                      '&:hover': {
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'var(--fw-medium)' }}>
                            {channel.id}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={`Max: ${channel.max_batch_size || 'N/A'}`}
                            color="primary"
                            variant={theme === 'dark' ? 'outlined' : 'filled'}
                            sx={{ 
                              height: 20, 
                              fontSize: 'var(--fs-xs)',
                              opacity: 0.8
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" component="span" sx={{ color: 'var(--text-secondary)' }}>
                          {channel.description || 'No description available'}
                        </Typography>
                      }
                      primaryTypographyProps={{ 
                        color: 'var(--text-primary)'
                      }}
                      secondaryTypographyProps={{ 
                        color: 'var(--text-secondary)'
                      }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        </motion.div>
      )}
    </Box>
  );
};

ChannelList.propTypes = {
  channels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      max_batch_size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string
    })
  ).isRequired
};

export default ChannelList;