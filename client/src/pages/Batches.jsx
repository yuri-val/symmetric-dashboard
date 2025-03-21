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
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { fetchBatchStatus } from '../api/models/batches';

function Batches() {
  const [batches, setBatches] = useState({ incoming: [], outgoing: [] });
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({ incoming: {}, outgoing: {} });

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ERROR':
      case 'ER':
        return 'error';
      case 'OK':
        return 'success';
      case 'NE':
      case 'QE':
      case 'SE':
      case 'LD':
      case 'RT':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'NE': return 'New';
      case 'QE': return 'Queued';
      case 'SE': return 'Sending';
      case 'ER': return 'Error';
      case 'OK': return 'OK';
      case 'LD': return 'Loading';
      case 'RT': return 'Routing';
      default: return status;
    }
  };

  const renderStatCards = (direction) => {
    const statData = stats[direction];
    const statKeys = Object.keys(statData);
    
    if (statKeys.length === 0) {
      return (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" align="center">
                No {direction} batches found
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    }
    
    return statKeys.map(status => (
      <Grid item xs={6} sm={4} md={3} lg={2} key={`${direction}-${status}`}>
        <Card 
          sx={{ 
            height: '100%',
            borderLeft: `4px solid ${getStatusColor(status) === 'default' ? '#9e9e9e' : ''}`,
            borderColor: getStatusColor(status) !== 'default' ? 
              theme => theme.palette[getStatusColor(status)].main : undefined
          }}
        >
          <CardContent>
            <Typography variant="h6" component="div" align="center">
              {statData[status]}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              <Chip
                label={getStatusLabel(status)}
                color={getStatusColor(status)}
                size="small"
                sx={{ mt: 1 }}
              />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  const renderBatchTable = (batchList, direction) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Batch ID</TableCell>
            <TableCell>Node ID</TableCell>
            <TableCell>Channel</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Error Flag</TableCell>
            <TableCell>Byte Count</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {batchList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No {direction} batches found
              </TableCell>
            </TableRow>
          ) : (
            batchList.map((batch) => (
              <TableRow key={`${batch.batchId}-${batch.nodeId}`}>
                <TableCell>{batch.batchId}</TableCell>
                <TableCell>{batch.nodeId}</TableCell>
                <TableCell>{batch.channelId}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(batch.status)}
                    color={getStatusColor(batch.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={batch.errorFlag ? 'Yes' : 'No'}
                    color={batch.errorFlag ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{batch.byteCount}</TableCell>
                <TableCell>
                  {new Date(batch.createTime).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Batches
      </Typography>
      {error ? (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Outgoing Batch Status
                </Typography>
                <Grid container spacing={2}>
                  {renderStatCards('outgoing')}
                </Grid>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Incoming Batch Status
                </Typography>
                <Grid container spacing={2}>
                  {renderStatCards('incoming')}
                </Grid>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="batch direction tabs">
              <Tab label={`Outgoing (last ${batches.outgoing?.length || 0})`} />
              <Tab label={`Incoming (last ${batches.incoming?.length || 0})`} />
            </Tabs>
          </Box>
          {tabValue === 0 && renderBatchTable(batches.outgoing || [], 'outgoing')}
          {tabValue === 1 && renderBatchTable(batches.incoming || [], 'incoming')}
        </Box>
      )}
    </>
  );
}

export default Batches;