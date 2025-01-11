import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Info, Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import moment from 'moment';
import apiURL from '../../routes/API';
import useFetchData from '../../customHook/useFetchData';
import EditDialog from './EditDialog';

function ManageProduct() {
    const [edit, setEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const formatProductData = (data) => data.map((item, index) => ({
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

    const { data: product, loading, error, refetch } = useFetchData(apiURL.product.all, formatProductData);

    const handleImageUpload = async (image) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'datnMeiko');

        const response = await fetch('https://api.cloudinary.com/v1_1/dtsqxauba/image/upload', {
            method: 'POST',
            body: formData
        });

        return response.json();
    };

    const handleEdit = async () => {
        try {
            let imageData = { 
                url: selectedItem?.image, 
                publicId: selectedItem?.publicId 
            };

            if (image) {
                const uploadResult = await handleImageUpload(image);
                imageData = {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id
                };
            }

            const updatedItem = {
                ...selectedItem,
                image: imageData.url,
                publicId: imageData.publicId,
                createTime: '2024-12-09T14:32:29.546Z',
                status: selectedItem.status === 'Đang bán' ? 1 : 0,
                imageUrl: imageData.url,
            };

            const res = await fetch(`${apiURL.product.edit}${selectedItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            });

            if (res.ok) {
                refetch();
                setEdit(false);
                toast.success('Cập nhật thông tin sản phẩm thành công');
            }
        } catch (error) {
            toast.error('Cập nhật thất bại');
            console.error('Lỗi khi cập nhật:', error);
        }
    };

    const handleDelete = async (item) => {
        try {
            const res = await fetch(`${apiURL.product.delete}${item.id}`, { method: 'DELETE' });
            if (res.ok) {
                refetch();
                toast.success('Xóa thành công');
            } else {
                toast.error('Xóa thất bại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
            console.error(error);
        }
    };

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
            field: 'action',
            headerName: 'Thao tác',
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="secondary" component={Link} to={`/listproductdetail/${params.id}`}>
                        <Info />
                    </Button>
                    <Button variant="contained" onClick={() => setEdit(true) & setSelectedItem(params.row)}>
                        <Edit />
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(params.row)}>
                        <Delete />
                    </Button>
                </Box>
            )
        }
    ];

    if (loading) return <Box textAlign="center"><CircularProgress /></Box>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <Box p={3} bgcolor="#fff" borderRadius={2}>
            <Typography variant="h5" align="center" gutterBottom>Thông tin sản phẩm</Typography>

            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="outlined" color="success" component={Link} to="/manageproduct/add">
                    + Thêm mới
                </Button>
            </Box>

            <DataGrid
                autoHeight
                rows={product}
                columns={columns}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                pageSizeOptions={[10, 20]}
                disableRowSelectionOnClick
                rowHeight={80}
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': { borderBottom: 'none' },
                    '& .MuiDataGrid-columnHeaders': { borderBottom: 'none' },
                    backgroundColor: '#fff',
                    minHeight: 550,
                    maxHeight: 'calc(100vh - 200px)',
                }}
            />

            <EditDialog
                open={edit}
                onClose={() => setEdit(false)}
                item={selectedItem}
                setItem={setSelectedItem}
                preview={preview}
                setPreview={setPreview}
                setImage={setImage}
                onEdit={handleEdit}
            />
        </Box>
    );
}

export default ManageProduct;