import { memo, useContext } from 'react';
import { useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

/**
 * StatCardGrid component that displays a responsive grid of stat cards
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.children - The child components to display in the grid
 * @param {boolean} props.isLoading - Whether the grid is in loading state
 * @returns {JSX.Element} The rendered StatCardGrid component
 */
const StatCardGrid = memo(function StatCardGrid({ children, isLoading }) {
  const { theme } = useContext(ThemeContext);
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  
  // Framer Motion variants for container animations
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

  return (
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
      aria-busy={isLoading}
      role="region"
      aria-label="Dashboard statistics"
    >
      {children}
    </motion.div>
  );
});

StatCardGrid.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool
};

StatCardGrid.defaultProps = {
  isLoading: false
};

export default StatCardGrid;