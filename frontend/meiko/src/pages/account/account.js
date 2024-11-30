import apiURL from '../../routes/API/index.js';
import SearchInput from '../../component/Search';
import useFetchData from '../../customHook/useFetchData';
import { useState } from 'react';
import moment from 'moment';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Radio, Button, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import UpdateStaffDialog from './UpdateStaffDialog';
import CreateStaffDialog from './CreateStaffDialog'
import generateSerialCode from '../../customHook/useRandom'
import { toast } from 'react-toastify';

function Account() {
    const { data: initialData, refetch } = useFetchData(apiURL.staff.all, (rawData) =>
        rawData.map((item) => ({
            ...item,
            dateJoin: moment(item.dateJoin).format('DD-MM-YYYY'),
            status: item.status
        }))
    );

    const [open, setOpen] = useState(false);
    const [create, setCreate] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchType, setSearchType] = useState('isStaffCode=true');
    const [newStaff, setNewStaff] = useState({
        username: '',
        password: '',
        email: '',
        staffName: '',
        phoneNumber: '',
        dateJoin: new Date().toISOString(),
        address: ''
    })

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleClickOpen = (user) => {
        const formatUser = {
            id: user.id,
            staffName: user.staffName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            dateJoin: user.dateJoin,
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
            dateJoin: moment(selectedUser.dateJoin, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        };
        try {
            const response = await fetch(`${apiURL.staff.edit}${updatedUser.id}`, {
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

    const handleCreateStaff = async () =>{
        const random = generateSerialCode()
        const postStaff = {
            ...newStaff,
            staffCode: `NV${random}`,
        }
        console.log(postStaff);
        
        try {
            const res = await fetch(apiURL.staff.create, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postStaff)
            })
            if (res.ok) {
                toast.success('Tạo thành công');
                refetch()
                setCreate(false)
            } else {
                const msg = await res.json()
                toast.error(msg[0].description)
            }
        } catch (error) {
            toast.error('Tạo thất bại');
            console.log(error);
        }
    }
    return (
        <div className="border bg-light rounded-3">
            <div className='d-flex justify-content-center m-2'>
                <h2>Danh sách nhân viên</h2>
            </div>
            <div className='d-flex justify-content-end me-4'>
                <button
                    className='btn btn-outline-success'
                    onClick={() => { setCreate(true) }}
                >
                    Thêm mới +
                </button>
            </div>
            <div className='p-3'>
                <div className='d-flex mb-2 justify-content-between'>
                    <div className="d-flex align-items-center">
                        <SearchInput
                            ApiURL={apiURL.staff.search}
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
                            <FormControlLabel value="isStaffCode=true" control={<Radio />} label="Mã nhân viên" />
                            <FormControlLabel value="isStaffCode=false" control={<Radio />} label="Tên nhân viên" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <TableStaff rows={initialData} onEdit={handleClickOpen} />
                </div>
                <UpdateStaffDialog
                    open={open}
                    onClose={handleClose}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    onUpdate={handleUpdate}
                />
                <CreateStaffDialog
                    open={create}
                    onClose={() => { setCreate(false) }}
                    newStaff={newStaff}
                    setSelectedUser={setNewStaff}
                    onCreate={handleCreateStaff}
                />
            </div>
        </div>
    );
}

function TableStaff({ rows, onEdit }) {
    const formattedRows = rows.map((item) => ({
        ...item,
        tt: item.status === 1 ? 'Đang hoạt động' : 'Không hoạt động',
    }));
    const columns = [
        { field: 'staffName', headerName: 'Tên nhân viên', width: 130 },
        { field: 'staffCode', headerName: 'Mã nhân viên', width: 130 },
        { field: 'dateJoin', headerName: 'Ngày vào làm', width: 130 },
        { field: 'address', headerName: 'Địa chỉ', width: 130 },
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
                </div>
            )
        }
    ];
    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <div>
            <div className='mt-0'>
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
        </div>
    );
}

export default Account;