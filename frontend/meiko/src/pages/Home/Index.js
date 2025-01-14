import React, { useState } from "react";
import { Box, Typography, Card, Grid, Divider, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CategoryIcon from '@mui/icons-material/Category';
import useFetchData from "../../customHook/useFetchData";
import apiURL from "../../routes/API";
import moment from "moment";

const StatCard = ({ title, value, growth, icon: Icon }) => (
    <Card className="border rounded-2 p-3">
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
                <Typography color="error" variant="h6">
                    {new Intl.NumberFormat('vi-VN').format(value || 0)} {title.includes("VND") ? "VND" : ""}
                </Typography>
                <Typography>{title}</Typography>
            </Box>
            <Icon />
        </Box>
        {growth !== undefined && (
            <Box display="flex" alignItems="center" mt={1}>
                {growth >= 0 ? (
                    <TrendingUpIcon color="success" />
                ) : (
                    <TrendingDownIcon color="error" />
                )}
                <Typography color={growth >= 0 ? "success.main" : "error"}>
                    {Math.abs(growth).toFixed(2)}%
                </Typography>
            </Box>
        )}
    </Card>
);
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
    const [day, setDay] = useState(new Date().toISOString().substr(0, 10));
    const { data: all = {} } = useFetchData(apiURL.analysis.all);
    const { data: topProductForDay = [] } = useFetchData(`${apiURL.analysis.topProduct}?date=${day}`, formatTopProduct);
    const { data: topProduct = [] } = useFetchData(apiURL.analysis.topProduct, formatTopProduct);
    const { data: topCustomer = [] } = useFetchData(apiURL.analysis.topCustomer, formatCustomer);

    const totalRevenue = topProductForDay.reduce((total, item) => total + item.revenue, 0);

    const paginationModel = { page: 0, pageSize: 10 };
    return (
        <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2 }}>
            <Box mb={4}>
                <Typography variant="h4" color="primary" gutterBottom>
                    Thống kê tuần này
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <StatCard 
                            title="Sản phẩm đã bán"
                            value={all.allQuantityProduct}
                            growth={all.quantityGrowth}
                            icon={CategoryIcon}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard 
                            title="Doanh thu (VND)"
                            value={all.totalRevenue}
                            growth={all.revenueGrowth}
                            icon={LocalAtmIcon}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard 
                            title="Lợi nhuận (VND)"
                            value={all.profit}
                            growth={all.profitGrowth}
                            icon={LocalAtmIcon}
                        />
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
                        label='Chọn ngày'
                        variant='outlined'
                        size='small'
                        value={day}
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
const formatTopProduct = (r) => r.map((item, index) => ({
    ...item,
    id: index + 1,
    revenue: new Intl.NumberFormat('vi-VN').format(item.revenue),
    date: moment(item.date).format('DD-MM-YYYY')
}));

const formatCustomer = (r) => r.map((item) => ({
    ...item,
    amountSpent: new Intl.NumberFormat('vi-VN').format(item.amountSpent)
}));

export default Home;
