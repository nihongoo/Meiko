import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Header({ setCollapsed, collapsed }) {
    return (
        <AppBar
            position="static"
            color="default"
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                height: 60,
                width: '100%',
            }}
        >
            <Toolbar sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => setCollapsed(!collapsed)}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div">
                    aaaaa
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
