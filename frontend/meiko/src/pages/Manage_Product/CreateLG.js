import React, { useState, useCallback, useEffect } from 'react';
import useFetchData from '../../customHook/useFetchData.js';
import apiURL from '../../Routes/API/index.js';
import Color from './Color.js';
import Size from './Size.js';
import SubmitButton from './SubmitButton.js'
import ProductDetail from './ProductDetail.js';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';

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
    return (
        <div>
            {/* Thông tin sản phẩm */}
            <div className="border bg-light rounded-3">
                <div className="d-flex justify-content-center m-2">
                    <h2>Thông tin sản phẩm</h2>
                </div>
                <div className="m-4">
                    <Autocomplete
                        disablePortal
                        key={products.id}
                        options={products}
                        onInputChange={(event, newInputValue) => {
                            setNewProduct(prev => ({
                                ...prev,
                                product: {
                                    ...prev.product,
                                    name: newInputValue
                                }
                            }));
                            setError(false)
                        }}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Nhập tên sản phẩm"
                                variant="outlined"
                                fullWidth
                                className="form-control"
                                required
                                error={error && !newProduct.product.name}
                                helperText={error && !newProduct.product.name ? 'Tên sản phẩm là bắt buộc' : ''}
                            />
                        )}
                        freeSolo
                    />
                    <div className="d-flex justify-content-evenly">
                        <div className="flex-fill mt-4">
                            <Autocomplete
                                disablePortal
                                options={categories}
                                onChange={(event, newValue) => {
                                    setNewProduct(prev => ({
                                        ...prev,
                                        product: {
                                            ...prev.product,
                                            categoryId: newValue ? newValue.id : ''
                                        }
                                    }));
                                    setError(false);
                                }}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nhập loại sản phẩm"
                                        variant="outlined"
                                        fullWidth
                                        className="form-control"
                                        required
                                        error={error.category}
                                        helperText={error.category ? 'Loại sản phẩm là bắt buộc' : ''}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex-fill ms-1 mt-4">
                            <Autocomplete
                                disablePortal
                                options={brands}
                                onChange={(event, newValue) => {
                                    setNewProduct(prev => ({
                                        ...prev,
                                        product: {
                                            ...prev.product,
                                            brandId: newValue ? newValue.id : ''
                                        }
                                    }));
                                    setError(false);
                                }}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nhập thương hiệu"
                                        variant="outlined"
                                        fullWidth
                                        className="form-control"
                                        required
                                        error={error.brand}
                                        helperText={error.brand ? 'Thương hiệu là bắt buộc' : ''}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-evenly">
                        <div className="flex-fill mt-4">
                            <Autocomplete
                                disablePortal
                                options={target}
                                onChange={(event, newValue) => {
                                    setNewProduct(prev => ({
                                        ...prev,
                                        product: {
                                            ...prev.product,
                                            targretCustomerId: newValue ? newValue.id : ''
                                        }
                                    }));
                                    setError(false);
                                }}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nhập đối tượng sử dụng"
                                        variant="outlined"
                                        fullWidth
                                        className="form-control"
                                        required
                                        error={error.target}
                                        helperText={error.target ? 'Đối tượng sử dụng là bắt buộc' : ''}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex-fill ms-1 mt-4">
                            <Autocomplete
                                disablePortal
                                options={meterials}
                                onChange={(event, newValue) => {
                                    setNewProduct(prev => ({
                                        ...prev,
                                        product: {
                                            ...prev.product,
                                            materialId: newValue ? newValue.id : ''
                                        }
                                    }));
                                    setError(false);
                                }}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nhập chất liệu"
                                        variant="outlined"
                                        fullWidth
                                        className="form-control"
                                        required
                                        error={error.meterial}
                                        helperText={error.meterial ? 'Chất liệu là bắt buộc' : ''}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className='mt-4 d-flex justify-content-between'>
                        <div style={{ width: '70%' }} className='d-flex justify-content-start'>
                            <textarea
                                className="form-control"
                                placeholder='Nhập mô tả sản phẩm'
                                rows={4}
                                onChange={(event) => {
                                    setNewProduct(prev => ({
                                        ...prev,
                                        product: {
                                            ...prev.product,
                                            description: event.target.value
                                        }
                                    }));
                                }}
                            ></textarea>

                        </div>
                        <div className='ms-2'>
                            <div className='d-flex flex-column'>

                            {addImg &&
                                <UploadIMG
                                    onClose={() => setAddImg(false)}
                                    onUpload={handleUploadImg}
                                    getImg={(data) => setImg(data)}
                                />}
                            {
                                newProduct.product.imageUrl &&
                                <img alt="Preview" width="190px" src={img.preview} />
                            }
                            <button
                                className='btn btn-outline-success'
                                onClick={() => (setAddImg(true))}
                            >
                                Thêm ảnh
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Màu & kích thước */}
            <div>
                <div className='border mt-4 bg-light rounded-3'>
                    {color && (
                        <Color colorSelect={colorSelected} onAddColor={handleAddColor} onClose={() => { setColor(false); }} />
                    )}
                    {size && (
                        <Size SizeSelect={sizeSelected} onClose={() => { setSize(false); }} onAddSize={handleAddSize} />
                    )}
                    <div className="d-flex justify-content-center m-2">
                        <h2>Màu sắc & kích cỡ</h2>
                    </div>
                    <div className='m-4'>
                        <div className='d-flex align-items-center'>
                            <p className='m-0' style={{ width: '85px' }}>Màu sắc :</p>
                            {colorSelected.map((color) => (
                                <div
                                    key={color.id}
                                    style={{
                                        color: '#fff',
                                        border: `2px solid ${color.hex}`,
                                        backgroundColor: color.hex,
                                        cursor: 'auto'
                                    }}
                                    className='btn ms-2'
                                >
                                    {color.name}
                                </div>
                            ))}
                            <div className='ms-2'>
                                <button
                                    className='btn btn-outline-success'
                                    style={{ width: '85px' }}
                                    onClick={() => { setColor(true); }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className='mt-2 d-flex align-items-center'>
                            <p className='m-0' style={{ width: '85px' }}>Kích thước :</p>
                            {sizeSelected.map((size) => (
                                <div
                                    key={size.id}
                                    style={{
                                        color: '#fff',
                                        border: `2px solid #fff`,
                                        backgroundColor: '#000',
                                        cursor: 'auto'
                                    }}
                                    className='btn ms-2'
                                >
                                    {size.name}
                                </div>
                            ))}
                            <div className='ms-2'>
                                <button
                                    className='btn btn-outline-success'
                                    style={{ width: '85px' }}
                                    onClick={() => { setSize(true); }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

function UploadIMG({ onClose, onUpload, getImg }) {
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
        <div className="position-absolute" style={{ zIndex: '5' }}>
            <div
                className="overlay position-fixed bg-dark"
                style={{
                    width: '100vw',
                    height: '100vh',
                    top: '0',
                    left: '0',
                    opacity: '0.5'
                }}
                onClick={onClose}
            ></div>
            <div
                className="position-fixed border rounded-2 p-4"
                style={{
                    top: '15vh',
                    left: '45%',
                    background: '#fff'
                }}
            >
                <div>
                    <h2 className="d-flex justify-content-center">Thêm ảnh</h2>
                </div>

                <div>
                    <div>
                        <input
                            className="form-control"
                            type="file"
                            onChange={handlePreAvt}
                        />
                        {preview && (
                            <img src={preview} width="316px" alt="Preview" />
                        )}
                    </div>
                    <button
                        className="btn btn-dark mt-2"
                        onClick={handleSelectImg}
                    >Chọn ảnh</button>
                </div>
            </div>
        </div>
    );
}

export default CreateLG;