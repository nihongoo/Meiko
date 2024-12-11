import React, { useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import apiURL from '../../routes/API';
import { toast } from 'react-toastify';
import useFetchData from '../../customHook/useFetchData';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import CreateSaleDialog from './CreateSaleDialog';

function ManageDiscount() {
    const paginationModel = { page: 0, pageSize: 5 };
    const [add, setAdd] = useState(false)
    const [api, setApi] = useState(apiURL.sale.all)
    const [filter, setFilter] = useState({
        startDate: "",
        endDate: ""
    })
    const [newSale, setNewSale] = useState({
        selectedProductDetailIds: [],
    })
    const { data: sale, refetch, loading, error } = useFetchData(api, (r) =>
        r.map((item, index) => ({
            ...item,
            stt: index + 1,
            startDay: moment(item.startDay).format('DD-MM-YYYY HH:mm'),
            endDay: moment(item.endDay).format('DD-MM-YYYY HH:mm'),
            status: item.status === 0 ? 'Đang diên ra':'Đã kết thúc'
    })))
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
                    onClick={()=>{handleDelete(params.row)}}
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];
    const handleFilter = () => {
        const isDateValid = filter.startDate && filter.endDate;
        setApi(isDateValid ? `${apiURL.sale.filter}?startDate=${filter.startDate}&endDate=${filter.endDate}` : apiURL.sale.all);
        refetch();
    };
    const handleSetApi = () =>{
        if (filter.startDate === null || filter.endDate === null) {
            setApi(apiURL.sale.all)
            refetch()
        }
    }

    const handleDelete = async (item) => {
        try {
            const res = await fetch(`${apiURL.sale.delete}${item.id}`, { method: 'DELETE' })
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
    const handleCreate = async () => {
        try {
            const res = await fetch(apiURL.sale.create, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSale)
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

    if (loading) return <div className='d-flex justify-content-center align-items-center'><CircularProgress /></div>
    if (error) return <div className='d-flex justify-content-center align-items-center'>Error: {error}</div>;  

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
                        onChange={(e) => {
                            setFilter({ ...filter, startDate: e.target.value })
                            handleSetApi()
                            }}
                        sx={{ mr: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        type='date'
                        label='Đến ngày'
                        variant='outlined'
                        onChange={(e) =>{
                            setFilter({ ...filter, endDate: e.target.value })
                            handleSetApi()
                            }}
                        size='small'
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button onClick={() => { handleFilter() }}>
                        <SearchIcon></SearchIcon>
                    </Button>
                </Box>
                <Button variant='outlined' color='success' onClick={() => { setAdd(true) }}>
                    Tạo mới +
                </Button>
            </Box>
            <DataGrid
                rows={sale}
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
            <CreateSaleDialog
                open={add}
                onClose={() => { setAdd(false) }}
                item={newSale}
                setItem={setNewSale}
                onCreate={handleCreate}
            ></CreateSaleDialog>
        </Box >
    );
}

export default ManageDiscount;