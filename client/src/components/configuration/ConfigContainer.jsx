import { useState, useEffect, useContext } from 'react';
import { Grid, Typography, Box, CircularProgress, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../context/ThemeContext';
import ConfigCard from './ConfigCard';
import NodeGroupList from './NodeGroupList';
import ChannelList from './ChannelList';
import TriggerList from './TriggerList';
import { fetchEngineConfig } from '../../api/models/engine';

/**
 * ConfigContainer component that manages and displays configuration data
 * @component
 * @returns {JSX.Element} The rendered ConfigContainer component
 */
const ConfigContainer = () => {
  const [config, setConfig] = useState({
    nodeGroups: [],
    channels: [],
    triggers: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchEngineConfig();
        setConfig(response);
      } catch (error) {
        console.error('Error fetching configuration:', error);
        setError(error.message || 'Failed to fetch configuration data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchConfig, 300000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}
        className="fade-in"
        role="status"
        aria-label="Loading configuration data"
      >
        <CircularProgress size={40} color="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading configuration data...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderLeft: '4px solid',
            borderColor: 'error.main',
            borderRadius: 'var(--radius-md)'
          }}
          role="alert"
          aria-live="assertive"
        >
          <Typography variant="h6" gutterBottom>
            😕 Oops, something's off!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            Try Again
          </motion.button>
        </Paper>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="config-container"
    >
      <motion.div variants={itemVariants}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'var(--fw-semibold)',
            mb: 3
          }}
        >
          Configuration
        </Typography>
      </motion.div>

      <Grid 
        container 
        spacing={3} 
        className="bento-grid"
        sx={{ 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          }
        }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <ConfigCard title="Node Groups" ariaLabel="Node groups configuration">
              <NodeGroupList nodeGroups={config.nodeGroups} />
            </ConfigCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <ConfigCard title="Channels" ariaLabel="Channels configuration">
              <ChannelList channels={config.channels} />
            </ConfigCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <ConfigCard title="Triggers" ariaLabel="Triggers configuration">
              <TriggerList triggers={config.triggers} />
            </ConfigCard>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default ConfigContainer;