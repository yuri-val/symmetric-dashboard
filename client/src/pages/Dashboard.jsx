import { useState, useEffect, useContext, memo } from 'react';
import { motion } from 'framer-motion';
import { fetchNodeStatus } from '../api/models/nodes';
import { ThemeContext } from '../context/ThemeContext';
import { ErrorBoundary } from 'react-error-boundary';
import { StatCard, StatCardGrid, LoadingIndicator, ErrorDisplay } from '../components/dashboard';

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



  // Custom error fallback component for ErrorBoundary
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
        {error && <ErrorDisplay message={error} onRetry={() => setError(null)} />}
        
        {isLoading ? (
          <LoadingIndicator message="Loading dashboard data..." />
        ) : (
          <StatCardGrid>
            {statCards.map((card) => (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                color={card.color}
                icon={card.icon}
                description={card.description}
              />
            ))}
          </StatCardGrid>
        )}
      </div>
    </ErrorBoundary>
  );
});



// Even though Dashboard doesn't receive props, defining empty propTypes is good practice
Dashboard.propTypes = {};

export default Dashboard;