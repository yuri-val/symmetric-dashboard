import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  styled,
  Typography,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Hub as HubIcon,
  Sync as SyncIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    marginTop: 64,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: 'none',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  width: 'unset',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
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
function AppDrawer({ initialOpen = true }) {
  const [open, setOpen] = useState(initialOpen);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setOpen(!open);

  const drawerContent = useMemo(() => (
    <List>
      {menuItems.map(({ text, icon: Icon, path }) => (
        <StyledListItem
          button
          key={text}
          onClick={() => navigate(path)}
          selected={location.pathname === path}
        >
          <ListItemIcon>
            <Icon color={location.pathname === path ? 'inherit' : 'primary'} />
          </ListItemIcon>
          <ListItemText primary={text} />
        </StyledListItem>
      ))}
    </List>
  ), [location.pathname, navigate]);

  return (
    <>
      <StyledIconButton
        color="primary"
        aria-label="toggle drawer"
        onClick={handleDrawerToggle}
        edge="start"
        sx={{
          position: 'fixed',
          left: 16,
          top: 10,
          zIndex: 1300,
        }}
      >
        <MenuIcon />
      </StyledIconButton>
      <StyledDrawer
        variant="persistent"
        anchor="left"
        open={open}
      >
        {drawerContent}
      </StyledDrawer>
    </>
  );
}

AppDrawer.propTypes = {
  initialOpen: PropTypes.bool,
};

export default AppDrawer;