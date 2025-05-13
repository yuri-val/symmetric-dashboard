import { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Typography,
  Tooltip,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { fetchNodeBatchStats } from "../../api/models/nodes";
import { getStatusColor, getStatusLabel } from "../batches/BatchStatusUtils";

/**
 * Component that displays batch status statistics for a node
 * @component
 * @param {Object} props - Component props
 * @param {string} props.nodeId - ID of the node to display batch statistics for
 * @returns {JSX.Element} The rendered component
 */
const BatchStatusChips = ({ nodeId }) => {
  const [stats, setStats] = useState({ incoming: {}, outgoing: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!nodeId) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchNodeBatchStats(nodeId);

        // Check if we have stats data in the response
        if (data && data.stats) {
          setStats({
            incoming: data.stats?.incoming || {},
            outgoing: data.stats?.outgoing || {},
          });
        } else {
          setError("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching batch stats for node:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Update every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [nodeId]);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Batch Status:
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <CircularProgress size={14} sx={{ mr: 1 }} />
          <Typography variant="body2" color="textSecondary">
            Loading statistics...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Batch Status:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unable to load statistics
        </Typography>
      </Box>
    );
  }

  // Get the outgoing stats for display
  const outgoingStats = stats.outgoing;

  // If no stats available
  if (!outgoingStats || Object.keys(outgoingStats).length === 0) {
    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Batch Status:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No batch statistics available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Batch Status:
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {Object.entries(outgoingStats).map(([status, count]) => (
          <Tooltip
            key={status}
            title={`${getStatusLabel(status)}: ${count}`}
            arrow
            placement="top"
          >
            <Chip
              label={`${status}: ${count}`}
              size="small"
              color={getStatusColor(status)}
              sx={{ fontSize: "0.75rem" }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

BatchStatusChips.propTypes = {
  nodeId: PropTypes.string.isRequired,
};

export default BatchStatusChips;
