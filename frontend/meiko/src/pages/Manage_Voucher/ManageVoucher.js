import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CreateVoucher from './CreateVoucher';
import apiURL from '../../routes/API';
import { toast } from 'react-toastify';
import useFetchData from '../../customHook/useFetchData';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';

function ManageVoucher() {
    const paginationModel = { page: 0, pageSize: 5 };
    const [create, setCreate] = useState(false)
    const [api, setApi] = useState(apiURL.voucher.all)
    const [filter, setFilter] = useState({
        startDate: "",
        endDate: ""
    })
    const { data: rows, refetch } = useFetchData(api, (r) => {
        return r.map((item) => ({
            ...item,
            isPublic: item.isPublic ? 'Công khai' : 'Cá nhân',
            startDay: moment(item.startDay).format('DD-MM-YYYY HH:mm'),
            endDay: moment(item.endDay).format('DD-MM-YYYY HH:mm'),
            status: item.status === 0 ? 'Đang diễn ra' : 'Đã kết thúc',
        }));
    });


    const [newVoucher, setNewVoucher] = useState({
        customerIds: [],
    });


    const columns = [
        { field: 'voucherCode', headerName: 'Mã', flex: 1 },
        { field: 'isPublic', headerName: 'Kiểu', flex: 1 },
        { field: 'value', headerName: 'Giá trị', flex: 1 },
        { field: 'quantity', headerName: 'Số lượng', flex: 1 },
        { field: 'startDay', headerName: 'Ngày bắt đầu', flex: 1 },
        { field: 'endDay', headerName: 'Ngày kết thúc', flex: 1 },
        { field: 'status', headerName: 'Trạng thái', flex: 1 },
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
                        onClick={() => { handleDelete(params.row) }}
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];
    const handleFilter = () => {
        const isDateValid = filter.startDate && filter.endDate;
        setApi(isDateValid ? `${apiURL.voucher.filter}?startDate=${filter.startDate}&endDate=${filter.endDate}` : apiURL.voucher.all);
        refetch();
    };
    
    const handleCreate = async () => {
        try {
            const res = await fetch(apiURL.voucher.create, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newVoucher)
            })
            if (res.ok) {
                refetch()
                toast.success('Tạo mới thành công')
            }
            else {
                const errorData = await res.json();
                if (errorData.errors) {
                    const firstErrorKey = Object.keys(errorData.errors)[0];
                    const firstErrorMessage = errorData.errors[firstErrorKey][0];
                    if (firstErrorMessage) {
                        toast.error(`${firstErrorMessage}`);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleSetApi = () =>{
        if (filter.startDate === null || filter.endDate === null) {
            setApi(apiURL.voucher.all)
            refetch()
        }
    }
    const handleDelete = async (item) => {
        try {
            const res = await fetch(`${apiURL.voucher.delete}${item.id}`, { method: 'DELETE' })
            if (res.ok) {
                refetch()
                toast.success('Xóa thành công')
            }
            else {
                const errorData = await res.json();
                if (errorData.errors) {
                    const firstErrorKey = Object.keys(errorData.errors)[0];
                    const firstErrorMessage = errorData.errors[firstErrorKey][0];
                    if (firstErrorMessage) {
                        toast.error(`${firstErrorMessage}`);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box p={3} bgcolor="#fff" borderRadius={2}>
            <Box display='flex' justifyContent='center' mb={2}>
                <Typography variant='h5'>Phiếu giảm giá</Typography>
            </Box>
            <Box display='flex' justifyContent='space-between' mb={2}>
                <Box display='flex'>
                    <TextField
                        type='date'
                        label='Từ ngày'
                        variant='outlined'
                        size='small'
                        sx={{ mr: 2 }}
                        onChange={(e) => {
                        setFilter({ ...filter, startDate: e.target.value })
                        handleSetApi()
                        }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        type='date'
                        label='Đến ngày'
                        variant='outlined'
                        size='small'
                        onChange={(e) =>{
                         setFilter({ ...filter, endDate: e.target.value })
                         handleSetApi()
                         }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button onClick={() => { handleFilter() }}>
                        <SearchIcon></SearchIcon>
                    </Button>
                </Box>
                <Button variant='outlined' color='success' onClick={() => { setCreate(true) }}>
                    Tạo mới +
                </Button>
            </Box>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                pageSizeOptions={[5, 10]}
                autoHeight
                disableSelectionOnClick
                initialState={{ pagination: { paginationModel } }}
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
            <CreateVoucher
                open={create}
                onClose={() => { setCreate(false) }}
                item={newVoucher}
                setItem={setNewVoucher}
                onCreate={handleCreate}
            />
        </Box >
    );
}

export default ManageVoucher;
