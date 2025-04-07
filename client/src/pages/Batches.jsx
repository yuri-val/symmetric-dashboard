import { useState, useEffect, useContext, useCallback } from 'react';
import { Typography, Box, Container, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { ThemeContext } from '../context/ThemeContext';
import { fetchBatchStatus } from '../api/models/batches';
import BatchTabs from '../components/batches/BatchTabs';
import BatchTable from '../components/batches/BatchTable';
import StatusCardList from '../components/batches/StatusCardList';

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
    outgoing: null
  });
  const { theme } = useContext(ThemeContext);

  const fetchBatches = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchBatchStatus({
        incomingStatus: selectedFilters.incoming,
        outgoingStatus: selectedFilters.outgoing
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <StatusCardList 
              stats={stats} 
              direction="outgoing" 
              title="Outgoing Batch Status" 
              selectedStatus={selectedFilters.outgoing}
              onStatusClick={handleStatusClick}
            />
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <StatusCardList 
              stats={stats} 
              direction="incoming" 
              title="Incoming Batch Status" 
              selectedStatus={selectedFilters.incoming}
              onStatusClick={handleStatusClick}
            />
          </motion.div>
        </Grid>
      </Grid>

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
        <motion.div variants={itemVariants}>
          <Typography variant="h4" gutterBottom>
            Batches
          </Typography>
        </motion.div>

        {error ? renderErrorMessage() : renderBatchContent()}
      </motion.div>
    </Container>
  );
}

// PropTypes for child components used in this file
StatusCardList.propTypes = {
  stats: PropTypes.shape({
    incoming: PropTypes.object,
    outgoing: PropTypes.object
  }).isRequired,
  direction: PropTypes.oneOf(['incoming', 'outgoing']).isRequired,
  title: PropTypes.string.isRequired,
  selectedStatus: PropTypes.string,
  onStatusClick: PropTypes.func.isRequired
};

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
