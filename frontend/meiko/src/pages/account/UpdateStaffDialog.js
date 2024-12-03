import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';

function UpdateStaffDialog({ open, onClose, selectedUser, setSelectedUser, onUpdate }) {
    if (!selectedUser) return null;
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Cập nhật thông tin nhân viên</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Tên"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={selectedUser.staffName || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, staffName: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={selectedUser.email || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Số điện thoại"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={selectedUser.phoneNumber || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Địa chỉ"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={selectedUser.address || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                />
                <FormControl component="fieldset">
                    <FormLabel component="legend">Trạng thái</FormLabel>
                    <RadioGroup
                        row
                        value={selectedUser.status}
                        onChange={(e) => {
                            const newValue = parseInt(e.target.value, 10);
                            setSelectedUser({ ...selectedUser, status: newValue });
                        }}                    >
                        <FormControlLabel value={0} control={<Radio />} label="Không hoạt động" />
                        <FormControlLabel value={1} control={<Radio />} label="Đang hoạt động" />
                    </RadioGroup>
                </FormControl>
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

export default UpdateStaffDialog;