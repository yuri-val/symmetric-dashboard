import { useState, useEffect, useContext } from 'react';
import { Typography, Box, Container, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { fetchBatchStatus } from '../api/models/batches';
import BatchTabs from '../components/batches/BatchTabs';
import BatchTable from '../components/batches/BatchTable';
import StatusCardList from '../components/batches/StatusCardList';

import './Batches.css';

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
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setError(null);
        const data = await fetchBatchStatus();
        setBatches({
          incoming: data.incoming || [],
          outgoing: data.outgoing || []
        });
        
        // Use stats directly from the API response
        setStats({
          incoming: data.stats?.incoming || {},
          outgoing: data.stats?.outgoing || {}
        });
      } catch (error) {
        console.error('Error fetching batches:', error);
        setError(error.message);
        setBatches({ incoming: [], outgoing: [] });
        setStats({ incoming: {}, outgoing: {} });
      }
    };

    fetchBatches();
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  // Page animation variants
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
        
        {error ? (
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
        ) : (
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <StatusCardList 
                    stats={stats} 
                    direction="outgoing" 
                    title="Outgoing Batch Status" 
                  />
                </motion.div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <StatusCardList 
                    stats={stats} 
                    direction="incoming" 
                    title="Incoming Batch Status" 
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
        )}
      </motion.div>
    </Container>
  );
}

export default Batches;
