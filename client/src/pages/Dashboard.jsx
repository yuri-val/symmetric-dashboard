import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { fetchNodeStatus } from '../api/models/nodes';

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
        
        const activeNodes = nodeStatus.find(status => status.status === 'Online')?.count || 0;
        const errorNodes = nodeStatus.find(status => status.status === 'Offline')?.count || 0;
        const pendingBatches = syncStats.find(stat => stat.name === 'NE')?.value || 0;
        
        setStats({
          totalNodes: nodeStatus.reduce((acc, curr) => acc + curr.count, 0),
          activeNodes,
          errorNodes,
          pendingBatches
        });
      } catch (error) {
        console.error('Error fetching node status:', error);
        setError(error.message);
        setStats({
          totalNodes: 0,
          activeNodes: 0,
          errorNodes: 0,
          pendingBatches: 0
        });
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

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

export default Dashboard;