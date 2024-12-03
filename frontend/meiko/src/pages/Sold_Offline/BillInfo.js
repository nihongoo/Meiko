import React from 'react';
import { TextField, Button, Typography, Box, Divider } from '@mui/material';

function BillInfo() {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6">Khách hàng</Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Box sx={{ width: '100%', maxWidth: '400px' }}>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <TextField
                            variant="outlined"
                            placeholder="Phiếu giảm giá"
                            size="small"
                            sx={{ mr: 1, flex: '0 1 250px' }} // Kích thước nhỏ hơn và lệch phải
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Loại phiếu"
                            size="small"
                            sx={{ flex: '0 1 250px' }} // Kích thước nhỏ hơn và lệch phải
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Tiền hàng:</Typography>
                        <Typography>99000 VND</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Giá giảm:</Typography>
                        <Typography>1000 VND</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Tổng tiền:</Typography>
                        <Typography color="error" fontWeight="bold">98000 VND</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Box>
                            <Typography>Khách thanh toán:</Typography>
                            <Button variant="outlined" color="primary">Thanh toán</Button>
                        </Box>
                        <Typography color="error" fontWeight="bold">98000 VND</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Tiền thiếu:</Typography>
                        <Typography color="error" fontWeight="bold">0 VND</Typography>
                    </Box>
                </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="outlined" color="success">
                    Xác nhận hóa đơn
                </Button>
            </Box>
        </Box>
    );
}

export default BillInfo;