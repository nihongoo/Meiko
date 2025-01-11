import React, { forwardRef, useImperativeHandle, useState, useEffect, useContext } from "react";
import { Button, Typography, Box, Divider } from '@mui/material';
import useFetchData from '../../customHook/useFetchData';
import apiURL from '../../routes/API';
import CheckOut from './CheckOut';
import { BillInfoContext } from './SoldOfline';
import { toast } from "react-toastify";

const BillInfo = forwardRef(({ bill }, ref) => {
    const { handleCloseTab, index } = useContext(BillInfoContext);
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
    const handleConfirmBill = async () => {
        try {
            // Check if payment is complete
            if (billInfo.billDetails.length === 0) {
                toast.warning('Chưa chọn sản phẩm nào')
                return
            }
            if (remaining > 0) {
                toast.warning('Vui lòng thanh toán đủ số tiền trước khi xác nhận hóa đơn!');
                return;
            }

            // Close bill tab
            handleCloseTab(index, 'Hóa đơn đã hoàn thành!');

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Có lỗi xảy ra khi xác nhận hóa đơn!');
        }
    };

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
                <Button variant="outlined" onClick={handleConfirmBill} color="success">
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