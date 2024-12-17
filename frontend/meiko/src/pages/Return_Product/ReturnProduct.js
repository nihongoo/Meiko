import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Card, Divider, Autocomplete } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NoBillDataFind from "./NoBillDataFind";
import useFetchData from "../../customHook/useFetchData";
import apiURL from "../../routes/API";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";

function ReturnProduct() {
    const [query, setQuery] = useState("");
    const [bill, setBill] = useState(null);
    const [selected, setSelected] = useState([])
    const [error, setError] = useState(null);
    const { data: Detail } = useFetchData(`${apiURL.bill.list}?id=${bill?.id}`);
    const { data: allBill } = useFetchData(apiURL.bill.all)
    const [amountSpent, setAmountSpent] = useState(0);
    const completedBills = allBill.filter(bill => bill.status === 'Hoàn thành');
    const [obj, setObj] = useState({
        billId: '',
        requester: localStorage.getItem('userId'),
        refundItems: [{
            id: '',
            name: '',
            quantity: 0,
            price: 0,
            total: 0,
            note: '',
        }]
    })
    const handleNoteChange = (id, note) => {
        setSelected((prev) =>
            prev.map(item =>
                item.id === id ? { ...item, note } : item
            )
        );
    };
    const handleSearch = async () => {
        try {
            setError(null);
            const response = await fetch(`${apiURL.bill.search}?query=${query}`);
            if (!response.ok) {
                throw new Error("Không tìm thấy hóa đơn");
            }
            const data = await response.json();
            setBill(data[0]);
        } catch (err) {
            setBill(null)
            setError(err.message);
            console.log(error);
        }
    };
    useEffect(() => {
        const calculatedTotal = selected.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // Cập nhật lại obj
        setAmountSpent(calculatedTotal);
        setObj((prev) => ({
            ...prev,
            billId: bill?.id || '',
            refundItems: selected.map((item) => ({
                productId: item.productDetailId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity,
                note: item.note,
            })),
        }));
    }, [selected]);
    const handleRefund = async () => {
        try {
            const invalidItems = selected.filter(item => !item.note || item.note.trim() === '');
            if (invalidItems.length > 0) {
                toast.error('Vui lòng nhập ghi chú cho tất cả sản phẩm trước khi trả hàng.');
                return;
            }
            const res = await fetch(apiURL.bill.refund, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            if (res.ok) {
                toast.success('Tạo mới thành công')
            }
            else {
                const errorData = await res.json();
                if (errorData.errors) {
                    const firstErrorKey = Object.keys(errorData.errors)[0];
                    const firstErrorMessage = errorData.errors[firstErrorKey][0];
                    if (firstErrorMessage) {
                        toast.error(`${firstErrorMessage}`);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box p={3} bgcolor="#fff" borderRadius={2} minHeight={700}>
            <Box display="flex" justifyContent="center" mb={3}>
                <Typography variant="h4">Trả hàng</Typography>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
                <Box mr={2} display="flex" alignItems="center">
                    <Typography variant="body1" fontWeight="bold" color="textPrimary">Mã hóa đơn:</Typography>
                </Box>
                <Box display="flex">
                    <Autocomplete
                        disablePortal
                        options={completedBills || []}
                        onInputChange={(event, newInputValue) => {
                            setQuery(newInputValue);
                        }}
                        getOptionLabel={(option) => option.billCode}
                        renderInput={(params) => (
                            <TextField
                                variant="outlined"
                                placeholder="Nhập mã hóa đơn cần trả hàng"
                                size="small"
                                {...params}
                                sx={{ mr: 1, width: 400 }}
                            />
                        )}
                        freeSolo
                    />

                    <Button variant="outlined" onClick={() => { handleSearch() }} size="small" color="warning">Tìm kiếm</Button>
                </Box>
            </Box>
            <Box>
                {bill ? (<div>
                    <ListDetail item={Detail} setSelect={setSelected} />
                    <Box
                        mt={4}
                        display="flex"
                        gap={4}
                        sx={{
                            flexDirection: { xs: "column", md: "row" },
                        }}
                    >
                        <ListReturn item={selected} onNoteChange={handleNoteChange} />
                        <BillInfo item={bill} handleRefund={handleRefund} obj={obj} amountSpent={amountSpent}></BillInfo>
                    </Box>
                </div>) : (
                    <NoBillDataFind />
                )}
            </Box>
        </Box>
    );
}

function ListReturn({ item, onNoteChange }) {
    const paginationModel = { page: 0, pageSize: 5 };
    const rows = item.map((item, index) => ({
        ...item,
        id: item.id || index,
        total: item.quantity * item.price,
        note: item.note || ''
    }));
    const handleRowEdit = (updateRow) => {
        onNoteChange(updateRow.id, updateRow.note);
        return { ...updateRow };
    };

    const columns = [
        { field: "name", headerName: "Tên sản phẩm", flex: 1 },
        { field: "quantity", headerName: "Số lượng", flex: 1 },
        { field: "price", headerName: "Đơn giá", flex: 1 },
        { field: "total", headerName: "Tổng", flex: 1 },
        {
            field: "note",
            headerName: "Ghi chú",
            flex: 1,
            editable: true,
        },
    ];
    return (
        <Box flex={2}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                initialState={{ pagination: { paginationModel } }}
                rowsPerPageOptions={[5, 10]}
                autoHeight
                processRowUpdate={handleRowEdit}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderBottom: 'none',
                    },
                    backgroundColor: '#fff',
                    minHeight: 300,
                    maxHeight: 'calc(100vh - 200px)',
                }}
            />
        </Box>
    )
}

function ListDetail({ item, setSelect }) {
    const paginationModel = { page: 0, pageSize: 5 };
    const columns = [
        { field: "name", headerName: "Tên sản phẩm", flex: 1 },
        { field: "quantity", headerName: "Số lượng", flex: 1 },
        { field: "price", headerName: "Đơn giá", flex: 1 },
    ];

    return (
        <div>
            <div>
                <h4>Danh sách sản phẩm</h4>
            </div>
            <DataGrid
                rows={item.map((row, index) => ({
                    ...row,
                    id: row.id || index,
                }))}
                columns={columns}
                pageSize={5}
                initialState={{ pagination: { paginationModel } }}
                rowsPerPageOptions={[5, 10]}
                autoHeight
                onRowSelectionModelChange={(newSelection) => {
                    const selectedRows = newSelection.map((id) =>
                        item.find((row) => row.id === id)
                    );
                    setSelect(selectedRows);
                }}
                checkboxSelection
                disableRowSelectionOnClick
                sx={{
                    border: "none",
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        borderBottom: "none",
                    },
                    backgroundColor: "#fff",
                    minHeight: 300,
                    maxHeight: "calc(100vh - 200px)",
                }}
            />
        </div>
    );
}


function BillInfo({ item, handleRefund, obj, amountSpent }) {
    const { data: info } = useFetchData(item?.id ? `${apiURL.bill.billId}${item.id}` : null);
    // const amountSpent = obj.refundItems.reduce((sum, item) => sum + item.total, 0)
    if (!info) {
        return (
            <Typography variant="body1" color="textSecondary">
                Đang tải thông tin hóa đơn...
            </Typography>
        );
    }

    const recipientName = Array.isArray(info?.shippingAddresses) && info.shippingAddresses[0]
        ? info.shippingAddresses[0].recipientName
        : 'Khách lẻ';

    const address = Array.isArray(info?.shippingAddresses) && info.shippingAddresses[0]
        ? `${info.shippingAddresses[0]?.ward || ''}, ${info.shippingAddresses[0]?.district || ''}, ${info.shippingAddresses[0]?.city || ''}`
        : 'Không xác định';

    const total = new Intl.NumberFormat('vi-VN').format(info?.total) + ' VND' || 0;
    console.log(obj);

    return (
        <Box flex={1}>
            <Card
                sx={{
                    padding: 3,
                    borderRadius: 2,
                    minHeight: 330,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography variant="h4" gutterBottom color="primary">
                    Thông tin hoàn trả
                </Typography>
                <Box mb={2}>
                    <Box display="flex" mb={1}>
                        <Typography variant="body1" fontWeight="bold" color="textPrimary" mr={1}>
                            Khách hàng:
                        </Typography>
                        <Typography variant="body1">{recipientName}</Typography>
                    </Box>
                    <Box display="flex">
                        <Typography variant="body1" fontWeight="bold" color="textPrimary" mr={1}>
                            Địa chỉ:
                        </Typography>
                        <Typography variant="body1">{address}</Typography>
                    </Box>
                </Box>
                <Divider
                    sx={{
                        my: 1,
                        height: 2,
                        backgroundColor: "#000",
                    }}
                />
                <Box display="flex" justifyContent="space-between" mb={3}>
                    <Box>
                        <Typography variant="body1" fontWeight="bold" color="error">
                            Tổng tiền:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="error">
                            Số tiền hoàn trả:
                        </Typography>
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="body1">{total}</Typography>
                        <Typography variant="body1">
                            {new Intl.NumberFormat('vi-VN').format(amountSpent) + ' VND'}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    size="large"
                    onClick={handleRefund}
                >
                    Trả hàng
                </Button>
            </Card>
        </Box>
    );
}


export default ReturnProduct;
