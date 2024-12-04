import React from "react";
import { Box, Typography } from "@mui/material";
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';
function NoContent() {
    return ( 
        <div>
            <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                bgcolor: "#f8f9fa",
                padding: 3,
            }}
        >
            <FolderOffOutlinedIcon sx={{ fontSize: 80, color: "error.main" }} />
            <Typography variant="h6" sx={{ mt: 1, mb: 3 }}>
                No Data Found
            </Typography>
        </Box>
        </div>
     );
}

export default NoContent;