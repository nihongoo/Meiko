import React, { useState, useEffect } from 'react';
import moment from 'moment';
import apiURL from "../../routes/API/index";
import useFetchData from "../../customHook/useFetchData";
import UpdateDetailDialog from './UpdateDetailDialog';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography } from '@mui/material';
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
    const [updateImg, setUpdateImg] = useState(null)
    const formattedRows = initialData.map((item) => {
        const productImage = previewImg.find(img => img.productDetailId === item.id);
        return {
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
            tt: item.status === 1 ? 'Đang bán' : 'Ngừng bán',
            imgUrl: productImage?.imgUrl || 'https://res.cloudinary.com/dtsqxauba/image/upload/v1732854331/notfound_lgqmju_cyre8t.png'
        }
    });
    
    console.log(initialData);
    

    const columns = [
        { field: 'name', headerName: 'Tên sản phẩm', flex:1 },
        { field: 'code', headerName: 'Mã chi tiết', flex:1 },
        {
            field: 'imgUrl',
            headerName: 'Ảnh',
            width: 100,
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt="Product"
                    style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                    }}
                />
            ),
        },
        { field: 'color', headerName: 'Màu', flex:1 },
        { field: 'size', headerName: 'Kích thước', flex:1 },
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
        setUpdateImg(findImg ? findImg.imgUrl : 'https://res.cloudinary.com/dtsqxauba/image/upload/v1732854331/notfound_lgqmju_cyre8t.png');
        setSelectedUser(formatUser);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleUpdate = async () => {
        try {
            if (!selectedUser) {
                toast.error("Không có dữ liệu để cập nhật");
                return;
            }
    
            // Kiểm tra nếu có hình ảnh được chọn
            let uploadImageResponse;
            if (image) {
                //const fileName = image.name.split('.').slice(0, -1).join('.');
                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', 'datnMeiko');
    
                // Upload ảnh lên Cloudinary
                const response = await fetch('https://api.cloudinary.com/v1_1/dtsqxauba/image/upload', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!response.ok) {
                    toast.error("Tải ảnh lên thất bại");
                    throw new Error("Upload image failed");
                }
    
                const responseData = await response.json();
                uploadImageResponse = {
                    publicId: responseData.public_id,
                    productDetailId: selectedUser.id,
                };
    
                // Gửi dữ liệu hình ảnh lên server
                if(apiImg === 'POST'){
                    const apiResponse = await fetch(apiURL.image.create, {
                        method: apiImg,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(uploadImageResponse),
                    });    
                    
                    if (!apiResponse.ok) {
                        toast.error("Cập nhật hình ảnh thất bại");
                        console.log(apiResponse);
                        
                        throw new Error("Image API call failed");
                    }
                    URL.revokeObjectURL(preview);
                    setPreview(null)
                }
                else if(apiImg === 'PUT'){
                    const apiResponse = await fetch(apiURL.image.base, {
                        method: apiImg,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(uploadImageResponse),
                    });    
                    
                    if (!apiResponse.ok) {
                        toast.error("Cập nhật hình ảnh thất bại");
                        console.log(apiResponse);
                        
                        throw new Error("Image API call failed");
                    }
                    URL.revokeObjectURL(preview);
                    setPreview(null)
                }
            }
    
            // Cập nhật dữ liệu sản phẩm chi tiết
            const updateResponse = await fetch(`${apiURL.productDetail.edit}${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser),
            });
    
            if (!updateResponse.ok) {
                toast.error("Cập nhật sản phẩm chi tiết thất bại");
                throw new Error("Product detail update failed");
            }
    
            // Thành công
            toast.success("Cập nhật thành công");
            refetch();
            loadImg();
        } catch (error) {
            console.error("Error during update:", error);
            toast.error("Có lỗi xảy ra khi cập nhật");
        } finally {
            handleClose();
        }
    };
    
    return (
        <Box p={3} bgcolor="#fff" borderRadius={2}>
            <Typography variant="h5" align="center" gutterBottom>Thông tin sản phẩm</Typography>
            {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
            </Box> */}
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
                image={updateImg}
            />
        </Box>
    );
}
export default ListProductDetail;
