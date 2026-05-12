import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { AppBar, Toolbar, Typography, Button, TextField, Box, InputAdornment, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Navigation = () => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      navigate(`/search?q=${encodedQuery}`);
      setMobileOpen(false); // Close drawer on search if open
    } catch (err) {
      console.error('Error during search navigation:', err);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = token ? (
    <>
      <ListItem button component={Link} to="/dashboard" onClick={handleDrawerToggle}>
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component={Link} to="/profile" onClick={handleDrawerToggle}>
        <ListItemIcon><AccountCircleIcon /></ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem button component={Link} to="/signout" onClick={handleDrawerToggle}>
        <ListItemIcon><LogoutIcon color="primary" /></ListItemIcon>
        <ListItemText primary="Sign Out" sx={{ color: 'primary.main', fontWeight: 'bold' }} />
      </ListItem>
    </>
  ) : (
    <>
      <ListItem button component={Link} to="/signin" onClick={handleDrawerToggle}>
        <ListItemIcon><LoginIcon /></ListItemIcon>
        <ListItemText primary="Sign In" />
      </ListItem>
      <ListItem button component={Link} to="/register" onClick={handleDrawerToggle}>
        <ListItemIcon><PersonAddIcon color="primary" /></ListItemIcon>
        <ListItemText primary="Sign Up" sx={{ color: 'primary.main', fontWeight: 'bold' }} />
      </ListItem>
    </>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', flexGrow: { xs: 1, md: 0 } }}>
          MERN Skeleton
        </Typography>

        {/* Desktop Search */}
        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', mx: 2 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ maxWidth: 400, width: '100%' }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
          />
        </Box>

        {/* Desktop Buttons */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {token ? (
            <>
              <Button component={Link} to="/dashboard" color="inherit" startIcon={<DashboardIcon />}>Dashboard</Button>
              <Button component={Link} to="/profile" color="inherit" startIcon={<AccountCircleIcon />}>Profile</Button>
              <Button component={Link} to="/signout" variant="contained" color="primary" startIcon={<LogoutIcon />}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/signin" color="inherit" startIcon={<LoginIcon />}>Sign In</Button>
              <Button component={Link} to="/register" variant="contained" color="primary" startIcon={<PersonAddIcon />}>Sign Up</Button>
            </>
          )}
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Menu
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {/* Mobile Search */}
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>
          <Divider sx={{ mb: 1 }} />
          
          <List>
            {menuItems}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navigation;
