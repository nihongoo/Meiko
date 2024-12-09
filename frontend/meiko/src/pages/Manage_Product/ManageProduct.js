import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, CircularProgress, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import SearchInput from '../../component/Search';
import apiURL from '../../routes/API';
import useFetchData from '../../customHook/useFetchData';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditDialog from './EditDialog';
import { toast } from 'react-toastify';

function ManageProduct() {
    const [searchType, setSearchType] = useState('isSearchWithName=true');
    const [edit, setEdit] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const paginationModel = { page: 0, pageSize: 10 };
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const formatProductData = (data) =>
        data.map((item, index) => ({
            id: item.id,
            stt: index + 1,
            name: item.name,
            productCode: item.productCode,
            createTime: moment(item.createTime).format('DD-MM-YYYY'),
            image: item.imageUrl,
            status: item.status === 1 ? 'Đang bán' : 'Ngừng bán',
            description: item.description,
            publicId: item.publicId,
        }));

    const handleEdit = async () => {
        try {
            let imageUrl = selectedItem?.image;
            let publicId = selectedItem?.publicId;
            if (image) {
                const fileName = image.name.split('.').slice(0, -1).join('.');
                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', 'datnMeiko');

                const response = await fetch(`https://api.cloudinary.com/v1_1/dtsqxauba/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                imageUrl = data.secure_url;
                publicId = data.public_id;
            }

            const updatedItem = {
                ...selectedItem,
                image: imageUrl,
                publicId: publicId,
                createTime: '2024-12-09T14:32:29.546Z',
                status: 'Đang bán' ? 1 : 0,
                imageUrl: imageUrl,
            };

            const res = await fetch(`${apiURL.product.edit}${selectedItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem),
            });

            if (res.ok) {
                toast.success('Cập nhật thông tin sản phẩm thành công')
                refetch(); // Cập nhật lại danh sách sản phẩm
            } else {
                throw new Error('Cập nhật thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
        }
    };
const handleDelete = async (item) =>{
    try {
        const res = await fetch(`${apiURL.product.delete}${item.id}`, { method: 'DELETE' });
        if (res.ok) {
          refetch();
          toast.success('Xóa thành công');
        } else {
          toast.error('Xóa thất bại');
        }
      } catch (error) {
        console.error(error);
        toast.error('Có lỗi xảy ra');
      }
}

    const {
        data: product,
        loading,
        error,
        refetch,
    } = useFetchData(apiURL.product.all, formatProductData);

    const handleOpen = (item) => {
        setSelectedItem(item)
        setEdit(true)
    }

    const handleSearch = () => refetch();

    if (loading) return <Box textAlign="center"><CircularProgress /></Box>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    const columns = [
        { field: 'stt', headerName: 'STT', flex: 0.5 },
        {
            field: 'image',
            headerName: 'Ảnh',
            flex: 1,
            renderCell: (params) => (
                <img src={params.value} alt="Product" style={{ width: '50px', height: '50px' }} />
            ),
        },
        { field: 'name', headerName: 'Tên sản phẩm', flex: 1 },
        { field: 'productCode', headerName: 'Mã sản phẩm', flex: 1 },
        { field: 'createTime', headerName: 'Ngày thêm', flex: 1 },

        { field: 'status', headerName: 'Trạng thái', flex: 1 },
        {
            field: 'action', headerName: 'Thao tác', flex: 1,
            renderCell: (params) => (
                <Box>

                    <Button
                        variant="contained"
                        color="secondary"
                        to={`/listproductdetail/${params.id}`}
                        component={Link}
                    >
                        <InfoIcon />
                    </Button>
                    <Button variant='contained' onClick={() => { handleOpen(params.row) }}>
                        <EditIcon></EditIcon>
                    </Button>
                    <Button variant='contained' color='error' onClick={() => { handleDelete(params.row) }}>
                        <DeleteIcon></DeleteIcon>
                    </Button>
                </Box>
            )
        }
    ];

    return (
        <Box p={3} bgcolor="#fff" borderRadius={2}>
            <Typography variant="h5" align="center" gutterBottom>Thông tin sản phẩm</Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <SearchInput
                    ApiURL={apiURL.product.search}
                    onSearch={handleSearch}
                    optional={searchType}
                />

                <FormControl>
                    <FormLabel>Tìm kiếm theo:</FormLabel>
                    <RadioGroup
                        row
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <FormControlLabel value="isSearchWithName=true" control={<Radio />} label="Tên sản phẩm" />
                        <FormControlLabel value="isSearchWithName=false" control={<Radio />} label="Mã sản phẩm" />
                    </RadioGroup>
                </FormControl>

                <Button
                    variant="outlined"
                    color="success"
                    component={Link}
                    to="/manageproduct/add"
                >
                    + Thêm mới
                </Button>
            </Box>

            <DataGrid
                autoHeight
                rows={product}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[10, 20]}
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
                    minHeight: 550, // Đặt chiều cao tối thiểu
                    maxHeight: 'calc(100vh - 200px)', // Đặt chiều cao tối đa (nếu cần)
                }}
            />
            <EditDialog
                open={edit}
                onClose={() => { setEdit(false) }}
                item={selectedItem}
                setItem={setSelectedItem}
                preview={preview}
                setPreview={setPreview}
                setImage={setImage}
                onEdit={handleEdit}
            >

            </EditDialog>
        </Box>
    );
}

export default ManageProduct;
