import { useState, useContext } from 'react';
import {
  Typography,
  Chip,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import PropTypes from 'prop-types';

/**
 * Node card component that displays information about a single node
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.node - Node data object
 * @param {Function} props.getStatusColor - Function to determine status color based on node status
 * @param {Function} props.formatMemoryUsage - Function to format memory usage data
 * @param {Function} props.formatDate - Function to format date strings
 * @returns {JSX.Element} The rendered NodeCard component
 */
const NodeCard = ({ node, getStatusColor, formatMemoryUsage, formatDate }) => {
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
};

NodeCard.propTypes = {
  node: PropTypes.object.isRequired,
  getStatusColor: PropTypes.func.isRequired,
  formatMemoryUsage: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired
};

export default NodeCard;