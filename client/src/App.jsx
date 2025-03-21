import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import AppHeader from './components/AppHeader';
import AppDrawer from './components/AppDrawer';
import Dashboard from './pages/Dashboard';
import Nodes from './pages/Nodes';
import Batches from './pages/Batches';
import Configuration from './pages/Configuration';
import './App.css';

function App() {
  return (
    <Router future={{ 
      v7_relativeSplatPath: true,
      v7_startTransition: true 
    }}>
      <Box sx={{ display: 'flex' }}>
        <AppHeader />
        <AppDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nodes" element={<Nodes />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/configuration" element={<Configuration />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;