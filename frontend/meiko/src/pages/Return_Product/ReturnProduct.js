import React, { useState } from "react";
import { Box, Typography, TextField, Button, Card, Divider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGridApiContext } from "@mui/x-data-grid";
import NoBillDataFind from "./NoBillDataFind";
import useFetchData from "../../customHook/useFetchData";
import apiURL from "../../routes/API";
import { toast } from "react-toastify";

function ReturnProduct() {
    const [query, setQuery] = useState("");
    const [bill, setBill] = useState(null);
    const [selected, setSelected] = useState([])
    const [error, setError] = useState(null);
    const { data: Detail, refetch: refetchData } = useFetchData(`${apiURL.bill.list}?id=${bill?.id}`);


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
        }
    };

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
                    <TextField
                        variant="outlined"
                        placeholder="Nhập mã hóa đơn cần trả hàng"
                        size="small"
                        onChange={(e) => setQuery(e.target.value)}
                        sx={{ mr: 1, width: 400 }}
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
                        <ListReturn item={selected} />
                        <BillInfo></BillInfo>
                    </Box>
                </div>) : (
                    <NoBillDataFind />
                )}
            </Box>
        </Box>
    );
}

function ListReturn({ item }) {
    const paginationModel = { page: 0, pageSize: 5 };
    const rows = item.map((item, index) => ({
        ...item,
        id: item.id || index,
        total: item.quantity * item.price,
        note: ''
    }));

    const columns = [
        { field: "name", headerName: "Tên sản phẩm", flex: 1 },
        { field: "quantity", headerName: "Số lượng", flex: 1 },
        { field: "price", headerName: "Đơn giá", flex: 1 },
        { field: "total", headerName: "Tổng", flex: 1 },
        {
            field: "note",
            headerName: "Ghi chú",
            flex: 1,
            renderCell: (params) => (
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={params.row.note}
                />
            ),

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
                    id: row.id || index, // Gán id nếu không tồn tại
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


function BillInfo({ item }) {
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
                        <Typography variant="body1">Hoàng Hồng Khánh</Typography>
                    </Box>
                    <Box display="flex">
                        <Typography variant="body1" fontWeight="bold" color="textPrimary" mr={1}>
                            Địa chỉ:
                        </Typography>
                        <Typography variant="body1">
                            aaaaa, Xã Đông Hà, Huyện Quản Bạ, Tỉnh Hà Giang
                        </Typography>
                    </Box>
                </Box>
                <Divider
                    sx={{
                        my: 1, height: 2,
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
                        <Typography variant="body1">790.000VND</Typography>
                        <Typography variant="body1">790.000VND</Typography>
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    size="large"
                >
                    Trả hàng
                </Button>
            </Card>
        </Box>
    );
}

export default ReturnProduct;
