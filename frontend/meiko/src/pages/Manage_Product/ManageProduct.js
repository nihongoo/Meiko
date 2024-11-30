import TableLG from './TableLG.js';
import SearchInput from '../../component/Search/index.js';
import apiURL from '../../routes/API/index.js';
import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

function ManageProduct() {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataChange, setDataChange] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchType, setSearchType] = useState('isSearchWithName=true');

    const formatProductData = (item) => ({
        id: item.id,
        name: item.name,
        productCode: item.productCode,
        createTime: item.createTime,
        image: item.imageUrl,
        status: item.status,
    });

    const fetchProductData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(apiURL.product.all);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProduct(data.map(formatProductData));
            setDataChange(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductData();
    }, [dataChange, fetchProductData]);

    const handleSearch = (data) => setProduct(data.map(formatProductData));
    const handleChangeData = () => setDataChange(true);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleItemsPerPageChange = (event) => setItemsPerPage(Number(event.target.value));

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const currentItems = product.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(product.length / itemsPerPage);

    const columns = [
        { Header: 'STT', accessor: 'serialNumber' },
        { Header: 'Tên sản phẩm', accessor: 'name' },
        { Header: 'Mã sản phẩm', accessor: 'productCode' },
        {
            Header: 'Ngày thêm',
            accessor: 'createTime',
            Cell: ({ value }) => moment(value).format('DD-MM-YYYY'),
        },
        {
            Header: 'Ảnh',
            accessor: 'image',
            Cell: ({ value }) => (
                <img src={value} alt="Product" style={{ width: '50px', height: '50px' }} />
            ),
        },
        { Header: 'Status', accessor: 'status' },
    ];

    return (
        <div className="border bg-light rounded-3">
            <div className="d-flex justify-content-center m-2">
                <h2>Thông tin sản phẩm</h2>
            </div>
            <div className="p-3">
                <div className="d-flex mb-2 justify-content-between">
                    <div className='d-flex align-items-center'>
                        <SearchInput
                            ApiURL={apiURL.product.search}
                            onSearch={handleSearch}
                            optional={searchType}
                        />
                    </div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" className="m-0">Tìm kiếm theo:</FormLabel>
                        <RadioGroup
                            row
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <FormControlLabel value="isSearchWithName=true" control={<Radio />} label="Tên sản phẩm" />
                            <FormControlLabel value="isSearchWithName=false" control={<Radio />} label="Mã sản phẩm" />
                        </RadioGroup>
                    </FormControl>
                    <div className='d-flex align-items-center'>
                        <Link to='/manageproduct/add' className='btn btn-outline-success'>
                            + Thêm mới
                        </Link>
                    </div>
                </div>
                <TableLG
                    columns={columns}
                    data={currentItems.map((item, index) => ({
                        ...item,
                        serialNumber: index + 1 + (currentPage - 1) * itemsPerPage,
                    }))}
                    onChangeData={handleChangeData}
                    apiURLDel={apiURL.product.delete}
                    apiURLEdit={apiURL.product.edit}
                />
                <div className="d-flex justify-content-between mt-3">
                    <div>
                        <label>Số lượng mục trên trang:</label>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            {[5, 10, 15, 20].map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'} mx-1`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageProduct;
