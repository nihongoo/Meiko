import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import moment from 'moment';

function UpdateUserDialog({ open, onClose, selectedUser, setSelectedUser, onUpdate }) {
    if (!selectedUser) return null; 
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Cập nhật thông tin khách hàng</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Tên"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={selectedUser.name || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
                <FormControl component="fieldset">
                    <FormLabel component="legend">Giới tính</FormLabel>
                    <RadioGroup
                        row
                        value={selectedUser.sex.toString()}
                        onChange={(e) => setSelectedUser({ ...selectedUser, sex: e.target.value === 'true' })}
                    >
                        <FormControlLabel value={true} control={<Radio />} label="Nam" />
                        <FormControlLabel value={false} control={<Radio />} label="Nữ" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    margin="dense"
                    label="Ngày sinh"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={moment(selectedUser.birthDay, 'DD-MM-YYYY').format('YYYY-MM-DD') || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, birthDay: moment(e.target.value).format('DD-MM-YYYY') })}
                    InputLabelProps={{
                        shrink: true,
                    }}
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

export default UpdateUserDialog;