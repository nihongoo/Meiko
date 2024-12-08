import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Typography, Box, Divider } from '@mui/material';
import useFetchData from '../../customHook/useFetchData';
import apiURL from '../../routes/API';
import CheckOut from './CheckOut';

const BillInfo = forwardRef(({ bill }, ref) => {
    const [checkOut, setCheckOut] = useState(false)
    const {data: billInfo, refetch: reload} = useFetchData(`${apiURL.bill.billId}${bill.id}`,null, true)
    useImperativeHandle(ref, () => ({
        reload,
      }));
      console.log(billInfo);
      
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6">Khách hàng</Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Box sx={{ width: '100%', maxWidth: '400px' }}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Tổng tiền:</Typography>
                        <Typography color="error" fontWeight="bold">{billInfo.total+'VND'}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Box>
                            <Typography>Khách thanh toán:</Typography>
                            <Button variant="outlined" onClick={()=>{setCheckOut(true)}} color="primary">Thanh toán</Button>
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
            <CheckOut
            open={checkOut}
            onClose={()=>{setCheckOut(false)}}
            >

            </CheckOut>
        </Box>
    );
})

export default BillInfo;