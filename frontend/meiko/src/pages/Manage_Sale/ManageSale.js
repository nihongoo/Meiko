import React, { useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import apiURL from '../../routes/API';
import { toast } from 'react-toastify';
import useFetchData from '../../customHook/useFetchData';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';

function ManageDiscount() {
    const paginationModel = { page: 0, pageSize: 5 };
    const rows = [{
        id: 1,
        stt: 1,
        name: 'Sale giáng sinh bảnh vcl',
        value: '25%',
        status: 'Đang diễn ra',
        startDay: '7-12-2024',
        endDay: '26-12-2024'
    }]
    const columns = [
        { field: 'stt', headerName: 'Stt', flex: 1 },
        { field: 'name', headerName: 'Tên đợt giảm giá', flex: 1 },
        { field: 'value', headerName: 'Giá trị', flex: 1 },
        { field: 'status', headerName: 'Trạng thái', flex: 1 },
        { field: 'startDay', headerName: 'Ngày bắt đầu', flex: 1 },
        { field: 'endDay', headerName: 'Ngày kết thúc', flex: 1 },
        {
            field: 'action',
            headerName: 'Thao tác',
            width: 150,
            renderCell: (params) => (
                <Box>
                    {/* <Button variant='outlined' color='warning' sx={{ mr: 1 }}>
                        Sửa
                    </Button> */}
                    <Button variant='outlined' color='error'
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];
    return (
        <Box p={3} bgcolor="#fff" borderRadius={2}>
            <Box display='flex' justifyContent='center' mb={2}>
                <Typography variant='h5'>Đợt giảm giá</Typography>
            </Box>
            <Box display='flex' justifyContent='space-between' mb={2}>
                <Box display='flex'>
                    <TextField
                        type='date'
                        label='Từ ngày'
                        variant='outlined'
                        size='small'
                        sx={{ mr: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        type='date'
                        label='Đến ngày'
                        variant='outlined'
                        size='small'
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button>
                        <SearchIcon></SearchIcon>
                    </Button>
                </Box>
                <Button variant='outlined' color='success'>
                    Tạo mới +
                </Button>
            </Box>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSize={5}
                pageSizeOptions={[5, 10]}
                autoHeight
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
        </Box >
    );
}

export default ManageDiscount;