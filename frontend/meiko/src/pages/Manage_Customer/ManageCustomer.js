import React, { useState } from 'react';
import moment from 'moment';
import SearchInput from "../../component/Search";
import apiURL from '../../routes/API/index';
import useFetchData from "../../customHook/useFetchData";
import { DataGrid } from '@mui/x-data-grid';
import {
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Button,
    Box,
    Typography,
} from '@mui/material';
import UpdateUserDialog from './UpdateUserDialog';
import { toast } from 'react-toastify';

function ManageCustomer() {
    const { data: initialData, refetch } = useFetchData(apiURL.user.all, (rawData) =>
        rawData.map((item) => ({
            ...item,
            birthDay: moment(item.birthDay).format('DD-MM-YYYY'),
            status: item.status
        }))
    );

    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchType, setSearchType] = useState('isSearchEmail=true');

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleClickOpen = (user) => {
        const formatUser = {
            id: user.id,
            name: user.name,
            sex: user.sex,
            birthDay: user.birthDay,
            phoneNumber: user.phoneNumber,
            email: user.email,
            status: user.status
        }
        setSelectedUser(formatUser);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleUpdate = async () => {
        const updatedUser = {
            ...selectedUser,
            birthDay: moment(selectedUser.birthDay, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        };
        try {
            const response = await fetch(`${apiURL.user.edit}${updatedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });
            if (response.ok) {
                toast.success('Sửa thành công');
                refetch()
            } else {
                toast.error('Sửa thất bại');
                throw new Error("Lỗi");
            }
        } catch (error) {
            toast.error('Sửa thất bại');
            console.log(error);
        }
        handleClose();
    };

    return (
        <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                    Danh sách khách hàng
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <SearchInput ApiURL={apiURL.user.search} optional={searchType} />
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Tìm kiếm theo:</FormLabel>
                        <RadioGroup
                            row
                            value={searchType}
                            onChange={handleSearchTypeChange}
                        >
                            <FormControlLabel
                                value="isSearchEmail=false"
                                control={<Radio />}
                                label="Số điện thoại"
                            />
                            <FormControlLabel
                                value="isSearchEmail=true"
                                control={<Radio />}
                                label="Email"
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>

                <TableUser rows={initialData} onEdit={handleClickOpen} />
            </Box>

            <UpdateUserDialog
                open={open}
                onClose={handleClose}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                onUpdate={handleUpdate}
            />
        </Box>
    );
}

function TableUser({ rows, onEdit }) {
    const formattedRows = rows.map((item) => ({
        ...item,
        gt: item.sex ? 'Nam' : 'Nữ',
        tt: item.status === 1 ? 'Đang hoạt động' : 'Không hoạt động',
    }));

    const columns = [
        { field: 'name', headerName: 'Tên', flex: 1 },
        { field: 'gt', headerName: 'Giới tính', flex: 1 },
        { field: 'phoneNumber', headerName: 'Số điện thoại', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'tt', headerName: 'Trạng thái', flex: 1 },
        {
            field: 'action',
            headerName: 'Thao tác',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => onEdit(params.row)}
                >
                    <i className="fa-solid fa-pen"></i>
                </Button>
            ),
        },
    ];

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <DataGrid
                autoHeight
                rows={formattedRows}
                columns={columns}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
            />
        </Paper>
    );
}

export default ManageCustomer;
