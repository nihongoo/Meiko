import React, { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { 
  Box, 
  Button, 
  FormControl, 
  FormControlLabel, 
  FormLabel, 
  Paper, 
  Radio, 
  RadioGroup, 
  Typography 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import apiURL from '../../Routes/API/index.js';
import SearchInput from '../../component/Search';
import useFetchData from '../../customHook/useFetchData';
import UpdateStaffDialog from './UpdateStaffDialog';
import CreateStaffDialog from './CreateStaffDialog';
import generateSerialCode from '../../customHook/useRandom';

function Account() {
  const { data: initialData, refetch } = useFetchData(apiURL.staff.all, (rawData) =>
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
  const [newStaff, setNewStaff] = useState({
    username: '',
    password: '',
    email: '',
    staffName: '',
    phoneNumber: '',
    dateJoin: new Date().toISOString(),
    address: '',
  });

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

  return (
    <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Danh sách nhân viên
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Button variant="contained" color="success" onClick={() => setCreate(true)}>
          Thêm mới +
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <SearchInput ApiURL={apiURL.staff.search} optional={searchType} />
          <FormControl component="fieldset">
            <FormLabel component="legend">Tìm kiếm theo:</FormLabel>
            <RadioGroup
              row
              value={searchType}
              onChange={handleSearchTypeChange}
            >
              <FormControlLabel
                value="isStaffCode=true"
                control={<Radio />}
                label="Mã nhân viên"
              />
              <FormControlLabel
                value="isStaffCode=false"
                control={<Radio />}
                label="Tên nhân viên"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box>
          <TableStaff rows={initialData} onEdit={handleClickOpen} />
        </Box>
      </Box>
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

function TableStaff({ rows, onEdit }) {
  const formattedRows = rows.map((item) => ({
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

export default Account;
