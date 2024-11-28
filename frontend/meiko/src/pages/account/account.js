import apiURL from '../../Routes/API';
import SearchInput from '../../component/Search';
import useFetchData from '../../customHook/useFetchData';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

function Account() {
    const { data: initialData } = useFetchData(apiURL.staff.all, (rawData) =>
        rawData.map((item) => ({
            ...item,
            dateJoin: moment(item.dateJoin).format('DD-MM-YYYY'),
            status: item.status === 1 
                ? 'Đang hoạt động' 
                : 'Không hoạt động',
        }))
    );

    const [Staff, setStaff] = useState([]);

    useEffect(() => {
        setStaff(initialData);
    }, [initialData]);

    const [searchType, setSearchType] = useState('isStaffCode=true');

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleSearch = (data) => {        
        const formattedData = data.map((item) => ({
            id: item.idStaff,
            staffName: item.staffName,
            staffCode: item.staffCode,
            dateJoin: moment(item.dateJoin).format('DD-MM-YYYY'),
            phoneNumber: item.phoneNumber,
            email: item.email,
            address: item.address,
            status: item.status === 0 
                ? 'Đang hoạt động' 
                : 'Không hoạt động',
        }));
        setStaff(formattedData); 
    };
    return (
        <div className="border bg-light rounded-3">
            <div className='d-flex justify-content-center m-2'>
                <h2>Danh sách nhân viên</h2>
            </div>
            <div className='p-3'>
            <div className='d-flex mb-2 justify-content-between'>
                    <div className="d-flex align-items-center">
                        <SearchInput 
                            ApiURL={apiURL.staff.search} 
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
                            <FormControlLabel value="isStaffCode=true" control={<Radio />} label="Mã nhân viên" />
                            <FormControlLabel value="isStaffCode=false" control={<Radio />} label="Tên nhân viên" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                <TableStaff rows={Staff}/>
                </div>
            </div>
        </div>
    );
}

function TableStaff({ rows }) {
    const columns = [
        { field: 'staffName', headerName: 'Tên nhân viên', width: 130 },
        { field: 'staffCode', headerName: 'Mã nhân viên', width: 130 },
        { field: 'dateJoin', headerName: 'Ngày vào làm', width: 130 },
        { field: 'address', headerName: 'Địa chỉ', width: 130 },
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

export default Account;