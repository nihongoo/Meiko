import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, InputAdornment } from '@mui/material';
import { useState, useEffect } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';

const UpdateDialog = ({ item, open, onClose, onUpdate }) => {
    const [selectedItem, setSelectedItem] = useState(item);
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        // Reset states when item changes
        if (item) {
            setSelectedItem(item);
            setPreview(null);
            setImage(null);
        }
    }, [item]);

    useEffect(() => {
        // Cleanup preview URL
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleChange = e => {
        const { name, value } = e.target;
        // Convert string value to number for numeric fields
        const numericValue = value.replace(/[^\d]/g, '');
        setSelectedItem(prev => ({
            ...prev,
            [name]: numericValue
        }));
    };

    const formatCurrency = (value) => {
        return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setImage(file);
        }
    };

    const handleSubmit = async () => {
        try {
            let imageUrl = selectedItem.imgUrl;
            let publicId = selectedItem.publicId;

            // Upload image to Cloudinary if new image is selected
            if (image) {
                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', 'datnMeiko');

                const response = await fetch('https://api.cloudinary.com/v1_1/dtsqxauba/image/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const data = await response.json();
                imageUrl = data.secure_url;
                publicId = data.public_id;
            }

            // Update item with new data including image info
            const updatedItem = {
                ...selectedItem,
                imgUrl: imageUrl,
                publicId: publicId,
                importPrice: Number(selectedItem.importPrice),
                price: Number(selectedItem.price),
                quantity: Number(selectedItem.quantity)
            };

            onUpdate(updatedItem);
            handleClose();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Có lỗi xảy ra khi tải ảnh lên');
        }
    };

    const handleClose = () => {
        setSelectedItem(null);
        setPreview(null);
        setImage(null);
        onClose();
    };

    const textFields = [
        { label: 'Số lượng', name: 'quantity', defaultValue: 1, type: 'number' },
        { label: 'Giá nhập', name: 'importPrice', defaultValue: 0, adornment: 'VND', type: 'text' },
        { label: 'Giá bán', name: 'price', defaultValue: 0, adornment: 'VND', type: 'text' }
    ];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Cập nhật sản phẩm</DialogTitle>
            <DialogContent>
                <Box display="flex" gap={2}>
                    <Box flex={2}>
                        {textFields.map(field => (
                            <TextField
                                key={field.name}
                                margin="dense"
                                label={field.label}
                                type={field.type}
                                fullWidth
                                value={
                                    field.type === 'text' 
                                        ? formatCurrency(selectedItem?.[field.name] || field.defaultValue)
                                        : selectedItem?.[field.name] || field.defaultValue
                                }
                                name={field.name}
                                onChange={handleChange}
                                InputProps={field.adornment ? {
                                    endAdornment: <InputAdornment position="start">{field.adornment}</InputAdornment>
                                } : {}}
                            />
                        ))}
                    </Box>
                    <Box flex={1} display="flex" flexDirection="column" alignItems="center">
                        <Box 
                            component="img"
                            sx={{
                                height: 200,
                                width: 200,
                                objectFit: 'cover',
                                mb: 2
                            }}
                            src={preview || selectedItem?.imgUrl || 'https://res.cloudinary.com/dtsqxauba/image/upload/v1732854331/notfound_lgqmju_cyre8t.png'}
                            alt="Preview"
                        />
                        <Button
                            variant="contained"
                            component="label"
                        >
                            Chọn ảnh
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleSubmit}>Cập nhật</Button>
            </DialogActions>
        </Dialog>
    );
};

const ProductDetail = ({ size, nameProduct, productDetails, color, onDelete, onUpdate }) => {
    const [updt, setupdt] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const rows = productDetails.map(product => ({
        ...product,
        size: size.find(c => c.id === product.sizeId)?.name || 'N/A',
    }));

    if (!rows?.length) return null;

    const columns = [
        { field: 'name', headerName: 'Sản phẩm', flex: 1, valueGetter: () => nameProduct },
        { field: 'size', headerName: 'Kích cỡ', flex: 1 },
        {
            field: 'imgUrl', headerName: 'Ảnh', type: 'number', flex: 1,
            renderCell: (params) => (
                <img src={params.value} alt="Product" style={{ width: '50px', height: '50px' }} />
            ),
        },
        { field: 'quantity', headerName: 'Số lượng', type: 'number', flex: 1, editable: true },
        { field: 'importPrice', headerName: 'Giá nhập', type: 'number', flex: 1, editable: true },
        { field: 'price', headerName: 'Giá bán', type: 'number', flex: 1, editable: true },
        {
            field: 'delete',
            headerName: 'Hành động',
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="primary" onClick={() => { setSelectedItem(params.row); setupdt(true); }}>
                        <Edit />
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => onDelete(params.row.id)}>
                        <Delete />
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <div className="border mt-4 bg-light rounded-3">
            <UpdateDialog open={updt} item={selectedItem} onClose={() => setupdt(false)} onUpdate={onUpdate} />
            <div className='d-flex align-items-center ms-4 mt-2'>
                <p className='m-2'>Danh sách sản phẩm màu:</p>
                <p className='p-0 m-0' style={{ color: color.hex }}>{color.name}</p>
            </div>
            <div className='m-4 mt-0'>
                <DataGrid
                    columns={columns}
                    rows={rows}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                    pageSizeOptions={[5, 10]}
                    processRowUpdate={row => onUpdate(row)}
                    onProcessRowUpdateError={console.log}
                    disableRowSelectionOnClick
                    rowHeight={80}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell': { borderBottom: 'none' },
                        '& .MuiDataGrid-columnHeaders': { borderBottom: 'none' },
                        backgroundColor: '#fff',
                        minHeight: 350,
                        maxHeight: 'calc(100vh - 200px)',
                    }}
                />
            </div>
        </div>
    );
};

export default ProductDetail;
