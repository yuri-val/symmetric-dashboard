import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { fetchNodeStatus } from '../api/models/nodes';

/**
 * Dashboard component that displays node statistics
 * @component
 * @returns {JSX.Element} The rendered Dashboard component
 */
function Dashboard() {
  const [stats, setStats] = useState({
    totalNodes: 0,
    activeNodes: 0,
    errorNodes: 0,
    pendingBatches: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const { nodeStatus, syncStats } = await fetchNodeStatus();
        
        // Extract values with safer fallbacks
        const activeNodes = nodeStatus.find(status => status.status === 'Online')?.count || 0;
        const errorNodes = nodeStatus.find(status => status.status === 'Offline')?.count || 0;
        const pendingBatches = syncStats.find(stat => stat.name === 'NE')?.value || 0;
        const totalNodes = nodeStatus.reduce((acc, curr) => acc + curr.count, 0);
        
        setStats({
          totalNodes,
          activeNodes,
          errorNodes,
          pendingBatches
        });
      } catch (error) {
        console.error('Error fetching node status:', error);
        setError(error.message || 'Failed to fetch node status');
        resetStats();
      }
    };

    const resetStats = () => {
      setStats({
        totalNodes: 0,
        activeNodes: 0,
        errorNodes: 0,
        pendingBatches: 0
      });
    };

    // Initial fetch and set up polling
    fetchStats();
    const POLLING_INTERVAL = 30000; // 30 seconds
    const interval = setInterval(fetchStats, POLLING_INTERVAL);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Define stat cards configuration
  const statCards = [
    { title: 'Total Nodes', value: stats.totalNodes },
    { title: 'Active Nodes', value: stats.activeNodes },
    { title: 'Nodes in Error', value: stats.errorNodes },
    { title: 'Pending Batches', value: stats.pendingBatches }
  ];

  return (
    <>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h3">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

// Define StatCard PropTypes (for internal use)
const StatCardPropTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

// Even though Dashboard doesn't receive props, defining empty propTypes is good practice
Dashboard.propTypes = {};

export default Dashboard;