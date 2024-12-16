import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Box, Typography, IconButton, Badge } from "@mui/material";
import useFetchData from "../../customHook/useFetchData";
import apiURL from "../../routes/API/index";
import ColorPicker from "./ColorPicker";
import CloseIcon from '@mui/icons-material/Close';

function Color({ onClose, onAddColor, colorSelect }) {
    const [selectedColors, setSelectedColors] = useState(colorSelect);
    const [colorPick, setColorPick] = useState(false)
    const [onChange, setOnChange] = useState(false)
    const handleColorSelect = (color) => {
        if (selectedColors.some(selected => selected.id === color.id)) {
            setSelectedColors(selectedColors.filter(selected => selected.id !== color.id));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const { data: colors } = useFetchData(apiURL.color.all);

    useEffect(() => {
        onAddColor(selectedColors);
    }, [selectedColors, onAddColor]);

    const handleChangeData = () => {
        setOnChange(!onChange);
    };

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className="text-center">Chọn màu</DialogTitle>
            <DialogContent className="pt-2">
                <Box display="flex" flexDirection="row" gap={2}>
                    <Grid container spacing={2} justifyContent="center">
                        {colors.map((color) => (
                            <Grid item xs={6} sm={4} md={3} key={color.id}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                    }}
                                >
                                    {/* <Badge
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        overlap="circular" // Thêm overlap để đảm bảo badge nằm đúng vị trí
                                    >
                                        <IconButton
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Gọi hàm xóa màu
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                transform: 'translate(50%, -50%)',
                                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                borderRadius: '50%',
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Badge> */}
                                    <Box
                                        onClick={() => handleColorSelect(color)}
                                        sx={{
                                            padding: 1,
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            border: selectedColors.some(selected => selected.id === color.id)
                                                ? `2px solid ${color.hex}`
                                                : '2px solid',
                                            color: selectedColors.some(selected => selected.id === color.id) ? '#fff' : `${color.hex}`,
                                            position: 'relative',
                                            backgroundColor: selectedColors.some(selected => selected.id === color.id) ? `${color.hex}` : '#fff'
                                        }}
                                    >
                                        <Typography variant="body2" textAlign="center"
                                            sx={{
                                                color: selectedColors.some(selected => selected.id === color.id) ? '#fff' : `${color.hex}`,
                                            }}
                                        >
                                            {color.name}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    {colorPick && (
                        <Box ml={4}>
                            <ColorPicker onChange={handleChangeData} onClose={onClose} />
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error">
                    Hủy
                </Button>
                <Button
                    onClick={() => setColorPick(!colorPick)}
                    variant="outlined"
                    color="success"
                >
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Color;
