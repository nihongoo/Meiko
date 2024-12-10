import React from "react";
import {
    Dialog,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Grid,
    Box,
    Typography,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import apiURL from "../../routes/API";
import useFetchData from "../../customHook/useFetchData";
import moment from 'moment'

function StateBill({ open, onClose, item, print, setItem }) {
    const paginationModel = { page: 0, pageSize: 5 };
    const { data: Detail } = useFetchData(`${apiURL.bill.list}?id=${item?.id}`);
    const sortedStatusHistories = item?.statusHistories
        ? item.statusHistories.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate))
        : [];

    const steps = sortedStatusHistories.map(history => ({
        label: history.statusType,
        description: moment(history.createdDate).format('DD-MM-YYYY HH:mm')
    }));
    const totalPaid = item?.paymentHistories?.reduce((acc, item) => acc + item.amount, 0) || 0;
    const paymentColumns = [
        { field: "amount", headerName: "Số tiền", flex: 1 },
        { field: "createdDate", headerName: "Thời gian", flex: 1 },
        { field: "paymentMethod", headerName: "PTTT", flex: 1 },
        { field: "status", headerName: "Trạng thái", flex: 1 },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth >
            <Box display="flex" sx={{
                height: '100%',
                width: '100%'
            }}>
                {/* Stepper Section */}
                <Box
                    bgcolor={'#f8f8f8'}
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minWidth: 256
                    }}
                >
                    {/* Stepper Section */}
                    <Box>
                        <Stepper activeStep={steps.length - 1} orientation="vertical">
                            {steps.map((step, index) => (
                                <Step key={index}>
                                    <StepLabel>{step.label}</StepLabel>
                                    <StepContent>{step.description}</StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    {/* Summary Section */}
                    <Box mt={2} pt={2} borderTop={`1px solid rgba(0, 0, 0, 0.12)`}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Tổng tiền hàng:</Typography>
                                <Typography variant="body1">Phí vận chuyển:</Typography>
                                <Typography variant="body1">Tổng thanh toán:</Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                                <Typography variant="body1">{item?.total || 'N/A'}</Typography>
                                <Typography variant="body1">{item?.shippingFee || 'N/A'}VND</Typography>
                                <Typography variant="body1">{totalPaid || '0'}VND</Typography>
                            </Grid>
                        </Grid>
                        <Box>
                            <Button variant="outlined" onClick={() => { print(item) }}>
                                In
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Main Content Section */}
                <Box sx={{ flex: 2, p: 2 }}>
                    {/* Bill Info Section */}
                    <Box mb={2} textAlign="center">
                        <Typography variant="h5">{`Đơn hàng - ${item?.billCode || 'N/A'}`}</Typography>
                    </Box>

                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography>{`Mã hóa đơn: ${item?.billCode || 'N/A'}`}</Typography>
                            <Typography>{`Tên khách hàng: ${item?.customerName || 'N/A'}`}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>{`Loại hóa đơn: ${item?.billType || 'N/A'}`}</Typography>
                            <Typography>{`Trạng thái: ${item?.status || 'N/A'}`}</Typography>
                        </Grid>
                    </Grid>

                    {/* Overflow Section for Payment History and Product List */}
                    <Box sx={{
                        overflowY: 'auto',
                        maxHeight: 'calc(100vh - 300px)',
                        bgcolor: '#fff',
                        p: 2,
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
                    }}>
                        {/* Payment History */}
                        <Box mb={2}>
                            <Typography variant="h6" gutterBottom>
                                Lịch sử thanh toán
                            </Typography>
                            <DataGrid
                                rows={item?.paymentHistories}
                                columns={paymentColumns}
                                autoHeight
                                disableSelectionOnClick
                                initialState={{ pagination: { paginationModel } }}
                                pageSize={5}
                                pageSizeOptions={[5, 10]}
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: 'none',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        borderBottom: 'none',
                                    },
                                    backgroundColor: '#fff',
                                    minHeight: 250,
                                }}
                            />
                        </Box>

                        {/* Product List */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Danh sách sản phẩm
                            </Typography>
                            <Box flexWrap="wrap" gap={2}>
                                {Detail && Detail.map((item) => (
                                    <Box
                                        mb={2}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flex: 1,
                                            gap: 2,
                                            p: 1,
                                            border: "1px solid rgba(0, 0, 0, 0.12)",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <img
                                            width={100}
                                            src={item?.imgUrl}
                                            alt="Product"
                                        />
                                        <Box>
                                            <Typography>{item?.name}</Typography>
                                            <Typography>Số lượng:{item?.quantity}</Typography>
                                            <Typography>Màu: {item?.color}</Typography>
                                            <Typography>Size: {item?.size}</Typography>
                                            <Typography>Giá: {item?.price}VND</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
}

export default StateBill;