import React, { useState } from 'react';
import moment from 'moment';
import SearchInput from "../../component/Search";
import apiURL from '../../Routes/API/index';
import useFetchData from "../../customHook/useFetchData";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button} from '@mui/material';
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
        <div className="border bg-light rounded-3">
            <div className='d-flex justify-content-center m-2'>
                <h2>Danh sách khách hàng</h2>
            </div>
            <div className='p-3'>
                <div className='d-flex mb-2 justify-content-between'>
                    <div className="d-flex align-items-center">
                        <SearchInput
                            ApiURL={apiURL.user.search}
                            optional={searchType}
                            
                        />
                    </div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" className="m-0">Tìm kiếm theo:</FormLabel>
                        <RadioGroup
                            row
                            value={searchType}
                            onChange={handleSearchTypeChange}
                        >
                            <FormControlLabel value="isSearchEmail=false" control={<Radio />} label="Số điện thoại" />
                            <FormControlLabel value="isSearchEmail=true" control={<Radio />} label="Email" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <TableUser rows={initialData} onEdit={handleClickOpen} />
            </div>
            <UpdateUserDialog 
                open={open} 
                onClose={handleClose} 
                selectedUser={selectedUser} 
                setSelectedUser={setSelectedUser} 
                onUpdate={handleUpdate} 
            />
        </div>
    );
}

function TableUser({ rows, onEdit }) {
    const formattedRows = rows.map((item) => ({
        ...item,
        gt: item.sex ? 'Nam': 'Nữ',
        tt: item.status === 1 ? 'Đang hoạt động' : 'Không hoạt động',
    }));
    const columns = [
        { field: 'name', headerName: 'Tên', width: 130 },
        { field: 'gt', headerName: 'Giới tính', width: 130 },
        { field: 'birthDay', headerName: 'Ngày sinh', width: 130 },
        { field: 'phoneNumber', headerName: 'Số điện thoại', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'tt', headerName: 'Trạng thái', width: 130 },
        {
            field: 'action',
            headerName: 'Thao tác',
            width: 150,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => onEdit(params.row)}
                    >
                       <i className="fa-solid fa-pen"></i>
                    </Button>
                    {/* <Button
                        className='ms-1'
                        variant="contained"
                        color="secondary"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </Button> */}
                </div>
            ),
        },
    ];
    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <div>
            <Paper sx={{ minWidth: '705px', width: 'auto', maxWidth: '1558px' }}>
                <DataGrid
                    columns={columns}
                    rows={formattedRows}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    disableRowSelectionOnClick
                />
            </Paper>
        </div>
    );
}

export default ManageCustomer;