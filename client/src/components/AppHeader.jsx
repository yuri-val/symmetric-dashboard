import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, styled, Box } from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
  color: theme.palette.primary.main,
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const LogoBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '1rem',
});
const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '0.5px',
  marginLeft: theme.spacing(2),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

/**
 * AppHeader component displays the application header
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} [props.title="SymmetricDS Dashboard"] - The title to display in the header
 * @returns {React.ReactElement} The rendered AppHeader component
 */
function AppHeader({ title = "SymmetricDS Dashboard" }) {
  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <LogoBox>
          <StyledTypography variant="h5" noWrap component="h1">
            {title}
          </StyledTypography>
        </LogoBox>
        {/* You can add additional elements here, like a user menu or notifications */}
      </StyledToolbar>
    </StyledAppBar>
  );
}

AppHeader.propTypes = {
  title: PropTypes.string,
};

export default AppHeader;