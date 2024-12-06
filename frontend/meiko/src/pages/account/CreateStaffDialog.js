import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button,InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
function UpdateStaffDialog({ open, onClose, setSelectedUser, newStaff, onCreate}) {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Tạo mới nhân viên</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="UserName"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setSelectedUser({...newStaff, username: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="PassWord"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setSelectedUser({ ...newStaff, password: e.target.value })}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setSelectedUser({ ...newStaff, email: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Tên nhân viên"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setSelectedUser({ ...newStaff, staffName: e.target.value })}
                />
                                <TextField
                    margin="dense"
                    label="Số điện thoại"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setSelectedUser({ ...newStaff, phoneNumber: e.target.value })}
                />
                                                <TextField
                    margin="dense"
                    label="Địa chỉ"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setSelectedUser({ ...newStaff, address: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Hủy
                </Button>
                <Button onClick={onCreate} color="primary">
                    Tạo mới
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateStaffDialog;