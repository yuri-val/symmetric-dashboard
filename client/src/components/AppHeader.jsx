import { AppBar, Toolbar, Typography } from '@mui/material';

function AppHeader() {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, ml: 8 }}>
          SymmetricDS Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;