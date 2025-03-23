import { useState, useEffect, useContext, memo } from 'react';
import { Grid, Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { fetchNodeStatus } from '../api/models/nodes';
import { ThemeContext } from '../context/ThemeContext';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Dashboard component that displays node statistics
 * @component
 * @returns {JSX.Element} The rendered Dashboard component
 */
const Dashboard = memo(function Dashboard() {
  const [stats, setStats] = useState({
    totalNodes: 0,
    activeNodes: 0,
    errorNodes: 0,
    pendingBatches: 0
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

  // Define stat cards configuration with enhanced properties
  const statCards = [
    { 
      title: 'Total Nodes', 
      value: stats.totalNodes, 
      color: theme === 'dark' ? '#8884d8' : '#4527a0',
      icon: '📊',
      description: 'Total number of nodes in the system'
    },
    { 
      title: 'Active Nodes', 
      value: stats.activeNodes, 
      color: theme === 'dark' ? '#82ca9d' : '#2e7d32',
      icon: '✅',
      description: 'Nodes currently online and operational'
    },
    { 
      title: 'Nodes in Error', 
      value: stats.errorNodes, 
      color: theme === 'dark' ? '#ff8042' : '#d32f2f',
      icon: '⚠️',
      description: 'Nodes experiencing issues or offline'
    },
    { 
      title: 'Pending Batches', 
      value: stats.pendingBatches, 
      color: theme === 'dark' ? '#ffc658' : '#ed6c02',
      icon: '⏳',
      description: 'Batches waiting to be processed'
    }
  ];

  // Framer Motion variants
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: { 
      scale: 1.03,
      boxShadow: 'var(--shadow)',
      transition: { duration: 0.2 }
    }
  };

  const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="error-container"
      role="alert"
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        marginBottom: '20px'
      }}
    >
      <h3>😕 Oops, something's off!</h3>
      <p>We encountered an issue while displaying your dashboard.</p>
      <button 
        onClick={resetErrorBoundary}
        style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </motion.div>
  );

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setError(null)}
    >
      <div className={`dashboard-container ${theme}`} style={{
        padding: '20px',
        backgroundColor: 'var(--background)',
        borderRadius: 'var(--radius-md)',
        transition: 'background-color 0.3s ease'
      }}>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Typography 
              color="error" 
              gutterBottom 
              style={{ 
                padding: '12px',
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                border: '1px solid var(--border)'
              }}
              role="alert"
              aria-live="assertive"
            >
              <span role="img" aria-label="Error">⚠️</span> {error}
            </Typography>
          </motion.div>
        )}
        
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '40px' }}
          >
            <Typography variant="h6" color="textSecondary">
              Loading dashboard data...
            </Typography>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bento-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? '1fr' 
                : isTablet 
                  ? 'repeat(2, 1fr)' 
                  : 'repeat(4, 1fr)',
              gap: '20px',
              width: '100%'
            }}
          >
            {statCards.map((card) => (
              <motion.div
                key={card.title}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                tabIndex={0}
                role="group"
                aria-label={`${card.title}: ${card.value}`}
                style={{ 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: '100%'
                }}
              >
                <Card style={{ 
                  height: '100%',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <CardContent style={{ height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px', marginRight: '8px' }} role="img" aria-hidden="true">
                        {card.icon}
                      </span>
                      <Typography 
                        color="textSecondary" 
                        gutterBottom
                        style={{ 
                          color: 'var(--text-secondary)',
                          fontWeight: 500
                        }}
                      >
                        {card.title}
                      </Typography>
                    </div>
                    <Typography 
                      variant="h3" 
                      style={{ 
                        color: card.color,
                        fontWeight: 'bold',
                        marginBottom: '8px'
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      style={{ 
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem'
                      }}
                    >
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
});

// Define StatCard PropTypes (for internal use)
const StatCardPropTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

// Even though Dashboard doesn't receive props, defining empty propTypes is good practice
Dashboard.propTypes = {};

export default Dashboard;