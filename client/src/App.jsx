import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box, CssBaseline, CircularProgress, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import AppHeader from './components/AppHeader';
import AppDrawer from './components/AppDrawer';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Lazy load page components for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Nodes = lazy(() => import('./pages/Nodes'));
const Batches = lazy(() => import('./pages/Batches'));
const Configuration = lazy(() => import('./pages/Configuration'));

// Loading fallback component with animation
const LoadingFallback = () => (
  <Box 
    className="fade-in" 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}
  >
    <CircularProgress size={40} color="primary" />
    <Typography variant="body1" sx={{ mt: 2 }}>
      Loading content...
    </Typography>
  </Box>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Box 
    className="error-message" 
    role="alert" 
    aria-live="assertive"
    sx={{ 
      maxWidth: '600px',
      mx: 'auto',
      my: 4,
      p: 3,
      borderRadius: 2
    }}
  >
    <Typography variant="h6">😕 Oops, something's off!</Typography>
    <Typography variant="body1" sx={{ my: 2 }}>
      {error.message || "We encountered an unexpected error."}
    </Typography>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={resetErrorBoundary}
      style={{
        padding: '8px 16px',
        backgroundColor: 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer'
      }}
    >
      Try Again
    </motion.button>
  </Box>
);

// AnimatedRoutes component to handle route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nodes" element={<Nodes />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/configuration" element={<Configuration />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

// Main App component
const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate initial app loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <Router future={{ 
          v7_relativeSplatPath: true,
          v7_startTransition: true 
        }}>
          <CssBaseline />
          <AnimatePresence>
            {isLoaded ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="app-container"
                style={{ width: '100%', minHeight: '100vh' }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    minHeight: '100vh',
                    width: '100%'
                  }}
                  role="application"
                  aria-label="SymmetricDS Dashboard"
                >
                  <AppHeader />
                  <AppDrawer />
                  <Box 
                    component="main" 
                    className="main-content"
                    sx={{ 
                      flexGrow: 1,
                      width: { xs: '100%', md: 'calc(100% - 260px)' },
                      mt: { xs: '60px', md: '70px' }
                    }}
                  >
                    <AnimatedRoutes />
                  </Box>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                className="app-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                  width: '100vw'
                }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <CircularProgress size={60} thickness={4} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;