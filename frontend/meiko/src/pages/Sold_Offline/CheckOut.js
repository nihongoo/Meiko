import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import apiURL from '../../routes/API';
import useFetchData from '../../customHook/useFetchData';
import { BillInfoContext } from './SoldOfline';

function CheckOut({ open, onClose, bill, billInfo, reload }) {
    const {handleCloseTab, index} = useContext(BillInfoContext)
    const [paymentMethod, setPaymentMethod] = useState('transfer');
    const [cashAmount, setCashAmount] = useState('');
    const [remaining, setRemaining] = useState(0);
    const paginationModel = { page: 0, pageSize: 5 };
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo'));
    const { data: payHistory, refetch } = useFetchData(`${apiURL.payHistory.byBillId}${bill.id}`);

    const handlePaymentMethod = (method) => {
        setPaymentMethod(method);
    };

    const totalPaid = payHistory?.reduce((acc, item) => acc + item.amount, 0) || 0;

    useEffect(() => {
        setRemaining(billInfo.total - totalPaid);
    }, [billInfo.total, totalPaid]);

    const handleCheckout = async () => {
        if (remaining <= 0) {
            toast.error('Hóa đơn đã hoàn thành hoặc chưa có sản phẩm nào được chọn');
            return;
        }
        if (paymentMethod === 'cash') {
            const newRemaining = remaining - cashAmount;
            console.log(newRemaining);
            
            try {
                const res = await fetch(`${apiURL.bill.pay}${bill.id}?paymentAmount=${cashAmount}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error('Thanh toán thất bại');
                }
                if (newRemaining <= 0) {
                    const payload = {
                        statusType: 5,
                        note: 'Tạo mới hóa đơn thành công',
                        staffWhoCreatedThis: staffInfo.id,
                    };
                    await fetch(`${apiURL.bill.changeStatus}${bill.id}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });
                    handleCloseTab(index, 'Hóa đơn đã hoàn thành!')
                }

                toast.success('Thanh toán thành công!');
                setCashAmount('');
                reload()
                refetch();
            } catch (error) {
                console.error(error);
                toast.error(error.message || 'Có lỗi xảy ra!');
            }
        }
    };

    const columns = [
        { field: 'id', headerName: 'STT', flex: 1 },
        { field: 'paymentMethod', headerName: 'Phương thức', flex: 1 },
        { field: 'amount', headerName: 'Số tiền', flex: 1 },
        { field: 'status', headerName: 'Trạng thái', flex: 1 },
    ];

    const rows = payHistory?.map((item, index) => ({
        id: index + 1,
        paymentMethod: item.paymentMethod,
        amount: new Intl.NumberFormat('vi-VN').format(item.amount) + ' VND',
        status: item.status,
    })) || [];
    return (
        <Dialog open={open} maxWidth="sm" onClose={onClose} fullWidth overflowY={'hidden'}>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Thanh toán</Typography>
                    <Button variant="text" color="error" onClick={onClose}>
                        X
                    </Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        overflowY: 'auto',
                        padding: 2,
                        "&::-webkit-scrollbar": { width: "6px" },
                        "&::-webkit-scrollbar-thumb": { backgroundColor: "#888", borderRadius: "10px" },
                        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" },
                        "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
                    }}
                >
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body1">Tổng tiền hàng</Typography>
                        <Typography variant="body1" color="error" fontWeight="bold">
                            {new Intl.NumberFormat('vi-VN').format(billInfo.total) + ' VND'}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-around" mb={2}>
                        <Button
                            variant={paymentMethod === 'transfer' ? "contained" : "outlined"}
                            color="primary"
                            onClick={() => handlePaymentMethod('transfer')}
                        >
                            Chuyển khoản
                        </Button>
                        <Button
                            variant={paymentMethod === 'cash' ? "contained" : "outlined"}
                            color="primary"
                            onClick={() => handlePaymentMethod('cash')}
                        >
                            Tiền mặt
                        </Button>
                    </Box>
                    <Box display="flex" gap={2} mb={2}>
                        <TextField
                            fullWidth
                            label="Tiền khách đưa"
                            onChange={(e) => {
                                const value = Math.max(0, Number(e.target.value));
                                setCashAmount(value);
                            }}
                            variant="outlined"
                            type="number"
                            value={cashAmount}
                        />
                        {paymentMethod !== 'cash' && (
                            <TextField fullWidth label="Mã giao dịch" variant="outlined" />
                        )}
                    </Box>
                    <Box sx={{ height: 300, width: '100%', marginTop: 2 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSize={5}
                            pageSizeOptions={[5, 10]}
                            disableSelectionOnClick
                            sx={{
                                border: 'none',
                                '& .MuiDataGrid-cell': {
                                    borderBottom: 'none',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    borderBottom: 'none',
                                },
                                backgroundColor: '#fff',
                                minHeight: 300,
                                maxHeight: 'calc(100vh - 200px)',
                            }}
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="body1">Tiền thiếu:</Typography>
                        <Typography variant="body1" color="error" fontWeight="bold">
                            {new Intl.NumberFormat('vi-VN').format(remaining) + ' VND'}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions className="justify-content-center">
                <Button variant="outlined" color="success" onClick={handleCheckout}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CheckOut;