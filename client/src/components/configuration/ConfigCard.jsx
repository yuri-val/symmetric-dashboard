import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

/**
 * ConfigCard component for displaying configuration sections
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the configuration card
 * @param {React.ReactNode} props.children - The content to display inside the card
 * @param {string} [props.ariaLabel] - Accessibility label for the card
 * @returns {JSX.Element} The rendered ConfigCard component
 */
const ConfigCard = ({ title, children, ariaLabel }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, width: 'fit-content' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, boxShadow: 'var(--shadow)' }}
      className="bento-item"
      role="region"
      aria-label={ariaLabel || `${title} configuration section`}
    >
      <Card 
        sx={{ 
          height: '100%',
          backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          transition: 'all 0.3s ease',
          border: 'none',
          boxShadow: theme === 'dark' ? 'var(--shadow-dark)' : 'var(--shadow-light)',
        }}
      >
        <CardContent>
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--text-primary)',
              borderBottom: '1px solid var(--border)',
              paddingBottom: 'var(--space-sm)'
            }}
          >
            {title}
          </Typography>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

ConfigCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
};

export default ConfigCard;