import React, { useState } from "react";
import {
    Dialog,
    TextField,
    Slider,
    Box,
    Typography,
    IconButton,
    Grid,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from '@mui/x-data-grid';
import ChooseDetail from "./ChooseDetail";
import useFetchData from '../../customHook/useFetchData';
import apiURL from "../../routes/API";

function ChooseProduct({ open, onClose, reloadList, bill }) {
    const paginationModel = { page: 0, pageSize: 5 };
    const [detail, setDetail] = useState(false);
    const [item, setItem] = useState({});
    const { data: Data } = useFetchData(apiURL.productDetail.soldOff, (r) => {
        return r
            .filter(item => item.status === 1)
            .map((item) => ({
                ...item,
                priceFM: new Intl.NumberFormat('vi-VN').format(item.price) + ' VND',
            }));
    }
    );
    console.log(Data);

    // State cho tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([0, 50000000]);

    // Hàm lọc sản phẩm
    const filteredData = Data.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesPrice;
    });

    // Cột cho DataGrid
    const columns = [
        {
            field: 'imgUrl',
            headerName: 'Ảnh',
            width: 120,
            renderCell: (params) => (
                <Box
                    component="img"
                    src={params.value}
                    alt="product"
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                    }}
                />
            ),
        },
        { field: 'name', headerName: 'Tên', flex: 1 },
        { field: 'code', headerName: 'Mã', flex: 1 },
        { field: 'category', headerName: 'Loại', flex: 1 },
        { field: 'brand', headerName: 'Thương hiệu', flex: 1 },
        { field: 'material', headerName: 'Chất liệu', flex: 1 },
        { field: 'target', headerName: 'Đối tượng', flex: 1 },
        { field: 'size', headerName: 'Size', flex: 1},
        { field: 'color', headerName: 'Màu', flex: 1 },
        {
            field: 'priceFM',
            headerName: 'Giá',
            flex: 1,
        },
        {
            field: 'action',
            headerName: 'Thao tác',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="info"
                    onClick={() => {
                        setDetail(true);
                        setItem(params.row);
                    }}
                >
                    Chọn
                </Button>
            ),
        },
    ];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <Box padding={2} >
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                        Tìm kiếm sản phẩm
                    </Typography>
                    <IconButton color="error" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Search and Slider */}
                <Grid container spacing={2} mb={1} justifyContent="space-between">
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            placeholder="Tìm kiếm theo tên hoặc mã sản phẩm chi tiết"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3} className="me-5">
                        <Typography gutterBottom>Khoảng giá:</Typography>
                        <Slider
                            value={priceRange}
                            onChange={(e, newValue) => setPriceRange(newValue)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value.toLocaleString()} VND`}
                            min={0}
                            max={50000000}
                            step={500000}
                            marks
                        />
                    </Grid>
                </Grid>

                {/* DataGrid */}
                <Box sx={{ height: 510, width: '100%' }}>
                    <DataGrid
                        rows={filteredData}
                        columns={columns}
                        getRowId={(row) => row.id}
                        initialState={{ pagination: { paginationModel } }}
                        pageSize={5}
                        pageSizeOptions={[5, 10]}
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
                            minHeight: 200,
                            maxHeight: 'calc(100vh - 200px)',
                        }}
                    />
                </Box>

                {/* Dialog chọn chi tiết */}
                <ChooseDetail
                    open={detail}
                    onClose={() => setDetail(false)}
                    item={item}
                    reloadList={reloadList}
                    bill={bill}
                />
            </Box>
        </Dialog>
    );
}

export default ChooseProduct;