import { motion, AnimatePresence } from 'framer-motion';
import { Box, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import NodeCard from './NodeCard';
import NodeCardSkeleton from './NodeCardSkeleton';
import EmptyState from './EmptyState';

/**
 * Grid component that displays nodes in a responsive bento grid layout
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.nodes - Array of node objects to display
 * @param {boolean} props.isLoading - Whether the nodes are currently loading
 * @param {Function} props.getStatusColor - Function to determine status color based on node status
 * @param {Function} props.formatMemoryUsage - Function to format memory usage data
 * @param {Function} props.formatDate - Function to format date strings
 * @returns {JSX.Element} The rendered NodesGrid component
 */
const NodesGrid = ({ nodes, isLoading, getStatusColor, formatMemoryUsage, formatDate }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');

  // Generate skeleton cards for loading state
  const renderSkeletons = () => {
    const skeletonCount = isMobile ? 2 : isTablet ? 4 : 6;
    return Array(skeletonCount).fill(0).map((_, index) => (
      <NodeCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <AnimatePresence>
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
          <EmptyState />
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
    </AnimatePresence>
  );
};

NodesGrid.propTypes = {
  nodes: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getStatusColor: PropTypes.func.isRequired,
  formatMemoryUsage: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired
};

export default NodesGrid;