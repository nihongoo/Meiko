import React, { useEffect, useState } from 'react';
import moment from 'moment';
import SearchInput from "../../component/Search";
import apiURL from "../../Routes/API";
import useFetchData from "../../customHook/useFetchData";
import UpdateDetailDialog from './UpdateDetailDialog';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function ListProductDetail() {
    const { id } = useParams()
    const { data: initialData, refetch } = useFetchData(`${apiURL.productDetail.all}${id}`)
    const { data: previewImg, refetch: loadImg } = useFetchData(apiURL.image.base)
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [apiImg, setApiImg] = useState('POST')
    const [product, setProduct] = useState({})
    const handleFetchProduct = async () => {
        const res = await fetch(`${apiURL.product.getbyid}${id}`)
        const rawData = await res.json()
        setProduct(rawData)
    }
    useEffect(()=>{
        if(id){
            handleFetchProduct()
        }
        // eslint-disable-next-line
    },[id])
    
    const handleClickOpen = (item) => {
        const formatUser = {
            id: item.id,
            weight: item.weight,
            importPrice: item.importPrice,
            price: item.price,
            quantity: item.quantity,
            status: item.status
        }
        const findImg = previewImg.find(k => k.productDetailId === item.id )
        setApiImg(findImg ? 'PUT' : 'POST')
        setPreview(findImg ? findImg.imgUrl : 'https://res.cloudinary.com/dtsqxauba/image/upload/v1732854331/notfound_lgqmju_cyre8t.png');        setSelectedUser(formatUser);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };
    const handleUpdate = async () => {
        try {
            const fileName = image.name.split('.').slice(0, -1).join('.');
            const imgInfo = {
                publicId: fileName,
                productDetailId: selectedUser.id
            }
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
            const r2 = await fetch(apiURL.image.base, {
                method: apiImg,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(imgInfo),
            });
            const response = await fetch(`${apiURL.productDetail.edit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser),
            });
            if (response.ok && r1.ok && r2.ok) {
                toast.success('Sửa thành công');
                refetch()
                loadImg()
            } else {
                toast.error('Sửa thất bại');
                throw new Error("Lỗi");
            }
        } catch (error) {
            toast.error('Sửa thất bại');
            console.log(error);
        }
        handleClose();
    };

    return (
        <div className="border bg-light rounded-3">
            <div className='d-flex justify-content-center m-2'>
                <h2>Danh sách sản phẩm chi tiết</h2>
            </div>
            <div className='p-3'>
                <div className='d-flex mb-2 justify-content-between'>
                    <div className="d-flex align-items-center">
                        <SearchInput
                        />
                    </div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" className="m-0">Tìm kiếm theo:</FormLabel>
                        <RadioGroup
                            row
                        >
                            <FormControlLabel value="isSearchEmail=false" control={<Radio />} label="Số điện thoại" />
                            <FormControlLabel value="isSearchEmail=true" control={<Radio />} label="Email" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <TableUser rows={initialData} onEdit={handleClickOpen} name={product.name} />
            </div>
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
        </div>
    );
}

function TableUser({ rows, onEdit, name }) {  
    const formattedRows = rows.map((item) => ({
        id: item.id,
        name: name,
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
        { field: 'name', headerName: 'Tên sản phẩm', width: 110 },
        { field: 'code', headerName: 'Mã chi tiết', width: 110 },
        { field: 'color', headerName: 'Màu', width: 70 },
        { field: 'size', headerName: 'Kích thước', width: 110 },
        { field: 'weight', headerName: 'Cân nặng', width: 110 },
        { field: 'importPrice', headerName: 'Giá nhập', width: 130 },
        { field: 'price', headerName: 'Giá bán', width: 110 },
        { field: 'quantity', headerName: 'Số lượng', width: 110 },
        { field: 'createTime', headerName: 'Ngày tạo', width: 110 },
        { field: 'tt', headerName: 'Trạng thái', width: 110 },
        {
            field: 'action',
            headerName: 'Thao tác',
            width: 130,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => onEdit(params.row)}
                    >
                        <i className="fa-solid fa-pen"></i>
                    </Button>
                    {/* <Button
                        className='ms-1'
                        variant="contained"
                        color="secondary"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </Button> */}
                </div>
            ),
        },
    ];
    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <div>
            <Paper sx={{ minWidth: '705px', width: 'auto', maxWidth: '1558px' }}>
                <DataGrid
                    columns={columns}
                    rows={formattedRows}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    disableRowSelectionOnClick
                />
            </Paper>
        </div>
    );
}

export default ListProductDetail;