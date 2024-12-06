import React, { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import apiURL from '../../routes/API/index.js';
import SearchInput from '../../component/Search/index.js';
import useFetchData from '../../customHook/useFetchData.js';
import UpdateStaffDialog from './UpdateStaffDialog.js';
import CreateStaffDialog from './CreateStaffDialog.js';
import generateSerialCode from '../../customHook/useRandom.js';

function Account() {
  const { data: staff, refetch, loading, error } = useFetchData(apiURL.staff.all, (rawData) =>
    rawData.map((item) => ({
      ...item,
      dateJoin: moment(item.dateJoin).format('DD-MM-YYYY'),
      status: item.status,
    }))
  );

  const [open, setOpen] = useState(false);
  const [create, setCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchType, setSearchType] = useState('isStaffCode=true');
  const paginationModel = { page: 0, pageSize: 10 };
  const [newStaff, setNewStaff] = useState({
    username: '',
    password: '',
    email: '',
    staffName: '',
    phoneNumber: '',
    dateJoin: new Date().toISOString(),
    address: '',
  });
  const formattedRows = staff.map((item) => ({
    ...item,
    tt: item.status === 1 ? 'Đang hoạt động' : 'Không hoạt động',
  }));

  const columns = [
    { field: 'staffName', headerName: 'Tên nhân viên', flex: 1 },
    { field: 'staffCode', headerName: 'Mã nhân viên', flex: 1 },
    { field: 'dateJoin', headerName: 'Ngày vào làm', flex: 1 },
    { field: 'address', headerName: 'Địa chỉ', flex: 1 },
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
          onClick={() => handleClickOpen(params.row)}
        >
          <i className="fa-solid fa-pen"></i>
        </Button>
      ),
    },
  ];

  const handleClickOpen = (user) => {
    const formatUser = {
      id: user.id,
      staffName: user.staffName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateJoin: user.dateJoin,
      status: user.status,
    };
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
        refetch();
      } else {
        toast.error('Sửa thất bại');
        throw new Error('Lỗi');
      }
    } catch (error) {
      toast.error('Sửa thất bại');
      console.log(error);
    }
    handleClose();
  };

  const handleCreateStaff = async () => {
    const random = generateSerialCode();
    const postStaff = {
      ...newStaff,
      staffCode: `NV${random}`,
    };
    try {
      const res = await fetch(apiURL.staff.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postStaff),
      });
      if (res.ok) {
        toast.success('Tạo thành công');
        refetch();
        setCreate(false);
      } else {
        const msg = await res.json();
        toast.error(msg[0].description);
      }
    } catch (error) {
      toast.error('Tạo thất bại');
      console.log(error);
    }
  };
  if (loading) return <div className='d-flex justify-content-center align-items-center'><CircularProgress /></div>
  if (error) return <div className='d-flex justify-content-center align-items-center'>Error: {error}</div>;
  return (
    <Box p={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" align="center" gutterBottom>Danh sách nhân viên</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <SearchInput ApiURL={apiURL.staff.search} optional={searchType} />
        <FormControl>
          <FormLabel>Tìm kiếm theo:</FormLabel>
          <RadioGroup
            row
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <FormControlLabel value="isStaffCode=true" control={<Radio />} label="Mã nhân viên" />
            <FormControlLabel value="isStaffCode=false" control={<Radio />} label="Tên nhân viên" />
          </RadioGroup>
        </FormControl>
        <Button variant="outlined" color="success" onClick={() => setCreate(true)}>
          Thêm mới +
        </Button>
      </Box>

      <DataGrid
        autoHeight
        rows={formattedRows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10,20]}
        disableRowSelectionOnClick
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
      <UpdateStaffDialog
        open={open}
        onClose={handleClose}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onUpdate={handleUpdate}
      />
      <CreateStaffDialog
        open={create}
        onClose={() => setCreate(false)}
        newStaff={newStaff}
        setSelectedUser={setNewStaff}
        onCreate={handleCreateStaff}
      />
    </Box>
  );
}

export default Account;
