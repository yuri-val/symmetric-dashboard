import { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Container, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { ThemeContext } from '../context/ThemeContext';
import { fetchBatchStatus } from '../api/models/batches';
import BatchTabs from '../components/batches/BatchTabs';
import BatchTable from '../components/batches/BatchTable';
import StatusFilterChips from '../components/batches/StatusFilterChips';
import ChannelFilterChips from '../components/batches/ChannelFilterChips';

import './Batches.css';

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1 
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};
/**
 * Batches page component that displays batch status and data
 * @component
 * @returns {JSX.Element} The rendered Batches page
 */
function Batches() {
  const [batches, setBatches] = useState({ incoming: [], outgoing: [] });
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({ incoming: {}, outgoing: {} });
  const [selectedFilters, setSelectedFilters] = useState({
    incoming: null,
    outgoing: null,
    channel: null
  });
  const { theme } = useContext(ThemeContext);

  const fetchBatches = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchBatchStatus({
        incomingStatus: selectedFilters.incoming,
        outgoingStatus: selectedFilters.outgoing,
        channel: selectedFilters.channel
      });

      setBatches({
        incoming: data?.incoming || [],
        outgoing: data?.outgoing || []
      });

      // Use stats directly from the API response
      setStats({
        incoming: data?.stats?.incoming || {},
        outgoing: data?.stats?.outgoing || {}
      });
    } catch (error) {
      console.error('Error fetching batches:', error);
      setError(error.message);
      setBatches({ incoming: [], outgoing: [] });
      setStats({ incoming: {}, outgoing: {} });
    }
  }, [selectedFilters]);

  useEffect(() => {
    fetchBatches();
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, [fetchBatches]);

  const handleTabChange = useCallback((newValue) => {
    setTabValue(newValue);
  }, []);

  const handleStatusClick = useCallback((direction, status) => {
    setSelectedFilters(prev => {
      // If the same status is clicked again, toggle it off
      if (prev[direction] === status) {
        return {
          ...prev,
          [direction]: null
        };
      }
      // Otherwise, set the new status filter
      return {
        ...prev,
        [direction]: status
      };
    });
  }, []);

  const handleChannelSelect = useCallback((channelId) => {
    setSelectedFilters(prev => {
      // If the same channel is clicked again, toggle it off
      if (prev.channel === channelId) {
        return {
          ...prev,
          channel: null
        };
      }
      // Otherwise, set the new channel filter
      return {
        ...prev,
        channel: channelId
      };
    });
  }, []);

  const renderErrorMessage = () => (
    <motion.div variants={itemVariants}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 3, 
          backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderLeft: '4px solid',
          borderColor: 'error.main'
        }}
      >
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      </Paper>
    </motion.div>
  );

  const renderBatchContent = () => (
    <Box sx={{ width: '100%' }}>
      

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        gap: 2, 
        mb: 3,
        '& > *': {
          flex: 1
        }
      }}>
        <motion.div variants={itemVariants}>
          <ChannelFilterChips
            selectedChannel={selectedFilters.channel}
            onChannelSelect={handleChannelSelect}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatusFilterChips
            stats={stats}
            direction="outgoing"
            title="OUT"
            selectedStatus={selectedFilters.outgoing}
            onStatusClick={handleStatusClick}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatusFilterChips
            stats={stats}
            direction="incoming"
            title="IN"
            selectedStatus={selectedFilters.incoming}
            onStatusClick={handleStatusClick}
          />
        </motion.div>
      </Box>

      <motion.div variants={itemVariants}>
        <BatchTabs 
          batches={batches} 
          onTabChange={handleTabChange} 
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        {tabValue === 0 && (
          <BatchTable 
            batchList={batches.outgoing || []} 
            direction="outgoing" 
          />
        )}
        {tabValue === 1 && (
          <BatchTable 
            batchList={batches.incoming || []} 
            direction="incoming" 
          />
        )}
      </motion.div>
    </Box>
  );
  return (
    <Container maxWidth="xl">
      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        {error ? renderErrorMessage() : renderBatchContent()}
      </motion.div>
    </Container>
  );
}


BatchTabs.propTypes = {
  batches: PropTypes.shape({
    incoming: PropTypes.array,
    outgoing: PropTypes.array
  }).isRequired,
  onTabChange: PropTypes.func.isRequired
};

BatchTable.propTypes = {
  batchList: PropTypes.array.isRequired,
  direction: PropTypes.oneOf(['incoming', 'outgoing']).isRequired
};

export default Batches;
