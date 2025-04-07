import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  TableCell,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Divider,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';
import { ThemeContext } from '../../context/ThemeContext';
import { getStatusLabel } from './BatchStatusUtils';
import { fetchBatchDetails, fetchBatchData } from '../../api/models/batches';

// Constants
const CELL_SPAN = 8;
/**
 * Renders a data entry row with tooltips for potentially long text fields
 * @component
 * @param {Object} entry - The data entry object
 * @returns {JSX.Element} The rendered data entry row
 */
const DataEntryRow = ({ entry }) => (
  <TableRow key={entry.dataId}>
    <TableCell>{entry.tableName}</TableCell>
    <TableCell>{entry.eventType}</TableCell>
    <Tooltip title={entry.pkData || ''}>
      <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {entry.pkData || 'N/A'}
      </TableCell>
    </Tooltip>
    <Tooltip title={entry.rowData || ''}>
      <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {entry.rowData || 'N/A'}
      </TableCell>
    </Tooltip>
    <Tooltip title={entry.oldData || ''}>
      <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {entry.oldData || 'N/A'}
      </TableCell>
    </Tooltip>
    <TableCell>{new Date(entry.createTime).toLocaleString()}</TableCell>
    <TableCell>{entry.sourceNodeId}</TableCell>
  </TableRow>
);

DataEntryRow.propTypes = {
  entry: PropTypes.shape({
    dataId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tableName: PropTypes.string,
    eventType: PropTypes.string,
    pkData: PropTypes.string,
    rowData: PropTypes.string,
    oldData: PropTypes.string,
    createTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    sourceNodeId: PropTypes.string
  }).isRequired
};

/**
 * Renders a section of batch details with a title and content
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Section content
 * @returns {JSX.Element} The rendered details section
 */
const DetailsSection = ({ title, children }) => (
  <Box sx={{ mt: 1, mb: 2 }}>
    <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
    <Box sx={{ mt: 1 }}>
      {children}
    </Box>
  </Box>
);

DetailsSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

/**
 * Renders a labeled detail item
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - The label for the detail
 * @param {React.ReactNode} props.value - The value to display
 * @returns {JSX.Element} The rendered detail item
 */
const DetailItem = ({ label, value }) => (
  <Typography variant="body2">
    <strong>{label}:</strong> {value}
  </Typography>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired
};

/**
 * BatchDetailsRow component for displaying detailed batch information
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.batch - The batch object
 * @param {string} props.direction - The direction of the batch ('incoming' or 'outgoing')
 * @param {boolean} props.isOpen - Whether the details are expanded
 * @returns {JSX.Element} The rendered BatchDetailsRow component
 */
const BatchDetailsRow = ({ batch, direction, isOpen }) => {
  const { theme } = useContext(ThemeContext);
  const [details, setDetails] = useState(null);
  const [dataEntries, setDataEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataError, setDataError] = useState(null);

  // Get background color based on theme
  const getBgColor = () => theme === 'dark' ? 'rgba(20, 20, 20, 0.5)' : 'rgba(245, 245, 245, 0.5)';
  // Fetch batch details when the row is expanded
  const loadBatchDetails = useCallback(async () => {
    if (!isOpen || details) return;

    setLoading(true);
    setError(null);

    try {
      const batchDetails = await fetchBatchDetails(batch.batchId, direction);
      setDetails(batchDetails);
    } catch (err) {
      console.error('Error loading batch details:', err);
      setError(err.message || 'Failed to load batch details');
    } finally {
      setLoading(false);
    }
  }, [batch.batchId, direction, isOpen, details]);

  // Fetch sym_data entries associated with this batch
  const loadBatchData = useCallback(async () => {
    if (!isOpen) return;

    setDataLoading(true);
    setDataError(null);

    try {
      const data = await fetchBatchData(batch.batchId, direction);
      setDataEntries(data);
    } catch (err) {
      console.error('Error loading batch data entries:', err);
      setDataError(err.message || 'Failed to load data entries');
    } finally {
      setDataLoading(false);
    }
  }, [batch.batchId, direction, isOpen]);

  // Load details and data when the component mounts or when isOpen changes
  useEffect(() => {
    if (isOpen) {
      loadBatchDetails();
      loadBatchData();
    }
  }, [isOpen, loadBatchDetails, loadBatchData]);

  // Render loading state
  if (loading) {
    return (
      <TableCell colSpan={CELL_SPAN} sx={{ py: 2, backgroundColor: getBgColor() }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2">Loading batch details...</Typography>
        </Box>
      </TableCell>
    );
  }

  // Render error state
  if (error) {
    return (
      <TableCell colSpan={CELL_SPAN} sx={{ py: 2, backgroundColor: getBgColor() }}>
        <Alert severity="error" sx={{ my: 1 }}>
          {error}
        </Alert>
      </TableCell>
    );
  }

  // Render data entries table or loading/error states
  const renderDataEntries = () => {
    if (dataLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2">Loading data entries...</Typography>
        </Box>
      );
    }

    if (dataError) {
      return (
        <Alert severity="error" sx={{ my: 1 }}>
          {dataError}
        </Alert>
      );
    }

    if (dataEntries.length === 0) {
      return (
        <Typography variant="body2" align="center" sx={{ py: 2 }}>
          No data entries found for this batch.
        </Typography>
      );
    }

    return (
      <Box sx={{ mt: 1, mb: 2, maxHeight: 300, overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Table</TableCell>
              <TableCell>Event Type</TableCell>
              <TableCell>PK Data</TableCell>
              <TableCell>Row Data</TableCell>
              <TableCell>Old Data</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Source Node</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataEntries.map(entry => (
              <DataEntryRow key={entry.dataId} entry={entry} />
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  };

  // Render batch details content
  const renderDetailsContent = () => {
    if (!details) {
      return (
        <Typography variant="body2" align="center" sx={{ py: 2 }}>
          No details available for this batch.
        </Typography>
      );
    }

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Batch Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DetailsSection title="Basic Information">
              <DetailItem label="Batch ID" value={details.batchId} />
              <DetailItem label="Node ID" value={details.nodeId} />
              <DetailItem label="Channel" value={details.channelId} />
              <DetailItem label="Router ID" value={details.routerId || 'N/A'} />
            </DetailsSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <DetailsSection title="Status Information">
              <DetailItem label="Status" value={getStatusLabel(details.status)} />
              <DetailItem label="Error Flag" value={details.errorFlag ? 'Yes' : 'No'} />
              <DetailItem label="Created" value={new Date(details.createTime).toLocaleString()} />
              <DetailItem 
                label="Load Time" 
                value={details.loadTime ? new Date(details.loadTime).toLocaleString() : 'N/A'} 
              />
            </DetailsSection>
          </Grid>

          <Grid item xs={12}>
            <DetailsSection title="Data Information">
              <DetailItem label="Byte Count" value={details.byteCount} />
              <DetailItem label="Data Event Count" value={details.dataEventCount} />
            </DetailsSection>
          </Grid>

          {/* Sym Data Entries Section */}
          <Grid item xs={12}>
            <DetailsSection title="Data Entries">
              {renderDataEntries()}
            </DetailsSection>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Render batch details
  return (
    <TableCell colSpan={CELL_SPAN} sx={{ py: 2, backgroundColor: getBgColor() }}>
      {renderDetailsContent()}
    </TableCell>
  );
};

BatchDetailsRow.propTypes = {
  batch: PropTypes.shape({
    batchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  direction: PropTypes.oneOf(['incoming', 'outgoing']).isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default BatchDetailsRow;