import React, { useState } from "react";
import {
    Dialog,
    TextField,
    Slider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    Typography,
    IconButton,
    Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChooseDetail from "./ChooseDetail";
import useFetchData from '../../customHook/useFetchData'
import apiURL from "../../Routes/API";

function ChooseProduct({ open, onClose }) {
    const [detail, setDetail] = useState(false)
    const { data: initData, refetch: reLoadData } = useFetchData(apiURL.productDetail.base)
    const { data: image, refetch: reloadImg } = useFetchData(apiURL.image.base)
    const { data: product, refetch: reloadProduct } = useFetchData(apiURL.product.all)
    const [item, setItem] = useState({})

    const Data = initData.map(item => {
        if(product.length === 0) reloadProduct()
        if(image.length === 0) reloadImg()
        const formatProduct = product.find(k => k.id === item.productId)
        const formatImage = image.find(k => k.productDetailId === item.id)       
        return {
            ...formatProduct,
            ...formatImage,
            id: item.id,
            code: item.productDetailCode,
            size: item.sizes.name,
            color: item.colors.name,
            hex: item.colors.hex,
            price: item.price,
        }
    })
    console.log(Data);
    
    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <Box padding={3}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                        Tìm kiếm sản phẩm
                    </Typography>
                    <IconButton color="error" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Search and Slider */}
                <Grid container spacing={2} mb={3} className="justify-content-between">
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            placeholder="Tìm kiếm theo tên hoặc mã sản phẩm chi tiết"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3} className="me-5">
                        <Typography gutterBottom>Khoảng giá:</Typography>
                        <Slider
                            defaultValue={[0, 100000000]}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value.toLocaleString()} VND`}
                            min={0}
                            max={50000000}
                            step={500000}
                            marks
                            sx={{ width: '100%', maxWidth: '300px' }} // Thêm thuộc tính sx để giới hạn chiều rộng slider
                        />
                    </Grid>

                </Grid>

                {/* Product Table */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ảnh</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>Mã</TableCell>
                                <TableCell>Loại</TableCell>
                                <TableCell>Thương hiệu</TableCell>
                                <TableCell>Chất liệu</TableCell>
                                <TableCell>Đối tượng sử dụng</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Màu</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Data.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Box
                                        component="img"
                                        src={item.imgUrl ?item.imgUrl : item.imageUrl }
                                        alt="product"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 2,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.code}</TableCell>
                                <TableCell>{item.categories.name}</TableCell>
                                <TableCell>{item.brands.name}</TableCell>
                                <TableCell>{item.materials.name}</TableCell>
                                <TableCell>{item.targretCustomers.name}</TableCell>
                                <TableCell>{item.size}</TableCell>
                                <TableCell>{item.color}</TableCell>
                                <TableCell>{item.price}VND</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="info"
                                        onClick={() => { setDetail(true); setItem(item) }}
                                    >
                                        Chọn
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <ChooseDetail
                open={detail}
                onClose={() => { setDetail(false) }}
                item={item}
            />
        </Dialog>
    );
}

export default ChooseProduct;
