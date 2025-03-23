import { useState, useEffect, useContext, memo } from 'react';
import {
  Typography,
  Box,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { fetchNodes } from '../api/models/nodes';

// Import components
import { 
  NodeCardSkeleton, 
  ErrorMessage, 
  NodesGrid,
  MemoryUsageDisplay,
  NodeUtils
} from '../components/nodes';

import './Nodes.css';

/**
 * Nodes component that displays node information in a modern Bento Grid layout
 * @component
 * @returns {JSX.Element} The rendered Nodes component
 */
const Nodes = memo(function Nodes() {
  const [nodes, setNodes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchNodesData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchNodes();
        setNodes(data);
      } catch (error) {
        console.error('Error fetching nodes:', error);
        setError(error.message);
        setNodes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNodesData();
    const interval = setInterval(fetchNodesData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle retry when error occurs
  const handleRetry = () => {
    const fetchNodesData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchNodes();
        setNodes(data);
      } catch (error) {
        console.error('Error fetching nodes:', error);
        setError(error.message);
        setNodes([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNodesData();
  };

  // Format memory usage for display
  const formatMemoryUsage = (memoryUsage) => {
    if (!memoryUsage) return 'N/A';
    return <MemoryUsageDisplay memoryUsage={memoryUsage} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="nodes-container"
    >
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nodes
        </Typography>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton 
            onClick={handleRetry} 
            color="primary" 
            aria-label="Refresh nodes data"
            sx={{ 
              backgroundColor: 'var(--surface)', 
              boxShadow: 'var(--shadow)',
              '&:hover': { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' } 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/>
            </svg>
          </IconButton>
        </motion.div>
      </Box>
      
      <AnimatePresence>
        {error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : (
          <NodesGrid 
            nodes={nodes}
            isLoading={isLoading}
            getStatusColor={NodeUtils.getStatusColor}
            formatMemoryUsage={formatMemoryUsage}
            formatDate={NodeUtils.formatDate}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default Nodes;