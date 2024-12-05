import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, CircularProgress, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import SearchInput from '../../component/Search';
import apiURL from '../../routes/API';
import useFetchData from '../../customHook/useFetchData';

function ManageProduct() {
    const [searchType, setSearchType] = useState('isSearchWithName=true');

    const formatProductData = (data) =>
        data.map((item, index) => ({
            id: item.id,
            stt: index + 1,
            name: item.name,
            productCode: item.productCode,
            createTime: moment(item.createTime).format('DD-MM-YYYY'),
            image: item.imageUrl,
            status: item.status === 1 ? 'Active' : 'Inactive',
        }));

    const {
        data: product,
        loading,
        error,
        refetch,
    } = useFetchData(apiURL.product.all, formatProductData);

    const handleSearch = () => refetch();

    if (loading) return <Box textAlign="center"><CircularProgress /></Box>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    const columns = [
        { field: 'stt', headerName: 'STT', flex: 0.5 },
        { field: 'name', headerName: 'Tên sản phẩm', flex: 1 },
        { field: 'productCode', headerName: 'Mã sản phẩm', flex: 1 },
        { field: 'createTime', headerName: 'Ngày thêm', flex: 1 },
        {
            field: 'image',
            headerName: 'Ảnh',
            flex: 1,
            renderCell: (params) => (
                <img src={params.value} alt="Product" style={{ width: '50px', height: '50px' }} />
            ),
        },
        { field: 'status', headerName: 'Trạng thái', flex: 1 },
    ];

    return (
        <Box p={3} bgcolor="#fff" borderRadius={2}>
            <Typography variant="h5" align="center" gutterBottom>Thông tin sản phẩm</Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <SearchInput
                    ApiURL={apiURL.product.search}
                    onSearch={handleSearch}
                    optional={searchType}
                />

                <FormControl>
                    <FormLabel>Tìm kiếm theo:</FormLabel>
                    <RadioGroup
                        row
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <FormControlLabel value="isSearchWithName=true" control={<Radio />} label="Tên sản phẩm" />
                        <FormControlLabel value="isSearchWithName=false" control={<Radio />} label="Mã sản phẩm" />
                    </RadioGroup>
                </FormControl>

                <Button
                    variant="outlined"
                    color="success"
                    component={Link}
                    to="/manageproduct/add"
                >
                    + Thêm mới
                </Button>
            </Box>

            <DataGrid
                autoHeight
                rows={product}
                columns={columns}
                pageSizeOptions={[5, 10, 15, 20]}
                pagination
                disableRowSelectionOnClick
                rowHeight={80} // Tăng chiều cao của mỗi hàng
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderBottom: 'none',
                    },
                    backgroundColor: '#fff',
                    minHeight: 550, // Đặt chiều cao tối thiểu
                    maxHeight: 'calc(100vh - 200px)', // Đặt chiều cao tối đa (nếu cần)
                }}
            />

        </Box>
    );
}

export default ManageProduct;
