import React, { useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    CardMedia,
    Box,
    InputAdornment,
} from '@mui/material';

function UpdateDetailDialog({
    open,
    onClose,
    selectedUser,
    setSelectedUser,
    onUpdate,
    setImage,
    preview,
    setPreview,
    image
}) {    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setImage(file);
        }
    };
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    if (!selectedUser) return null;
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Cập nhật sản phẩm chi tiết</DialogTitle>

            <DialogContent>
                <Box display="flex" flexDirection="row" gap={2}>
                    <Box flex={2}>
                        <TextField
                            margin="dense"
                            label="Trọng lượng"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={selectedUser.weight}
                            onChange={(e) =>
                                setSelectedUser({ ...selectedUser, weight: e.target.value })
                            }
                            InputProps={{
                                endAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Giá nhập"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={selectedUser.importPrice}
                            onChange={(e) =>
                                setSelectedUser({ ...selectedUser, importPrice: e.target.value })
                            }
                            InputProps={{
                                endAdornment: <InputAdornment position="start">VND</InputAdornment>,
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Giá bán"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={selectedUser.price}
                            onChange={(e) =>
                                setSelectedUser({ ...selectedUser, price: e.target.value })
                            }
                            InputProps={{
                                endAdornment: <InputAdornment position="start">VND</InputAdornment>,
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Số lượng"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={selectedUser.quantity}
                            onChange={(e) =>
                                setSelectedUser({ ...selectedUser, quantity: e.target.value })
                            }
                        />
                        <FormControl component="fieldset" margin="dense">
                            <FormLabel component="legend">Trạng thái</FormLabel>
                            <RadioGroup
                                row
                                value={selectedUser.status}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value, 10);
                                    setSelectedUser({ ...selectedUser, status: newValue });
                                }}
                            >
                                <FormControlLabel
                                    value={0}
                                    control={<Radio />}
                                    label="Ngừng bán"
                                />
                                <FormControlLabel
                                    value={1}
                                    control={<Radio />}
                                    label="Đang bán"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    <Box flex={1} display="flex" flexDirection="column" alignItems="center">
                        <CardMedia
                            sx={{
                                height: 280,
                                width: 235,
                                borderRadius: 1,
                                objectFit: 'contain',
                                backgroundColor: '#f0f0f0'
                            }}
                            image={preview || image || 'https://res.cloudinary.com/dtsqxauba/image/upload/v1732854331/notfound_lgqmju_cyre8t.png'}
                            title="demo"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2 }}
                            component='label'
                        >
                            Chọn ảnh
                            <input
                                type='file'
                                hidden
                                onChange={handleImageUpload}
                            />
                        </Button>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Hủy
                </Button>
                <Button onClick={onUpdate} color="primary">
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateDetailDialog;
