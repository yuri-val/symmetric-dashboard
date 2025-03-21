import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';

function Configuration() {
  const [config, setConfig] = useState({
    nodeGroups: [],
    channels: [],
    triggers: []
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/api/engine/config');
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Node Groups
            </Typography>
            <List>
              {config.nodeGroups.map((group) => (
                <ListItem key={group.id}>
                  <ListItemText
                    primary={group.id}
                    secondary={group.description}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Channels
            </Typography>
            <List>
              {config.channels.map((channel) => (
                <ListItem key={channel.id}>
                  <ListItemText
                    primary={channel.id}
                    secondary={`Max Batch Size: ${channel.max_batch_size}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Triggers
            </Typography>
            <List>
              {config.triggers.map((trigger) => (
                <ListItem key={trigger.triggerId}>
                  <ListItemText
                    primary={trigger.sourceTableName}
                    secondary={`Channel: ${trigger.channelId}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Configuration;