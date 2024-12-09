import React, { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Box,
    Typography,
    Divider,
    CardMedia
} from "@mui/material";

function EditDialog({ item, setItem, onClose, open, onEdit, preview, setPreview, setImage }) {
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

    return (
        <Dialog open={open} maxWidth="lg" fullWidth onClose={onClose}>
            <DialogTitle align="center">
                Sửa thông tin sản phẩm
            </DialogTitle>

            <DialogContent>
                <Box display="flex" gap={2}>
                    <Box flex={1}>
                        <TextField
                            label="Tên sản phẩm"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={item?.name}
                            onChange={(e) =>
                                setItem({ ...item, name: e.target.value })
                            }
                        />
                        <TextField
                            label="Mô tả"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={item?.description}
                            onChange={(e) =>
                                setItem({ ...item, description: e.target.value })
                            }
                        />
                        <Box marginTop={2}>
                            <Typography variant="body1" fontWeight="bold">
                                Trạng thái
                            </Typography>
                            <RadioGroup row value={item?.status}
                                onChange={(e) => {
                                    setItem({ ...item, status: e.target.value });
                                }}
                            >
                                <FormControlLabel
                                    value='Đang bán'
                                    control={<Radio />}
                                    label="Đang bán"
                                />
                                <FormControlLabel
                                    value="Ngừng bán"
                                    control={<Radio />}
                                    label="Ngừng bán"
                                />
                            </RadioGroup>
                        </Box>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CardMedia
                            sx={{
                                height: 280,
                                width: 235,
                                borderRadius: 1,
                                objectFit: 'contain',
                                backgroundColor: '#f0f0f0'
                            }}
                            image={preview || item?.image || 'https://res.cloudinary.com/dtsqxauba/image/upload/v1732854331/notfound_lgqmju_cyre8t.png'}
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

            <Divider sx={{ marginY: 2 }} />

            <DialogActions>
                <Button variant="outlined" color="warning" onClick={() => { onClose() }}>
                    Hủy
                </Button>
                <Button variant="contained" color="success" onClick={() => { onEdit() }}>
                    Sửa
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditDialog;