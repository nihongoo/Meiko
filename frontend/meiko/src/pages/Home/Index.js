import React from "react";
import { Box, Typography, Card, Grid, Divider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CategoryIcon from '@mui/icons-material/Category';

const revenueColumns = [
    { field: "date", headerName: "Ngày", width: 150 },
    { field: "productName", headerName: "Tên sản phẩm", width: 200 },
    { field: "color", headerName: "Màu", width: 150 },
    { field: "size", headerName: "Size", width: 100 },
    { field: "sold", headerName: "Đã bán", width: 150 },
    { field: "revenue", headerName: "Doanh thu", width: 200 },
];

const revenueRows = [
    {
        id: 1,
        date: "16-01-2024",
        productName: "Túi xách oách xà lách vc",
        color: "Nâu",
        size: 36,
        sold: 20,
        revenue: "20.000.000VND",
    },
    {
        id: 2,
        date: "16-01-2024",
        productName: "Túi xách oách xà lách vc",
        color: "Nâu",
        size: 35,
        sold: 18,
        revenue: "18.000.000VND",
    },
];

const productColumns = [
    { field: "id", headerName: "STT", width: 100 },
    { field: "name", headerName: "Tên", width: 200 },
    { field: "color", headerName: "Màu", width: 150 },
    { field: "size", headerName: "Size", width: 100 },
    { field: "sold", headerName: "Đã bán", width: 150 },
    { field: "revenue", headerName: "Doanh thu", width: 200 },
];

const productRows = [
    {
        id: 1,
        name: "Túi xách oách xà lách vc",
        color: "Nâu",
        size: 36,
        sold: 20,
        revenue: "20.000.000VND",
    },
    {
        id: 2,
        name: "Túi xách oách xà lách vc",
        color: "Nâu",
        size: 35,
        sold: 18,
        revenue: "18.000.000VND",
    },
];

const Home = () => {
    const paginationModel = { page: 0, pageSize: 10 };
    return (
        <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2 }}>
            <Box>
                <Typography variant="h4" color="primary" gutterBottom>
                    Thống kê
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Card className="me-3 border rounded-2 p-3">
                            <Typography color="error" variant="h6">16</Typography>
                            <Typography>Sản phẩm</Typography>
                            <CategoryIcon/>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card className="me-3 border rounded-2 p-3">
                            <Typography color="error" variant="h6">322.650.000VND</Typography>
                            <Typography>Doanh thu</Typography>
                            <LocalAtmIcon></LocalAtmIcon>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card className="me-3 border rounded-2 p-3">
                            <Typography color="error" variant="h6">98.600.000VND</Typography>
                            <Typography>Lợi nhuận</Typography>
                            <LocalAtmIcon/>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Box mt={4}>
                <Typography variant="h4" color="primary" gutterBottom>
                    Doanh thu theo ngày
                </Typography>
                <Typography>Doanh thu(16-02-2024): 38.000.000VND</Typography>
                <DataGrid
                    rows={revenueRows}
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
                        rows={productRows}
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
                        <Box display="flex" alignItems="center" mb={2}>
                            <Box>Hạng 1</Box>
                            <Box ml={2}>
                                <Typography>Nguyễn Văn A</Typography>
                                <Typography>0987654321</Typography>
                            </Box>
                            <Box ml={2}>5.000.000VND</Box>
                        </Box>
                        <Divider sx={{
                            my: 1, height: 2,
                            backgroundColor: "#000",
                        }} />
                        <Box display="flex" alignItems="center">
                            <Box>Hạng 2</Box>
                            <Box ml={2}>
                                <Typography>Nguyễn Văn B</Typography>
                                <Typography>0987654321</Typography>
                            </Box>
                            <Box ml={2}>4.000.000VND</Box>
                        </Box>
                    </Card>
                </Box>
            </Box>

        </Box>
    );
};

export default Home;
