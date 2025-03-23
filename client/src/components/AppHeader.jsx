import React, { useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Typography,
  styled,
  Box,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

// Styled components with theme support
const StyledAppBar = styled(AppBar)(({ theme, $isDarkMode }) => ({
  background: $isDarkMode
    ? 'rgba(18, 18, 18, 0.85)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: $isDarkMode
    ? '0 4px 30px rgba(0, 0, 0, 0.3)'
    : '0 4px 30px rgba(0, 0, 0, 0.1)',
  borderBottom: $isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  color: $isDarkMode
    ? '#ffffff'
    : theme.palette.primary.main,
  zIndex: theme.zIndex.drawer + 1,
  transition: 'all 0.3s ease',
}));

const StyledToolbar = styled(Toolbar)(({ $isMobile }) => ({
  display: 'grid',
  gridTemplateColumns: $isMobile
    ? '1fr auto'
    : '1fr auto auto',
  gap: '1rem',
  alignItems: 'center',
  padding: $isMobile ? '0.5rem 1rem' : '0.5rem 2rem',
  height: $isMobile ? '60px' : '70px',
}));

const LogoBox = styled(motion.div)({
  display: 'flex',
  alignItems: 'center',
});

const StyledTypography = styled(motion.div)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '0.5px',
  marginLeft: theme.spacing(2),
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`
    : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  transition: 'all 0.3s ease',
}));

const ActionBox = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const NotificationBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== '$isDarkMode'
})(({ theme, $isDarkMode }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: $isDarkMode ? theme.palette.error.light : theme.palette.error.main,
    color: '#ffffff',
  }
}));

/**
 * AppHeader component displays the application header
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} [props.title="SymmetricDS Dashboard"] - The title to display in the header
 * @returns {React.ReactElement} The rendered AppHeader component
 */
const AppHeader = React.memo(function AppHeader({ title = "SymmetricDS Dashboard" }) {
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const isMobile = useMediaQuery('(max-width:768px)');
  const isSmallScreen = useMediaQuery('(max-width:480px)');

  const handleThemeToggle = useCallback(() => {
    try {
      toggleTheme();
    } catch (err) {
      console.error('Failed to toggle theme:', err);
      setError('Theme toggle failed. Please try again.');
      // Auto-dismiss error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  }, [toggleTheme]);

  const handleProfileMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNotificationClick = useCallback(() => {
    // In a real app, this would open notifications panel
    setNotificationCount(0);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const logoVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.3, yoyo: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <>
      <StyledAppBar
        position="fixed"
        $isDarkMode={isDarkMode}
        component={motion.div}
        // Filter out transient props from DOM
        shouldForwardProp={(prop) => !['$isDarkMode'].includes(prop)}
      >
        <StyledToolbar
          $isMobile={isMobile}
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          // Filter transient props from DOM
          shouldForwardProp={(prop) => prop !== '$isMobile'}
        >
          <LogoBox variants={itemVariants} whileHover="hover">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{
                width: isMobile ? 30 : 35,
                height: isMobile ? 30 : 35,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${isDarkMode ? '#61dafb' : '#0088cc'}, ${isDarkMode ? '#764abc' : '#6a1b9a'})`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              aria-hidden="true"
            >
              <motion.div
                style={{
                  width: '60%',
                  height: '60%',
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? '#121212' : '#ffffff'
                }}
              />
            </motion.div>
            <StyledTypography variants={logoVariants} whileHover="hover">
              <Typography
                variant={isMobile ? "h6" : "h5"}
                noWrap
                component="h1"
                aria-label={title}
              >
                {isSmallScreen ? title.split(' ')[0] : title}
              </Typography>
            </StyledTypography>
          </LogoBox>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: '70px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: isDarkMode ? 'rgba(220, 53, 69, 0.2)' : 'rgba(220, 53, 69, 0.1)',
                  color: isDarkMode ? '#ff8a8a' : '#dc3545',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  zIndex: 9999,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  maxWidth: '90%'
                }}
                role="alert"
                aria-live="polite"
              >
                <Typography variant="body2">
                  😕 Oops, something's off—try again!
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {!isMobile && (
            <ActionBox variants={itemVariants}>
              <Tooltip title="Notifications" arrow>
                <IconButton
                  color={isDarkMode ? "inherit" : "primary"}
                  aria-label={`${notificationCount} notifications`}
                  component={motion.button}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleNotificationClick}
                >
                  <NotificationBadge $isDarkMode={isDarkMode} badgeContent={notificationCount} max={99}>
                    <NotificationsIcon />
                  </NotificationBadge>
                </IconButton>
              </Tooltip>
            </ActionBox>
          )}

          <ActionBox variants={itemVariants}>
            <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`} arrow>
              <IconButton
                color={isDarkMode ? "inherit" : "primary"}
                onClick={handleThemeToggle}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                component={motion.button}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Account settings" arrow>
              <IconButton
                color={isDarkMode ? "inherit" : "primary"}
                onClick={handleProfileMenuOpen}
                aria-label="Account settings"
                aria-controls="profile-menu"
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)}
                component={motion.button}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: isDarkMode ? 'primary.dark' : 'primary.main',
                    fontSize: '0.875rem'
                  }}
                >
                  AD
                </Avatar>
              </IconButton>
            </Tooltip>
          </ActionBox>
        </StyledToolbar>
      </StyledAppBar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : 'inherit',
            boxShadow: isDarkMode
              ? '0 4px 20px rgba(0, 0, 0, 0.5)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            minWidth: '200px',
          },
          component: motion.div,
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.2 }
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <AccountIcon sx={{ mr: 2 }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <SettingsIcon sx={{ mr: 2 }} /> Settings
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            py: 1.5,
            color: isDarkMode ? '#ff8a8a' : '#dc3545',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(220, 53, 69, 0.2)' : 'rgba(220, 53, 69, 0.1)',
            }
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
});

AppHeader.propTypes = {
  title: PropTypes.string,
};

export default AppHeader;