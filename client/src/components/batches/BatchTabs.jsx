import { useState, useContext } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../context/ThemeContext';

/**
 * BatchTabs component for switching between incoming and outgoing batches
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.batches - The batches object containing incoming and outgoing arrays
 * @param {Function} props.onTabChange - Callback function when tab changes
 * @returns {JSX.Element} The rendered BatchTabs component
 */
const BatchTabs = ({ batches, onTabChange }) => {
  const [tabValue, setTabValue] = useState(0);
  const { theme } = useContext(ThemeContext);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    onTabChange(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 2,
          backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          borderRadius: '8px',
          padding: '4px',
          transition: 'all 0.3s ease'
        }}
      >
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="batch direction tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(60, 60, 60, 0.4)' : 'rgba(240, 240, 240, 0.4)',
              }
            }
          }}
        >
          <Tab 
            label={`Outgoing (${batches.outgoing?.length || 0})`} 
            id="batch-tab-0"
            aria-controls="batch-tabpanel-0"
          />
          <Tab 
            label={`Incoming (${batches.incoming?.length || 0})`} 
            id="batch-tab-1"
            aria-controls="batch-tabpanel-1"
          />
        </Tabs>
      </Box>
    </motion.div>
  );
};

BatchTabs.propTypes = {
  batches: PropTypes.shape({
    incoming: PropTypes.array,
    outgoing: PropTypes.array
  }).isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default BatchTabs;