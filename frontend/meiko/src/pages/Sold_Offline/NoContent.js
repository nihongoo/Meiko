import React from "react";
import { Box, Typography } from "@mui/material";
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';
function NoContent() {
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
            <FolderOffOutlinedIcon sx={{ fontSize: 80, color: "error.main" }} />
            <Typography variant="h6" sx={{ mt: 1, mb: 3 }}>
                No Data Found
            </Typography>
        </Box>
        </div>
     );
}

export default NoContent;