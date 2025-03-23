import { useState, useEffect, useContext, memo, lazy, Suspense } from 'react';
import {
  Typography,
  Chip,
  Box,
  LinearProgress,
  Tooltip,
  Paper,
  CircularProgress,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { fetchNodes } from '../api/models/nodes';
import PropTypes from 'prop-types';


import './Nodes.css';

// Loading fallback component
const NodeCardSkeleton = () => (
  <motion.div 
    className="bento-item skeleton"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    aria-label="Loading node data"
  >
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress size={40} color="primary" />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Loading node data...
      </Typography>
    </Box>
  </motion.div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <motion.div 
    className="bento-item error-message"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    role="alert"
    aria-live="assertive"
  >
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h6" gutterBottom>😕 Oops, something's off!</Typography>
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
        {message || "We couldn't fetch the node data. Please try again."}
      </Typography>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
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
    </Box>
  </motion.div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func.isRequired
};

// Node card component
const NodeCard = memo(function NodeCard({ node, getStatusColor, formatMemoryUsage, formatDate }) {
  const { theme } = useContext(ThemeContext);
  
  return (
    <motion.div 
      className="bento-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, boxShadow: 'var(--shadow)' }}
      role="article"
      aria-label={`Node ${node.nodeId} information`}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
            {node.nodeId}
          </Typography>
          <Chip
            label={node.status || 'Unknown'}
            color={getStatusColor(node.status)}
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Group: {node.nodeGroupId || 'N/A'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Host: {node.hostName || 'N/A'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            IP: {node.ipAddress || 'N/A'}
          </Typography>
          <Tooltip title={node.osInfo || 'N/A'} arrow placement="top">
            <Typography variant="body2" noWrap gutterBottom>
              OS: {node.osInfo || 'N/A'}
            </Typography>
          </Tooltip>
        </Box>
        
        <Typography variant="body2" gutterBottom>
          Memory Usage:
        </Typography>
        <Box sx={{ mb: 2 }}>
          {formatMemoryUsage(node.memoryUsage)}
        </Box>
        
        <Box sx={{ mt: 'auto', pt: 2, borderTop: `1px solid var(--border)` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Last Heartbeat:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDate(node.lastHeartbeat)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Version:
            </Typography>
            <Typography variant="body2">
              {node.version || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2">
                Errors:
              </Typography>
              <Chip
                label={node.batchInErrorCount >= 0 ? node.batchInErrorCount : 'N/A'}
                color={node.batchInErrorCount > 0 ? 'error' : 'default'}
                size="small"
                sx={{ 
                  minWidth: '60px',
                  backgroundColor: node.batchInErrorCount > 0 
                    ? 'error.main' 
                    : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  color: node.batchInErrorCount > 0 
                    ? 'white' 
                    : theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)'
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" align="right">
                Pending:
              </Typography>
              <Chip
                label={node.batchToSendCount >= 0 ? node.batchToSendCount : 'N/A'}
                color={node.batchToSendCount > 0 ? 'warning' : 'default'}
                size="small"
                sx={{ 
                  minWidth: '60px',
                  backgroundColor: node.batchToSendCount > 0 
                    ? 'warning.main' 
                    : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  color: node.batchToSendCount > 0 
                    ? theme === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.7)' 
                    : theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)'
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
});

NodeCard.propTypes = {
  node: PropTypes.object.isRequired,
  getStatusColor: PropTypes.func.isRequired,
  formatMemoryUsage: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired
};

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
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'success';
      case 'OFFLINE':
        return 'error';
      default:
        return 'warning';
    }
  };

  const formatMemoryUsage = (memoryUsage) => {
    if (!memoryUsage) return 'N/A';
    
    const usedMB = Math.round(memoryUsage.used / (1024 * 1024) * 10) / 10;
    const totalMB = Math.round(memoryUsage.total / (1024 * 1024) * 10) / 10;
    const percentage = Math.round((memoryUsage.used / memoryUsage.total) * 100);
    
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            color={percentage > 80 ? "error" : percentage > 60 ? "warning" : "primary"} 
          />
        </Box>
        <Box sx={{ minWidth: 35, mt: 0.5 }}>
          <Typography variant="body2">
            {`${usedMB}MB / ${totalMB}MB (${percentage}%)`}
          </Typography>
        </Box>
      </Box>
    );
  };

  // Add this function near the top of the component, after the useState declarations
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');
  };

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
  
  // Generate skeleton cards for loading state
  const renderSkeletons = () => {
    const skeletonCount = isMobile ? 2 : isTablet ? 4 : 6;
    return Array(skeletonCount).fill(0).map((_, index) => (
      <NodeCardSkeleton key={`skeleton-${index}`} />
    ));
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
          <motion.div 
            className="bento-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            role="region"
            aria-label="Nodes information grid"
          >
            {isLoading ? (
              renderSkeletons()
            ) : nodes.length === 0 ? (
              <motion.div 
                className="bento-item empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom>No Nodes Found</Typography>
                  <Typography variant="body2" align="center">
                    There are no nodes available in the system right now.
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              nodes.map((node) => (
                <NodeCard 
                  key={node.nodeId} 
                  node={node} 
                  getStatusColor={getStatusColor}
                  formatMemoryUsage={formatMemoryUsage}
                  formatDate={formatDate}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
})

export default Nodes;