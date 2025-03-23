import { useContext } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

/**
 * NodeGroupList component for displaying node groups configuration
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.nodeGroups - Array of node group objects
 * @returns {JSX.Element} The rendered NodeGroupList component
 */
const NodeGroupList = ({ nodeGroups }) => {
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
      {nodeGroups.length === 0 ? (
        <Typography 
          variant="body2" 
          color="textSecondary"
          sx={{ fontStyle: 'italic', py: 2, textAlign: 'center' }}
          aria-live="polite"
        >
          No node groups available
        </Typography>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={listVariants}
        >
          <List aria-label="Node groups configuration list">
            <AnimatePresence>
              {nodeGroups.map((group) => (
                <motion.div 
                  key={group.id}
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
                        <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'var(--fw-medium)' }}>
                          {group.id}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" component="span" sx={{ color: 'var(--text-secondary)' }}>
                          {group.description || 'No description available'}
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

NodeGroupList.propTypes = {
  nodeGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired
};

export default NodeGroupList;