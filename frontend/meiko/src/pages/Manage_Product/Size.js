import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Box, Typography } from "@mui/material";
import useFetchData from "../../customHook/useFetchData.js";
import apiURL from "../../routes/API/index.js";

function Size({ onClose, onAddSize, SizeSelect }) {
    const [selectedSizes, setSelectedSizes] = useState(SizeSelect);

    const handleSizeSelect = (size) => {
        if (selectedSizes.some(selected => selected.id === size.id)) {
            setSelectedSizes(selectedSizes.filter(selected => selected.id !== size.id));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    const { data: sizes } = useFetchData(apiURL.size.all);

    useEffect(() => {
        onAddSize(selectedSizes);
    }, [selectedSizes, onAddSize]);

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className="text-center">Chọn kích thước</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} justifyContent="center">
                    {sizes.map((size) => (
                        <Grid item xs={6} sm={4} md={3} key={size.id}>
                            <Box
                                onClick={() => handleSizeSelect(size)}
                                sx={{
                                    padding: 2,
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    border: selectedSizes.some(selected => selected.id === size.id)
                                        ? '2px solid #000'
                                        : '2px solid',
                                    color: selectedSizes.some(selected => selected.id === size.id) ? '#fff' : '#000',
                                    backgroundColor: selectedSizes.some(selected => selected.id === size.id) ? '#000' : '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 2,
                                }}
                            >
                                <Typography variant="body2" sx={{
                                    color: selectedSizes.some(selected => selected.id === size.id) ? '#fff' : '#000',
                                }}>
                                    {size.name}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error">
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Size;
