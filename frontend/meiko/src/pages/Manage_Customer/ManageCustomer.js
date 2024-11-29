import React, { useState, useEffect } from 'react';
import moment from 'moment';
import SearchInput from "../../component/Search";
import apiURL from '../../routes/API/index';
import useFetchData from "../../customHook/useFetchData";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

function ManageCustomer() {
    const { data: initialData } = useFetchData(apiURL.user.all, (rawData) =>
        rawData.map((item) => ({
            id: item.idCustomer,
            name: item.name,
            gioiTinh: item.gioiTinh === 0 ? 'Nam' : 'Nữ',
            birthDay: moment(item.birthDay).format('DD-MM-YYYY'),
            phoneNumber: item.phoneNumber,
            email: item.email,
            status: item.status === 1 
                ? 'Đang hoạt động' 
                : 'Không hoạt động',
        }))
    );

    const [User, setUser] = useState([]);

    useEffect(() => {
        setUser(initialData);
    }, [initialData]);

    const [searchType, setSearchType] = useState('isSearchEmail=true');

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleSearch = (data) => {
        const formattedData = data.map((item) => ({
            id: item.idCustomer,
            name: item.name,
            gioiTinh: item.gioiTinh === 0 ? 'Nam' : 'Nữ',
            birthDay: moment(item.birthDay).format('DD-MM-YYYY'),
            phoneNumber: item.phoneNumber,
            email: item.email,
            status: item.status === 1 
                ? 'Đang hoạt động' 
                : 'Không hoạt động',
        }));
        setUser(formattedData); 
    };

    return (
        <div className="border bg-light rounded-3">
            <div className='d-flex justify-content-center m-2'>
                <h2>Danh sách khách hàng</h2>
            </div>
            <div className='p-3'>
                <div className='d-flex mb-2 justify-content-between'>
                    <div className="d-flex align-items-center">
                        <SearchInput 
                            ApiURL={apiURL.user.search} 
                            optional={searchType}
                            onSearch={handleSearch} 
                        />
                    </div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" className="m-0">Tìm kiếm theo:</FormLabel>
                        <RadioGroup
                            row
                            value={searchType}
                            onChange={handleSearchTypeChange}
                        >
                            <FormControlLabel value="isSearchEmail=false" control={<Radio />} label="Số điện thoại" />
                            <FormControlLabel value="isSearchEmail=true" control={<Radio />} label="Email" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <TableUser rows={User} />
                </div>
            </div>
        </div>
    );
}

function TableUser({ rows }) {
    const columns = [
        { field: 'name', headerName: 'Tên', width: 130 },
        { field: 'gioiTinh', headerName: 'Giới tính', width: 130 },
        { field: 'birthDay', headerName: 'Ngày sinh', width: 130 },
        { field: 'phoneNumber', headerName: 'Số điện thoại', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'status', headerName: 'Trạng thái', width: 130 },
    ];
    const paginationModel = { page: 0, pageSize: 5 };
    
    return (
        <div>
            <div className='mt-0'>
                <Paper sx={{ minWidth: '705px', width: 'auto', maxWidth: '1558px' }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        disableRowSelectionOnClick
                    />
                </Paper>
            </div>
        </div>
    );
}

export default ManageCustomer;
