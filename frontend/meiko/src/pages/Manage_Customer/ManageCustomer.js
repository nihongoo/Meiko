import React, { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import apiURL from '../../routes/API/index.js';
import useFetchData from '../../customHook/useFetchData.js';
import UpdateUserDialog from './UpdateUserDialog.js';
import EditIcon from '@mui/icons-material/Edit';
function ManageCustomer() {
  const { data: customers, refetch, loading, error } = useFetchData(apiURL.user.all, (rawData) =>
    rawData.map((item) => ({
      ...item,
      birthDay: moment(item.birthDay).format('DD-MM-YYYY'),
      status: item.status,
    }))
  );

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const paginationModel = { page: 0, pageSize: 10 };

  const handleClickOpen = (user) => {
    const formattedUser = {
      id: user.id,
      name: user.name,
      sex: user.sex,
      birthDay: user.birthDay,
      phoneNumber: user.phoneNumber,
      email: user.email,
      status: user.status,
    };
    setSelectedUser(formattedUser);
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
        refetch();
      } else {
        toast.error('Sửa thất bại');
        throw new Error('Lỗi');
      }
    } catch (error) {
      toast.error('Sửa thất bại');
      console.error(error);
    }
    handleClose();
  };

  if (loading) return <div className='d-flex justify-content-center align-items-center'><CircularProgress /></div>
  if (error) return <div className='d-flex justify-content-center align-items-center'>Error: {error}</div>;

  return (
    <Box p={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" align="center" gutterBottom>
        Danh sách khách hàng
      </Typography>
      

      <DataGrid
        autoHeight
        rows={customers.map((item) => ({
          ...item,
          gt: item.sex ? 'Nam' : 'Nữ',
          tt: item.status === 1 ? 'Đang hoạt động' : 'Không hoạt động',
        }))}
        columns={[
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
                onClick={() => handleClickOpen(params.row)}
              >
                <EditIcon></EditIcon>
              </Button>
            ),
          },
        ]}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10,20]}
        rowHeight={80}
        disableRowSelectionOnClick
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

export default ManageCustomer;
