import React, { useState } from 'react';
import { DialogContent, TextField, Button, Snackbar, Box, InputAdornment } from '@mui/material';
import { ChromePicker } from 'react-color'; // Import ChromePicker from react-color
import { toast } from 'react-toastify';
import apiURL from '../../routes/API/index';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function ColorPicker({ onClose }) {
    const [obj, setObj] = useState({
        name: '',
        hex: '#7D4141',
        status: 1
    });

    const handleChangeComplete = (color) => {
        setObj((prev) => ({
            ...prev,
            hex: color.hex
        }));
    };

    const handleAddColor = async () => {
        try {
            const res = await fetch(apiURL.color.create, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            });

            if (!res.ok) {
                throw new Error('Failed to add color');
            }
            toast.success('Thêm màu mới thành công');
            onClose()
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm màu');
        }
    };

    return (
        <Box>
            <DialogContent>
                <ChromePicker
                    color={obj.hex}
                    onChangeComplete={handleChangeComplete}
                    style={{ width: '100%' }}
                />
                <TextField
                    margin='dense'
                    placeholder="Nhập tên màu"
                    variant="outlined"
                    fullWidth
                    size="small"
                    onChange={(e) => setObj((prev) => ({
                        ...prev,
                        name: e.target.value
                    }))}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    sx={{ whiteSpace: 'nowrap' }}
                                    onClick={handleAddColor}
                                >
                                    <CheckCircleOutlineIcon />
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>
        </Box>
    );
}

export default ColorPicker;
