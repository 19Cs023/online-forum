import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Container, Grid, Paper, Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

const DashBoard = () => {
  const navigate = useNavigate();
  // Get actual user from Zustand global state
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1"sx = {{ fontWeight: 'bold', color: 'primary.main' }}>
          Dashboard
        </Typography>
        {user && (
          <Typography variant="subtitle1" color="text.secondary">
            Welcome, {user.name}
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
             <List>
               <ListItem button component="a" href="#overview">
                 <ListItemText primary="Overview" />
               </ListItem>
               <ListItem button component="a" href="#profile">
                 <ListItemText primary="Profile Settings" />
               </ListItem>
               <ListItem button component="a" href="#security">
                 <ListItemText primary="Security" />
               </ListItem>
               <ListItem button component="a" href="#activity">
                 <ListItemText primary="Activity Log" />
               </ListItem>
             </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          {/* Stats */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h3" variant="h6" color="primary" gutterBottom>Total Views</Typography>
                <Typography component="p" variant="h4">1,245</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h3" variant="h6" color="primary" gutterBottom>Active Sessions</Typography>
                <Typography component="p" variant="h4">12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h3" variant="h6" color="primary" gutterBottom>New Messages</Typography>
                <Typography component="p" variant="h4">4</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Successful login from new IP" secondary="10:42 AM" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="Profile settings updated" secondary="09:15 AM" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="Password changed successfully" secondary="Yesterday" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashBoard;
