import React, { useState, useEffect } from 'react';
import moment from 'moment';
import SearchInput from "../../component/Search";
import apiURL from "../../routes/API/index";
import useFetchData from "../../customHook/useFetchData";
import UpdateDetailDialog from './UpdateDetailDialog';
import { DataGrid } from '@mui/x-data-grid';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function ListProductDetail() {
    const { id } = useParams();
    const [productName, setProductName] = useState('');
    const { data: initialData, refetch } = useFetchData(`${apiURL.productDetail.all}${id}`);
    const { data: previewImg, refetch: loadImg } = useFetchData(apiURL.image.base);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [apiImg, setApiImg] = useState('POST');

    const formattedRows = initialData.map((item) => ({
        id: item.id,
        name: productName,
        code: item.productDetailCode,
        color: item.colors.name,
        size: item.sizes.name,
        weight: item.weight,
        importPrice: item.importPrice,
        price: item.price,
        quantity: item.quantity,
        createTime: moment(item.createTime).format('DD-MM-YYYY'),
        status: item.status,
        tt: item.status === 1 ? 'Đang bán' : 'Ngừng bán'
    }));

    const columns = [
        { field: 'name', headerName: 'Tên sản phẩm', flex:1 },
        { field: 'code', headerName: 'Mã chi tiết', flex:1 },
        { field: 'color', headerName: 'Màu', flex:1 },
        { field: 'size', headerName: 'Kích thước', flex:1 },
        { field: 'weight', headerName: 'Cân nặng', flex:1 },
        { field: 'importPrice', headerName: 'Giá nhập', flex:1 },
        { field: 'price', headerName: 'Giá bán', flex:1 },
        { field: 'quantity', headerName: 'Số lượng', flex:1 },
        { field: 'createTime', headerName: 'Ngày tạo', flex:1 },
        { field: 'tt', headerName: 'Trạng thái', flex:1 },
        {
            field: 'action',
            headerName: 'Thao tác',
            width: 130,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleClickOpen(params.row)}
                    >
                        <i className="fa-solid fa-pen"></i>
                    </Button>
                </div>
            ),
        },
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    useEffect(() => {
        const fetchProductById = async () => {
            if (!id) return;

            try {
                const response = await fetch(`https://localhost:7172/api/Product/Get/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProductName(data.name);
                } else {
                    toast.error('Không thể tải thông tin sản phẩm');
                }
            } catch (error) {
                toast.error('Lỗi khi tải thông tin sản phẩm');
                console.error(error);
            }
        };

        fetchProductById();
    }, [id]);

    const handleClickOpen = (item) => {
        const formatUser = {
            id: item.id,
            weight: item.weight,
            importPrice: item.importPrice,
            price: item.price,
            quantity: item.quantity,
            status: item.status,
        };
        const findImg = previewImg.find(k => k.productDetailId === item.id);
        setApiImg(findImg ? 'PUT' : 'POST');
        setPreview(findImg ? findImg.imgUrl : 'https://res.cloudinary.com/dtsqxauba/image/upload/v1732854331/notfound_lgqmju_cyre8t.png');
        setSelectedUser(formatUser);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleUpdate = async () => {
        console.log("Selected User before update:", selectedUser); 

        try {
            const fileName = image.name.split('.').slice(0, -1).join('.');
            const imgInfo = {
                publicId: fileName,
                productDetailId: selectedUser.id
            };
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', 'datnMeiko');
            const r1 = await fetch(
                `https://api.cloudinary.com/v1_1/dtsqxauba/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const r2 = await fetch(apiURL.image.create, {
                method: apiImg,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(imgInfo),
            });

            console.log("Image update response:", r2);
            const response = await fetch(`${apiURL.productDetail.edit}${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser),  
            });

            console.log("Product update response:", response); 

            if (response.ok && r1.ok && r2.ok) {
                toast.success('Sửa thành công');
                refetch();
                loadImg();
            } else {
                toast.error('Sửa thất bại');
                throw new Error("Lỗi");
            }
        } catch (error) {
            toast.error('Sửa thất bại');
            console.error("Error during update:", error);
        }
        handleClose();
    };

    return (
        <Box p={3} bgcolor="#fff" borderRadius={2}>
            <Typography variant="h5" align="center" gutterBottom>Thông tin sản phẩm</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <SearchInput
                    ApiURL={apiURL.product.search}
                />
                <FormControl>
                    <FormLabel>Tìm kiếm theo:</FormLabel>
                    <RadioGroup
                        row
                    >
                        <FormControlLabel value="isSearchWithName=true" control={<Radio />} label="Tên sản phẩm" />
                        <FormControlLabel value="isSearchWithName=false" control={<Radio />} label="Mã sản phẩm" />
                    </RadioGroup>
                </FormControl>
            </Box>
            <DataGrid
                columns={columns}
                rows={formattedRows}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
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
            <UpdateDetailDialog
                open={open}
                selectedUser={selectedUser}
                onClose={handleClose}
                setSelectedUser={setSelectedUser}
                onUpdate={handleUpdate}
                setImage={setImage}
                preview={preview}
                setPreview={setPreview}
            />
        </Box>
    );
}
export default ListProductDetail;
