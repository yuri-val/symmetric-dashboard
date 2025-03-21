import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { fetchNodes } from '../api/models/nodes';

function Nodes() {
  const [nodes, setNodes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNodesData = async () => {
      try {
        setError(null);
        const data = await fetchNodes();
        setNodes(data);
      } catch (error) {
        console.error('Error fetching nodes:', error);
        setError(error.message);
        setNodes([]);
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
          <Typography variant="body2" color="text.secondary">
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

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Nodes
      </Typography>
      {error ? (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Node ID</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Host</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>OS Info</TableCell>
                <TableCell>Memory Usage</TableCell>
                <TableCell>Last Heartbeat</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Errors</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nodes.map((node) => (
                <TableRow key={node.nodeId}>
                  <TableCell>{node.nodeId}</TableCell>
                  <TableCell>{node.nodeGroupId}</TableCell>
                  <TableCell>
                    <Chip
                      label={node.status || 'Unknown'}
                      color={getStatusColor(node.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{node.hostName || 'N/A'}</TableCell>
                  <TableCell>{node.ipAddress || 'N/A'}</TableCell>
                  <TableCell>
                    <Tooltip title={node.osInfo || 'N/A'} arrow placement="top">
                      <Typography noWrap sx={{ maxWidth: 150 }}>
                        {node.osInfo || 'N/A'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ minWidth: 180 }}>
                    {formatMemoryUsage(node.memoryUsage)}
                  </TableCell>
                  <TableCell>
                    {formatDate(node.lastHeartbeat)}
                  </TableCell>
                  <TableCell>{node.version || 'N/A'}</TableCell>
                  <TableCell>{node.batchInErrorCount >= 0 ? node.batchInErrorCount : 'N/A'}</TableCell>
                  <TableCell>{node.batchToSendCount >= 0 ? node.batchToSendCount : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default Nodes;