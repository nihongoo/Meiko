import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import SearchInput from '../../component/Search';
import apiURL from '../../routes/API/index.js';
import useFetchData from '../../customHook/useFetchData.js';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import EditDialog from '../../component/CRUD/EditDialog.js';
import CreateDialog from '../../component/CRUD/CreateDialog.js';

function ManageCategory() {
  const [create, setCreate] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState(null)
  const paginationModel = { page: 0, pageSize: 10 };
  const currentPage = 1;
  const { data: category, loading, error, refetch } = useFetchData(apiURL.category.all);

  const handleSearch = () => {
    refetch();
  };

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(apiURL.category.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem)
      })
      if (res.ok) {
        refetch()
        toast.success('Tạo mới thành công')
      } else {
        toast.error('Tạo mới thất bại');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra');
    }
  }

  const handleUpdate = async (updatedItem) => {
    try {
      const res = await fetch(`${apiURL.category.edit}${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
      console.log(res);

      if (res.ok) {
        refetch();
        toast.success('Cập nhật thành công');
      } else {
        toast.error('Cập nhật thất bại');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (data) => {
    try {
      const res = await fetch(`${apiURL.category.delete}${data.id}`, { method: 'DELETE' });
      if (res.ok) {
        refetch();
        toast.success('Xóa thành công');
      } else {
        toast.error('Xóa thất bại');
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <div className='d-flex justify-content-center align-items-center'><CircularProgress /></div>
  if (error) return <div className='d-flex justify-content-center align-items-center'>Error: {error}</div>;

  const columns = [
    { field: 'serialNumber', headerName: 'STT', width: 90 },
    { field: 'name', headerName: 'Tên', width: 150 },
    { field: 'status', headerName: 'Trạng thái', width: 150 },
    {
      field: 'action',
      headerName: 'Thao tác',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleOpen(params.row)}
          >
            <EditIcon />
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  // Prepare data with serial number
  const rows = category.map((item, index) => ({
    id: item.id,
    serialNumber: index + 1 + (currentPage - 1) * 5,
    name: item.name,
    status: item.status
  }));

  return (
    <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Danh sách loại sản phẩm
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <SearchInput ApiURL={apiURL.category.search} onSearch={handleSearch} />
        <Box>
          <Button variant="outlined" color="success" onClick={() => setCreate(true)}>
            + Thêm mới
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        pageSizeOptions={[10, 20]}
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
        loading={loading}
      />
      <EditDialog
        open={open}
        onClose={() => setOpen(false)}
        item={selectedItem}
        onUpdate={handleUpdate}
      />
      <CreateDialog
        open={create}
        onClose={() => { setCreate(false) }}
        setItem={setNewItem}
        onCreate={handleCreate}
      />
    </Box>
  );
}

export default ManageCategory;