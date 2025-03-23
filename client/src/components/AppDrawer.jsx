import React, { useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Hub as HubIcon,
  Sync as SyncIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const drawerWidth = 260;

// Styled components with theme support
const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== '$isDarkMode' })(({ theme, $isDarkMode }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    marginTop: 64,
    background: $isDarkMode 
      ? 'rgba(18, 18, 18, 0.85)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: $isDarkMode
      ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
      : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: 'none',
    color: $isDarkMode ? '#ffffff' : theme.palette.text.primary,
  },
}));

const DrawerHeader = styled(Box, { shouldForwardProp: (prop) => prop !== '$isDarkMode' })(({ theme, $isDarkMode }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: $isDarkMode 
    ? '1px solid rgba(255, 255, 255, 0.1)' 
    : '1px solid rgba(0, 0, 0, 0.05)',
}));

const menuItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/' },
  { text: 'Nodes', icon: HubIcon, path: '/nodes' },
  { text: 'Batches', icon: SyncIcon, path: '/batches' },
  { text: 'Configuration', icon: SettingsIcon, path: '/configuration' },
];

/**
 * AppDrawer component for navigation
 * @component
 */
const AppDrawer = React.memo(function AppDrawer() {
  const [error] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleNavigation = useCallback((path) => {
    try {
      navigate(path);
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Navigation failed. Please try again.');
    }
  }, [navigate]);

  // Animation variants
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { delay: i * 0.1, duration: 0.5 } 
    }),
    hover: { 
      scale: 1.03, 
      boxShadow: isDarkMode 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
        : '0 4px 12px rgba(0, 0, 0, 0.15)',
      y: -2
    },
    tap: { scale: 0.98 }
  };

  return (
    <StyledDrawer
      variant="permanent"
      anchor="left"
      open={true}
      $isDarkMode={isDarkMode}
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
        id: "navigation-drawer",
        role: "navigation",
        "aria-label": "Main navigation"
      }}
    >
      <DrawerHeader $isDarkMode={isDarkMode}>
        <Typography variant="h6" component="div">
          Navigation
        </Typography>
      </DrawerHeader>
      
      {error && (
        <Box 
          sx={{ 
            m: 2, 
            p: 2, 
            borderRadius: 1, 
            bgcolor: isDarkMode ? 'rgba(220, 53, 69, 0.2)' : 'rgba(220, 53, 69, 0.1)',
            color: isDarkMode ? '#ff8a8a' : '#dc3545'
          }}
          role="alert"
          aria-live="polite"
        >
          <Typography variant="body2">
            😕 Oops, something's off—try again!
          </Typography>
          <Typography variant="caption">
            {error}
          </Typography>
        </Box>
      )}
      
      <List>
        {menuItems.map(({ text, icon: Icon, path }, i) => {
          const isSelected = location.pathname === path;
          return (
            <motion.div
              key={text}
              custom={i}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              variants={listItemVariants}
              style={{
                margin: '8px 16px',
                borderRadius: '4px',
                backgroundColor: isSelected
                  ? (isDarkMode ? '#1976d2' : '#3f51b5')
                  : 'transparent',
                color: isSelected
                  ? '#ffffff'
                  : isDarkMode ? '#ffffff' : 'inherit',
              }}
            >
              <ListItem
                button
                onClick={() => handleNavigation(path)}
                selected={isSelected}
                aria-current={isSelected ? 'page' : undefined}
                role="menuitem"
                tabIndex={0}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon sx={{
                  color: isSelected
                    ? '#ffffff'
                    : isDarkMode ? '#ffffff' : '#3f51b5'
                }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            </motion.div>
          );
        })}
      </List>
    </StyledDrawer>
  );
});

AppDrawer.propTypes = {};

export default AppDrawer;