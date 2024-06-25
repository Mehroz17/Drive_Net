import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const drawerWidth = 240;

const sidebarStyles = {
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    height: 'calc(100vh - 64px)', // Adjust according to your design
    marginTop: '64px', // Adjust according to your design
  },
  toolbar: {
    minHeight: '64px', // Adjust according to your design
  },
};

const Sidebar = () => {
  return (
    <Drawer
      style={sidebarStyles.drawer}
      variant="permanent"
      classes={{
        paper: sidebarStyles.drawerPaper,
      }}
    >
      <div style={sidebarStyles.toolbar} />
      <List>
        {['Dashboard', 'Users', 'Products', 'Orders', 'Settings'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
