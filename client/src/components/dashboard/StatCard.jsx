import { memo, useContext } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

/**
 * StatCard component that displays a single statistic card
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the stat card
 * @param {number} props.value - The numeric value to display
 * @param {string} props.color - The color for the value text
 * @param {string} props.icon - The emoji icon to display
 * @param {string} props.description - The description text
 * @returns {JSX.Element} The rendered StatCard component
 */
const StatCard = memo(function StatCard({ title, value, color, icon, description }) {
  const { theme } = useContext(ThemeContext);
  
  // Framer Motion variants for card animations
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

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      tabIndex={0}
      role="group"
      aria-label={`${title}: ${value}`}
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
              {icon}
            </span>
            <Typography 
              color="textSecondary" 
              gutterBottom
              style={{ 
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}
            >
              {title}
            </Typography>
          </div>
          <Typography 
            variant="h3" 
            style={{ 
              color: color,
              fontWeight: 'bold',
              marginBottom: '8px'
            }}
          >
            {value}
          </Typography>
          <Typography 
            variant="body2" 
            style={{ 
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
});

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default StatCard;