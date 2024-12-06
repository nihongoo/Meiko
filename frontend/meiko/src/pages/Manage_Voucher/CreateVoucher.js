import React from "react";
import {
    Box,
    Button,
    Dialog,
    TextField,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useFetchData from "../../customHook/useFetchData";
import apiURL from "../../routes/API";

function CreateVoucher({ item, setItem, open, onClose, onCreate }) {
    const paginationModel = { page: 0, pageSize: 5 };
    const { data: rows } = useFetchData(apiURL.user.all)
    const handleSelectionChange = (newSelection) => {
        const selectedRows = newSelection.map((id) => rows.find((row) => row.id === id));
        const customerIds = selectedRows.map((row) => row.id);
        setItem({ ...item, customerIds });
    };
    const columns = [
        { field: "name", headerName: "Tên", width: 150 },
        { field: "phoneNumber", headerName: "Số điện thoại", width: 150 },
        { field: "email", headerName: "Email", width: 200 },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <Box p={3}>
                <Box textAlign="center" mb={3}>
                    <Typography variant="h5">Tạo mới phiếu giảm giá</Typography>
                </Box>
                <Box display="flex" justifyContent="space-around" mb={3}>
                    <Box>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Mã"
                                variant="outlined"
                                size="small"
                                onChange={(e) =>
                                    setItem({ ...item, voucherCode: e.target.value })
                                }
                            />
                            <TextField
                                label="Giá trị"
                                variant="outlined"
                                size="small"
                                type="number"
                                onChange={(e) =>
                                    setItem({ ...item, value: e.target.value })
                                }
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">VND</InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Điều kiện"
                                variant="outlined"
                                size="small"
                                type="number"
                                onChange={(e) =>
                                    setItem({ ...item, minimumOrderAmount: e.target.value })
                                }
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">VND</InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Số lượng"
                                variant="outlined"
                                size="small"
                                type="number"
                                onChange={(e) =>
                                    setItem({ ...item, quantity: e.target.value })
                                }
                            />
                            <TextField
                                label="Ngày bắt đầu"
                                type="date"
                                InputLabelProps={{ shrink: true }} size="small"
                                onChange={(e) =>
                                    setItem({ ...item, startDay: e.target.value })
                                }
                            />
                            <TextField
                                label="Ngày kết thúc"
                                type="date"
                                InputLabelProps={{ shrink: true }} size="small"
                                onChange={(e) =>
                                    setItem({ ...item, endDay: e.target.value })
                                }
                            />
                        </Box>
                        <Box mt={3}>
                            <Typography>Kiểu</Typography>
                            <RadioGroup
                                row
                                value={item.customerIds && item.customerIds.length > 0 ? false : true}
                                onChange={(e) => setItem({ ...item, isPublic: e.target.value === 'true' })}
                            >
                                <FormControlLabel value={true} control={<Radio />} label="Công khai" />
                                <FormControlLabel value={false} control={<Radio />} label="Cá nhân" />
                            </RadioGroup>
                        </Box>
                    </Box>
                    <Box flex={1} ml={3}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            initialState={{ pagination: { paginationModel } }}
                            rowsPerPageOptions={[5, 10]}
                            autoHeight
                            onRowSelectionModelChange={(newSelection) =>
                                handleSelectionChange(newSelection)
                            }
                            checkboxSelection
                            pageSizeOptions={[5, 10]}
                            disableRowSelectionOnClick
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
                    </Box>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="success" onClick={onCreate}>
                        Thêm mới
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}

export default CreateVoucher;
