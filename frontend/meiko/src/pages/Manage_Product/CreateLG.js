import React, { useState, useCallback, useEffect } from 'react';
import useFetchData from '../../customHook/useFetchData.js';
import apiURL from '../../routes/API/index.js';
import Color from './Color.js';
import Size from './Size.js';
import SubmitButton from './SubmitButton.js'
import ProductDetail from './ProductDetail.js';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, Input, Paper, Stack, TextareaAutosize, Typography } from '@mui/material';

function CreateLG() {
    const [color, setColor] = useState(false);
    const [size, setSize] = useState(false);
    const [addImg, setAddImg] = useState(false)
    const [colorSelected, setColorSelected] = useState([]);
    const [sizeSelected, setSizeSelected] = useState([]);
    const [error, setError] = useState(false)
    const [img, setImg] = useState(null)
    const [newProduct, setNewProduct] = useState({
        product: {
            name: '',
            description: '',
            productCode: '111',
            imageUrl: '',
            publicId: '1',
            warrantyPeriod: '12 tháng',
            createTime: new Date().toISOString(),
            status: 0,
            materialId: '',
            brandId: '',
            categoryId: '',
            targretCustomerId: ''
        },
        productDetails: []
    });

    const { data: products } = useFetchData(apiURL.product.all);
    const { data: categories } = useFetchData(apiURL.category.all);
    const { data: brands } = useFetchData(apiURL.brand.all);
    const { data: target } = useFetchData(apiURL.target.all);
    const { data: meterials } = useFetchData(apiURL.meterial.all);

    const handleUploadImg = (fileName) => {
        setNewProduct(prev => ({
            ...prev,
            product: {
                ...prev.product,
                imageUrl: fileName,
                publicId: fileName,
            }
        }));
    };

    const handleAddColor = useCallback((data) => {
        setColorSelected(data);
        const newDetails = data.flatMap(color =>
            sizeSelected.map(size => ({
                id: `${color.id}-${size.id}`,
                quantity: 1,
                importPrice: 0,
                price: 0,
                colorId: color.id,
                weight: 0,
                createTime: new Date().toISOString(),
                sizeId: size.id,
                productDetailCode: '222'
            }))
        );

        setNewProduct(prev => ({
            ...prev,
            productDetails: newDetails
        }));
    }, [sizeSelected]);

    const handleAddSize = useCallback((data) => {
        setSizeSelected(data)
        const newDetails = colorSelected.flatMap(color =>
            data.map(size => ({
                id: `${color.id}-${size.id}`,
                quantity: 1,
                importPrice: 0,
                price: 0,
                colorId: color.id,
                sizeId: size.id,
                productDetailCode: '222'
            }))
        );

        setNewProduct(prev => ({
            ...prev,
            productDetails: newDetails
        }));
    }, [colorSelected]);

    const handleDeleteDetail = (id) => {
        setNewProduct(prev => ({
            ...prev,
            productDetails: prev.productDetails.filter(detail => detail.id !== id)
        }));
    };

    const handleUpdateDetail = (updatedDetail) => {
        setNewProduct(prev => ({
            ...prev,
            productDetails: prev.productDetails.map(detail =>
                detail.id === updatedDetail.id ? updatedDetail : detail
            )
        }));
    };
    const handleInputChange = (field, value) => {
        setNewProduct(prev => ({
            ...prev,
            product: {
                ...prev.product,
                [field]: value
            }
        }));
        setError(false);
    };
    return (
        <div>
            {/* Thông tin sản phẩm */}
            <Card className="bg-light rounded-3">
                <CardContent>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Typography variant="h5">Thông tin sản phẩm</Typography>
                    </Box>
                    <Box m={4}>
                        <Autocomplete
                            disablePortal
                            key={products.id}
                            options={products}
                            onInputChange={(event, newInputValue) => {
                                handleInputChange('name', newInputValue);
                            }}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Nhập tên sản phẩm"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={error && !newProduct.product.name}
                                    helperText={error && !newProduct.product.name ? 'Tên sản phẩm là bắt buộc' : ''}
                                />
                            )}
                            freeSolo
                        />
                        <Grid2 container spacing={2} mt={4} justifyContent="space-between">
                            <Grid2 item size={6}>
                                <Autocomplete
                                    disablePortal
                                    options={categories}
                                    onChange={(event, newValue) => {
                                        handleInputChange('categoryId', newValue ? newValue.id : '');
                                    }}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nhập loại sản phẩm"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            error={error.category}
                                            helperText={error.category ? 'Loại sản phẩm là bắt buộc' : ''}
                                        />
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={6}>
                                <Autocomplete
                                    disablePortal
                                    options={brands}
                                    onChange={(event, newValue) => {
                                        handleInputChange('brandId', newValue ? newValue.id : '');
                                    }}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nhập thương hiệu"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            error={error.brand}
                                            helperText={error.brand ? 'Thương hiệu là bắt buộc' : ''}
                                        />
                                    )}
                                />
                            </Grid2>
                        </Grid2>
                        <Grid2 container spacing={2} mt={4} justifyContent="space-between">
                            <Grid2 item size={6}>
                                <Autocomplete
                                    disablePortal
                                    options={target}
                                    onChange={(event, newValue) => {
                                        handleInputChange('targretCustomerId', newValue ? newValue.id : '');
                                    }}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nhập đối tượng sử dụng"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            error={error.target}
                                            helperText={error.target ? 'Đối tượng sử dụng là bắt buộc' : ''}
                                        />
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={6}>
                                <Autocomplete
                                    disablePortal
                                    options={meterials}
                                    onChange={(event, newValue) => {
                                        handleInputChange('materialId', newValue ? newValue.id : '');
                                    }}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nhập chất liệu"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            error={error.meterial}
                                            helperText={error.meterial ? 'Chất liệu là bắt buộc' : ''}
                                        />
                                    )}
                                />
                            </Grid2>
                        </Grid2>
                        <Grid2 container spacing={2} mt={4} justifyContent="space-between">
                            <Grid2 item size={8}>

                                <Box mt={4}>
                                    <TextareaAutosize
                                        minRows={4}
                                        placeholder="Nhập mô tả sản phẩm"
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#ccc' }}
                                        onChange={(event) => {
                                            handleInputChange('description', event.target.value);
                                        }}
                                    />
                                </Box>
                            </Grid2>
                            <Grid2 item xs={8}>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={() => setAddImg(true)}
                                    sx={{ display: 'block', marginBottom: 2 }}
                                >
                                    Thêm ảnh
                                </Button>
                                {newProduct.product.imageUrl && (
                                    <img alt="Preview" width="190px" src={img.preview} />
                                )}
                                <UploadIMG
                                    onClose={() => setAddImg(false)}
                                    onUpload={handleUploadImg}
                                    getImg={(data) => setImg(data)}
                                    open={addImg}
                                />
                            </Grid2>
                        </Grid2>
                    </Box>
                </CardContent>
            </Card>
            {/* Màu & kích thước */}
            <Paper elevation={3} className="mt-4 bg-light rounded-3">
                {color && (
                    <Dialog open={color} onClose={() => setColor(false)}>
                        <DialogContent>
                            {/* Add the Color component or relevant content here */}
                            <Color colorSelect={colorSelected} onAddColor={handleAddColor} onClose={() => { setColor(false); }} />

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setColor(false)} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                {size && (
                    <Dialog open={size} onClose={() => setSize(false)}>
                        <DialogContent>
                            {/* Add the Size component or relevant content here */}
                            <Size SizeSelect={sizeSelected} onClose={() => { setSize(false); }} onAddSize={handleAddSize} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSize(false)} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                <Box display="flex" justifyContent="center" p={2}>
                    <Typography variant="h5">Màu sắc & kích cỡ</Typography>
                </Box>
                <Box p={3}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography style={{ width: '90px' }}>Màu sắc :</Typography>
                        {colorSelected.map((color) => (
                            <Box
                                key={color.id}
                                sx={{
                                    color: '#fff',
                                    border: `2px solid ${color.hex}`,
                                    backgroundColor: color.hex,
                                    cursor: 'auto',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    display: 'inline-block'
                                }}
                            >
                                {color.name}
                            </Box>
                        ))}
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={() => setColor(true)}
                            sx={{ width: '85px' }}
                        >
                            +
                        </Button>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2} mt={2}>
                        <Typography style={{ width: '90px' }}>Kích thước :</Typography>
                        {sizeSelected.map((size) => (
                            <Box
                                key={size.id}
                                sx={{
                                    color: '#fff',
                                    border: `2px solid #fff`,
                                    backgroundColor: '#000',
                                    cursor: 'auto',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    display: 'inline-block'
                                }}
                            >
                                {size.name}
                            </Box>
                        ))}
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={() => setSize(true)}
                            sx={{ width: '85px' }}
                        >
                            +
                        </Button>
                    </Stack>
                </Box>
            </Paper>
            {/* ProductDetail */}
            <div>
                {colorSelected.map((c) => (
                    <ProductDetail
                        key={c.id}
                        color={c}
                        productDetails={newProduct.productDetails.filter(detail => detail.colorId === c.id)}
                        nameProduct={newProduct.product.name}
                        size={sizeSelected}
                        onDelete={handleDeleteDetail}
                        onUpdate={handleUpdateDetail}
                    />
                ))}
            </div>
            <div>
                {newProduct.productDetails.length !== 0 &&
                    <SubmitButton obj={newProduct} image={img} />
                }
            </div>
        </div>
    );
}

function UploadIMG({ onClose, onUpload, getImg, open }) {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handlePreAvt = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setImage(file);
        }
    };

    const handleSelectImg = () => {
        if (!image) {
            toast.warning('Vui lòng chọn ảnh');
            return;
        }
        const fileName = image.name.split('.').slice(0, -1).join('.');
        const imgInfo = {
            img: image,
            preview: preview
        }
        getImg(imgInfo)
        onUpload(fileName);
        onClose()
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Box display="flex" justifyContent="center">
                    <h2>Thêm ảnh</h2>
                </Box>
            </DialogTitle>
            <Box padding={2}>
                <Input
                    type="file"
                    className="form-control"
                    onChange={handlePreAvt}
                    fullWidth
                />
                {preview && (
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <img src={preview} width="316px" alt="Preview" />
                    </Box>
                )}
            </Box>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSelectImg}
                >
                    Chọn ảnh
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateLG;