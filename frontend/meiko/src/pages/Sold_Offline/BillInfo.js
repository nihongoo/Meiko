import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Button, Typography, Box, Divider } from '@mui/material';
import useFetchData from '../../customHook/useFetchData';
import apiURL from '../../routes/API';
import CheckOut from './CheckOut';

const BillInfo = forwardRef(({ bill }, ref) => {
    const [checkOut, setCheckOut] = useState(false)
    const [cashAmount, setCashAmount] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const { data: payHistory, refetch } = useFetchData(`${apiURL.payHistory.byBillId}${bill.id}`);
    const totalPaid = payHistory?.reduce((acc, item) => acc + item.amount, 0) || 0;

    const { data: billInfo, refetch: reload } = useFetchData(`${apiURL.bill.billId}${bill.id}`, null, true)
    useImperativeHandle(ref, () => ({
        reload,
    }));

    useEffect(() => {
        setRemaining(billInfo.total - totalPaid);
        setCashAmount(totalPaid)
    }, [billInfo.total, totalPaid]);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6">Khách hàng</Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Box sx={{ width: '100%', maxWidth: '400px' }}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Tổng tiền:</Typography>
                        <Typography variant="body1" color="error" fontWeight="bold">
                            {new Intl.NumberFormat('vi-VN').format(billInfo.total) + ' VND'}
                        </Typography>                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Box>
                            <Typography>Khách thanh toán:</Typography>
                            <Button variant="outlined" onClick={() => { setCheckOut(true) }} color="primary">Thanh toán</Button>
                        </Box>
                        <Typography variant="body1" color="error" fontWeight="bold">
                            {new Intl.NumberFormat('vi-VN').format(cashAmount) + ' VND'}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Tiền thiếu:</Typography>
                        <Typography variant="body1" color="error" fontWeight="bold">
                            {new Intl.NumberFormat('vi-VN').format(remaining) + ' VND'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="outlined" color="success">
                    Xác nhận hóa đơn
                </Button>
            </Box>
            <CheckOut
                open={checkOut}
                onClose={() => { setCheckOut(false) }}
                bill={bill}
                billInfo={billInfo}
                reload={refetch}
            >

            </CheckOut>
        </Box>
    );
})

export default BillInfo;