import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import useFetchData from '../../customHook/useFetchData';
import apiURL from '../../routes/API';
import moment from 'moment';
import StateBill from './StateBill';
import InfoIcon from '@mui/icons-material/Info';

function ManageBill() {
    const paginationModel = { page: 0, pageSize: 5 };
    const [showInfo, setShowInfo] = useState(false)
    const [filter, setFilter] = useState('');
    const [item, setItem] = useState(null)
    const [api, setApi] = useState(apiURL.bill.all)

    const { data: staff } = useFetchData(apiURL.staff.all)
    const { data: customer, loading: userLoad } = useFetchData(apiURL.user.all)
    const { data: product, loading: productLoad } = useFetchData(apiURL.product.all)
    const { data: rows, refetch, loading, error } = useFetchData(api, (raw) => {
        return raw.map((item) => ({
            ...item,
            total: item.total + 'VND',
            totalProducts: item.billDetails.reduce((sum, detail) => sum + detail.quantity, 0),
            billType: item.customerId ? 'Trực tuyến' : 'Tại quầy',
            customerName: customer.find((customer) => customer.id === item.customerId)?.name || 'Khách lẻ',
            createdDate: moment(item.createdDate).format('DD-MM-YYYY HH:mm'),
            billDetails: item.billDetails.map(billDetail => {
                const productDetail = product.flatMap(product => product.Product_detail)
                    .find(detail => detail.id === billDetail.productDetailId);
                if (productDetail) {
                    return {
                        ...billDetail,
                        productName: product.find(product => product.id === productDetail.productId).name,
                    };
                }
                return billDetail;
            }),
            ADRS: (!item.shippingAddresses || item.shippingAddresses.length === 0)
                ? 'Nhận hàng tại quầy'
                : `${item.shippingAddresses[0].ward}, ${item.shippingAddresses[0].district}, ${item.shippingAddresses[0].city}`
        }))
    })

    const handleFindStaff = (staffId) => {
        const staffMember = staff.find((s) => s.id === staffId);
        if (staffMember) {
            return staffMember;
        }
        return null;
    }
    useEffect(() => {
        if (!userLoad) {
            refetch()
        }
        // eslint-disable-next-line
    }, [userLoad, productLoad])
    const handlePrint = (bill) => {
        const staffMember = handleFindStaff(bill.staffId);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <head>
    <title>Hóa đơn: ${bill.code}</title>
    <!-- Thêm Bootstrap -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
</head>

<body class="p-3">
    <div class="container">
        <h1 class="text-center mb-4">Meiko Shop</h1>
        <div class="d-flex justify-content-center">
            <div>
                <p class="text-center">Số điện thoại: 0342927485</p>
                <p class="text-center">Email: meikoshop@gmail.com</p>
                <p class="text-center">Địa chỉ: Tòa nhà FPT Polytechnic., Cổng số 2, 13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội, Việt Nam</p>
            </div>
        </div>
        <div class="d-flex justify-content-center mt-4">
            <h1>Hóa đơn bán hàng</h1>
        </div>
        <div class="d-flex justify-content-between">
            <div>
                <p>Tên khách hàng: ${bill.customerName}</p>
                <p>Địa chỉ nhận hàng: ${bill.ADRS}</p>
                <p>Nhân viên: ${staffMember.staffName}</p>
            </div>
            <div>
                <p>Mã hóa đơn: ${bill.billCode}</p>
                <p>Ngày tạo: ${bill.createdDate}</p>
                <p>Trạng thái: ${bill.status}</p>
            </div>
        </div>
        <div>
            <h1>Danh sách sản phẩm</h1>
        </div>
        <table class="table table-bordered">
            <tbody>
                <tr>
                    <th scope="row">STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th>Trạng thái</th>
                </tr>
                ${bill.billDetails.map((item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}VND</td>
                        <td>${item.quantity * item.price}VND</td>
                        <td></td>
                    </tr>
                    `).join('')}
            </tbody>
        </table>
        <div class="d-flex justify-content-end">
            <p class="me-2">Tổng tiền: </p>
            <p>${bill.total}</p>
        </div>
    </div>
</body>

</html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
    const handleOpen = (item) => {
        setItem(item)
        setShowInfo(true)
    }

    const columns = [
        { field: 'billCode', headerName: 'Mã', flex: 1 },
        { field: 'totalProducts', headerName: 'Tổng SP', flex: 1 },
        { field: 'total', headerName: 'Tổng số tiền', flex: 1 },
        { field: 'customerName', headerName: 'Tên khách hàng', flex: 1 },
        { field: 'createdDate', headerName: 'Ngày tạo', flex: 1 },
        { field: 'billType', headerName: 'Loại hóa đơn', flex: 1 },
        { field: 'status', headerName: 'Trạng thái', flex: 1 },
        {
            field: 'action',
            headerName: 'Hành động',
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Button variant='outlined'
                        size='small'
                        onClick={() => { handleOpen(params.row) }}
                    >
                        <InfoIcon />
                    </Button>
                    <Button variant="outlined"
                        onClick={() => { handlePrint(params.row) }}
                        color="inherit" size="small">
                        <PrintIcon />
                    </Button>
                </Box>
            ),
        },
    ];
    const handleSetApi = () => {
        if (filter.startDate === null || filter.endDate === null) {
            setApi(apiURL.voucher.all)
            refetch()
        }
    }
    const handleFilter = () => {
        const isDateValid = filter.startDate && filter.endDate;
        setApi(isDateValid ? `${apiURL.bill.filter}?startDate=${filter.startDate}&endDate=${filter.endDate}` : apiURL.bill.all);
        refetch();
    };
    if (loading) return <div className='d-flex justify-content-center align-items-center'><CircularProgress /></div>
    if (error) return <div className='d-flex justify-content-center align-items-center'>Error: {error}</div>;

    return (
        <Box p={3} bgcolor="#fff" borderRadius={2}>
            <Box mb={3}>
                <Typography variant="h4" component="h3">
                    Quản lý đơn hàng
                </Typography>
            </Box>

            <Box display='flex'>
                <TextField
                    type='date'
                    label='Từ ngày'
                    variant='outlined'
                    size='small'
                    sx={{ mr: 2 }}
                    onChange={(e) => {
                        setFilter({ ...filter, startDate: e.target.value })
                        handleSetApi()
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    type='date'
                    label='Đến ngày'
                    variant='outlined'
                    size='small'
                    onChange={(e) => {
                        setFilter({ ...filter, endDate: e.target.value })
                        handleSetApi()
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button onClick={() => { handleFilter() }}>
                    <SearchIcon></SearchIcon>
                </Button>
            </Box>
            {userLoad ? (
                <div className='d-flex justify-content-center'>
                    <CircularProgress />
                </div>
            ) :
                (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        autoHeight
                        pageSize={5}
                        pageSizeOptions={[5, 10]}
                        disableSelectionOnClick
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
                )}
            <StateBill
                open={showInfo}
                onClose={() => { setShowInfo(false) }}
                item={item}
                setItem={setItem}
                print={handlePrint}
                reloadBill={refetch}
            />
        </Box>
    );
}

export default ManageBill;
