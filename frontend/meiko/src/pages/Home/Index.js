import React, { useState } from "react";
import { Box, Typography, Card, Grid, Divider, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CategoryIcon from '@mui/icons-material/Category';
import useFetchData from "../../customHook/useFetchData";
import apiURL from "../../routes/API";
import moment from "moment";

const revenueColumns = [
    { field: "date", headerName: "Ngày", width: 150 },
    { field: "name", headerName: "Tên sản phẩm", width: 200 },
    { field: "color", headerName: "Màu", width: 150 },
    { field: "size", headerName: "Size", width: 100 },
    { field: "sold", headerName: "Đã bán", width: 150 },
    { field: "revenue", headerName: "Doanh thu", width: 200 },
];

const productColumns = [
    { field: "id", headerName: "STT", width: 100 },
    { field: "name", headerName: "Tên", width: 200 },
    { field: "color", headerName: "Màu", width: 150 },
    { field: "size", headerName: "Size", width: 100 },
    { field: "sold", headerName: "Đã bán", width: 150 },
    { field: "revenue", headerName: "Doanh thu", width: 200 },
];

const Home = () => {
    const paginationModel = { page: 0, pageSize: 10 };
    const [day, setDay] = useState(null)
    const { data: topProductForDay } = useFetchData(`${apiURL.analysis.topProduct}?date=${day}`, (r) => {
        return r.map((item, index) => ({
            ...item,
            id: index,
            date: moment(item.date).format('DD-MM-YYYY')
        }));
    })
    const { data: all } = useFetchData(apiURL.analysis.all)
    const { data: topProduct } = useFetchData(apiURL.analysis.topProduct, (r) => {
        return r.map((item, index) => ({
            ...item,
            id: index + 1,
        }));
    })
    const { data: topCustomer } = useFetchData(apiURL.analysis.topCustomer, (r) => {
        return r.map((item) => ({
            ...item,
            amountSpent: new Intl.NumberFormat('vi-VN').format(item.amountSpent) + ' VND'
        }));
    })
    const totalRevenue = topProductForDay.reduce((total, item) => total + item.revenue, 0);
    return (
        <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2 }}>
            <Box>
                <Typography variant="h4" color="primary" gutterBottom>
                    Thống kê
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Card className="me-3 border rounded-2 p-3">
                            <Typography color="error" variant="h6">{all.allQuantityProduct || '0'}</Typography>
                            <Typography>Sản phẩm đã bán</Typography>
                            <CategoryIcon />
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card className="me-3 border rounded-2 p-3">
                            <Typography color="error" variant="h6">{all.totalRevenue || '0'} VND</Typography>
                            <Typography>Doanh thu</Typography>
                            <LocalAtmIcon></LocalAtmIcon>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card className="me-3 border rounded-2 p-3">
                            <Typography color="error" variant="h6">{all.profit || '0'} VND</Typography>
                            <Typography>Lợi nhuận</Typography>
                            <LocalAtmIcon />
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Box mt={4}>
                <Typography variant="h4" color="primary" gutterBottom>
                    Doanh thu theo ngày
                </Typography>
                <div className="d-flex justify-content-between">
                    <Typography>Doanh thu ngày {day || 'Vui lòng chọn ngày!'}: {totalRevenue} VND</Typography>
                    <TextField
                        type='date'
                        label='Từ ngày'
                        variant='outlined'
                        size='small'
                        sx={{ mr: 2 }}
                        onChange={(e) =>
                            setDay(e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                    />
                </div>
                <DataGrid
                    rows={topProductForDay}
                    columns={revenueColumns}
                    autoHeight
                    pageSize={10}
                    pageSizeOptions={[10, 20]}
                    initialState={{ pagination: { paginationModel } }}
                    disableSelectionOnClick
                    rowHeight={80}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            borderBottom: 'none',
                        },
                        backgroundColor: '#fff',
                        minHeight: 550,
                        maxHeight: 'calc(100vh - 200px)',
                    }}
                />
            </Box>

            <Box
                mt={4}
                display="flex"
                gap={4}
                sx={{
                    flexDirection: { xs: "column", md: "row" }, // Chuyển sang dọc trên màn hình nhỏ
                }}
            >
                <Box flex={1}>
                    <Typography variant="h4" color="primary" gutterBottom>
                        Thống kê sản phẩm
                    </Typography>
                    <DataGrid
                        rows={topProduct}
                        columns={productColumns}
                        pageSize={10}
                        pageSizeOptions={[10, 20]}
                        initialState={{ pagination: { paginationModel } }}
                        autoHeight
                        disableSelectionOnClick
                        rowHeight={80}
                        sx={{
                            border: "none",
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                borderBottom: "none",
                            },
                            backgroundColor: "#fff",
                            minHeight: 550,
                            maxHeight: "calc(100vh - 200px)",
                        }}
                    />
                </Box>

                <Box flex={1}>
                    <Card className="me-3 border rounded-2 p-3" sx={{ minHeight: 550, }}>
                        <Typography variant="h4" gutterBottom color="primary">
                            Top khách hàng mua sắm nhiều
                        </Typography>
                        {topCustomer && topCustomer.map((customer, index) => (
                            <Box>
                                <Box display="flex" alignItems="center" mb={2} key={index}>
                                    <Box>Hạng {index + 1}</Box>
                                    <Box ml={2}>
                                        <Typography>{customer.name}</Typography>
                                        <Typography>{customer.phoneNumber}</Typography>
                                    </Box>
                                    <Box ml={2}>{customer.amountSpent}</Box>
                                </Box>
                                <Divider sx={{
                                    my: 1, height: 2,
                                    backgroundColor: "#000",
                                }} />
                            </Box>
                        ))}
                    </Card>
                </Box>
            </Box>

        </Box>
    );
};

export default Home;
