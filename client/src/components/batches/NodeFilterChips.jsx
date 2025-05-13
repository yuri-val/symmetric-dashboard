import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { Box, Chip, Typography, useTheme, Skeleton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { fetchNodes } from "../../api/models/nodes";
import { ThemeContext } from "../../context/ThemeContext";

// Animation variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const chipVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8 },
};

const containerStyles = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  border: "1px solid #1976d2",
  borderRadius: "8px",
  p: 1,
  boxShadow: "var(--shadow)",
};

/**
 * Renders a loading state for the node filter
 * @returns {JSX.Element} Loading state component
 */
const LoadingState = () => (
  <Box sx={{ mb: 2 }}>
    <Skeleton width="180px" height={24} />
    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
      <Skeleton variant="rounded" width={80} height={32} />
      <Skeleton variant="rounded" width={100} height={32} />
      <Skeleton variant="rounded" width={90} height={32} />
    </Box>
  </Box>
);

/**
 * Renders an error state for the node filter
 * @param {string} errorMessage - The error message to display
 * @returns {JSX.Element} Error state component
 */
const ErrorState = ({ errorMessage }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="error">
      {errorMessage}
    </Typography>
  </Box>
);

ErrorState.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};

/**
 * NodeFilterChips component for displaying and selecting node filters
 * @component
 * @author Yuri V
 * @param {Object} props - Component props
 * @param {string|null} props.selectedNodeId - The currently selected node ID
 * @param {function} props.onNodeSelect - Function to call when a node is selected
 * @returns {JSX.Element} The rendered NodeFilterChips component
 */
const NodeFilterChips = ({ selectedNodeId = null, onNodeSelect }) => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme: themeMode } = useContext(ThemeContext);
  const muiTheme = useTheme();

  // Compute chip styles based on theme and selection state
  const getChipStyles = useCallback(
    (isSelected) => ({
      fontWeight: isSelected ? "bold" : "normal",
      "&:hover": {
        boxShadow: 1,
        transform: "translateY(-2px)",
      },
      backgroundColor:
        themeMode === "dark"
          ? isSelected
            ? muiTheme.palette.primary.dark
            : "rgba(70, 70, 70, 0.8)"
          : undefined,
      color: themeMode === "dark" && !isSelected ? "white" : undefined,
    }),
    [themeMode, muiTheme.palette.primary.dark]
  );

  useEffect(() => {
    const loadNodes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNodes();
        // Extract just the node IDs from the response
        setNodes(data.map((node) => node.nodeId));
      } catch (err) {
        console.error("Error loading nodes:", err);
        setError("Failed to load node filters");
      } finally {
        setLoading(false);
      }
    };

    loadNodes();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState errorMessage={error} />;
  }

  if (nodes.length === 0) {
    return null;
  }

  return (
    <Box sx={containerStyles}>
      <Typography
        variant="subtitle2"
        gutterBottom
        color={themeMode === "dark" ? "white" : "text.primary"}
        sx={{ whiteSpace: "nowrap", textTransform: "uppercase" }}
      >
        Node:
      </Typography>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <AnimatePresence>
            {nodes.map((nodeId) => {
              const isSelected = selectedNodeId === nodeId;
              const displayName = nodeId || "(empty)";

              return (
                <motion.div key={nodeId || "empty"} variants={chipVariants}>
                  <Chip
                    label={displayName}
                    color={isSelected ? "primary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => onNodeSelect(nodeId)}
                    sx={getChipStyles(isSelected)}
                    aria-pressed={isSelected}
                    data-testid={`node-chip-${nodeId || "empty"}`}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      </motion.div>
    </Box>
  );
};

NodeFilterChips.propTypes = {
  selectedNodeId: PropTypes.string,
  onNodeSelect: PropTypes.func.isRequired,
};

export default NodeFilterChips;
