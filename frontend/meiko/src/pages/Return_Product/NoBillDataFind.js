import React from "react";
import { Box, Typography } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
function NoBillDataFind() {
    return ( 
        <div>
            <Box
            sx={{
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                bgcolor: "#fff",
                padding: 3,
            }}
        >
            <CachedIcon sx={{ fontSize: 250, color: "warning.main" }} />
            <Typography variant="h3" sx={{ mt: 1, mb: 3 }}>
                Return Product
            </Typography>
        </Box>
        </div>
     );
}

export default NoBillDataFind;