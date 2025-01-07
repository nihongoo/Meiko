import React, { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import apiURL from '../../routes/API';
import useFetchData from '../../customHook/useFetchData';
import UpdateStaffDialog from './UpdateStaffDialog';
import CreateStaffDialog from './CreateStaffDialog';
import generateSerialCode from '../../customHook/useRandom';

function Account() {
  const [open, setOpen] = useState(false);
  const [create, setCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newStaff, setNewStaff] = useState({
    username: '',
    password: '',
    email: '',
    staffName: '',
    phoneNumber: '',
    dateJoin: new Date().toISOString(),
    address: ''
  });

  const { data: staff, refetch, loading, error } = useFetchData(
    apiURL.staff.all,
    data => data.map(item => ({
      ...item,
      dateJoin: moment(item.dateJoin).format('DD-MM-YYYY'),
      tt: item.status === 1 ? 'Đang hoạt động' : 'Không hoạt động'
    }))
  );

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
      renderCell: params => (
        <Button variant="contained" color="secondary" onClick={() => handleEdit(params.row)}>
          <i className="fa-solid fa-pen"></i>
        </Button>
      )
    }
  ];

  const handleEdit = user => {
    setSelectedUser({
      id: user.id,
      staffName: user.staffName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateJoin: user.dateJoin,
      status: user.status
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${apiURL.staff.edit}${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedUser,
          dateJoin: moment(selectedUser.dateJoin, 'DD-MM-YYYY').format('YYYY-MM-DD')
        })
      });

      if (response.ok) {
        toast.success('Sửa thành công');
        refetch();
      } else {
        throw new Error('Sửa thất bại');
      }
    } catch (error) {
      toast.error('Sửa thất bại');
      console.error(error);
    }
    setOpen(false);
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(apiURL.staff.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newStaff,
          staffCode: `NV${generateSerialCode()}`
        })
      });

      if (response.ok) {
        toast.success('Tạo thành công');
        refetch();
        setCreate(false);
      } else {
        const error = await response.json();
        toast.error(error[0].description);
      }
    } catch (error) {
      toast.error('Tạo thất bại');
      console.error(error);
    }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center"><CircularProgress /></div>;
  if (error) return <div className="d-flex justify-content-center align-items-center">Error: {error}</div>;

  return (
    <Box p={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" align="center" gutterBottom>Danh sách nhân viên</Typography>
      
      <Box display="flex" justifyContent="end" mb={2}>
        <Button variant="outlined" color="success" onClick={() => setCreate(true)}>
          Thêm mới +
        </Button>
      </Box>

      <DataGrid
        autoHeight
        rows={staff}
        columns={columns}
        initialState={{ pagination: { page: 0, pageSize: 10 } }}
        pageSizeOptions={[10,20]}
        disableRowSelectionOnClick
        rowHeight={80}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell, .MuiDataGrid-columnHeaders': { borderBottom: 'none' },
          backgroundColor: '#fff',
          minHeight: 550,
          maxHeight: 'calc(100vh - 200px)'
        }}
      />

      <UpdateStaffDialog
        open={open}
        onClose={() => setOpen(false)}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onUpdate={handleUpdate}
      />

      <CreateStaffDialog 
        open={create}
        onClose={() => setCreate(false)}
        newStaff={newStaff}
        setSelectedUser={setNewStaff}
        onCreate={handleCreate}
      />
    </Box>
  );
}

export default Account;