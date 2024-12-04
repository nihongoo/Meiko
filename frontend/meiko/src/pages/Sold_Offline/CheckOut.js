import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function CheckOut({open, onClose}) {
    return (
        <Dialog open={open} maxWidth="sm" onClose={onClose} fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Thanh toán</Typography>
                    <Button variant="text" color="error" onClick={onClose}>X</Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box 
                  sx={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: 2,
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#555",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "#f1f1f1",
                    },
                  }}
                >
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body1">Tổng tiền hàng</Typography>
                        <Typography variant="body1" color="error" fontWeight="bold">99000VND</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-around" mb={2}>
                        <Button variant="outlined" color="primary">Chuyển khoản</Button>
                        <Button variant="outlined" color="primary">Tiền mặt</Button>
                    </Box>
                    <Box display="flex" gap={2} mb={2}>
                        <TextField fullWidth label="Tiền khách đưa" variant="outlined" />
                        <TextField fullWidth label="Mã giao dịch" variant="outlined" />
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Stt</TableCell>
                                    <TableCell>Mã giao dịch</TableCell>
                                    <TableCell>Phương thức</TableCell>
                                    <TableCell>Số tiền</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>999999</TableCell>
                                    <TableCell>chuyển khoản</TableCell>
                                    <TableCell>99000VND</TableCell>
                                    <TableCell>ok</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="body1">Tiền thiếu:</Typography>
                        <Typography variant="body1" color="error" fontWeight="bold">0VND</Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions className='justify-content-center'>
                <Button variant="outlined" color="success">Xác nhận</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CheckOut;
