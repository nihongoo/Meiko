import { Box, Button, Dialog, FormControlLabel, InputAdornment, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useFetchData from "../../customHook/useFetchData";
import apiURL from "../../routes/API";

function CreateSaleDialog({ open, onClose, item, setItem, onCreate }) {
    const paginationModel = { page: 0, pageSize: 5 };
    const columns = [
        { field: "stt", headerName: "STT", width: 150 },
        { field: "name", headerName: "Tên sản phẩm", width: 450 },
    ];
    const { data: detail } = useFetchData(apiURL.productDetail.soldOff, (r) =>
        r.map((item, index) => ({
            ...item,
            stt: index + 1,
        }))
    )
    const handleSelectionChange = (newSelection) => {
        const selectedRows = newSelection.map((id) => detail.find((row) => row.id === id));
        const selectedProductDetailIds = selectedRows.map((row) => row.id);
        setItem({ ...item, selectedProductDetailIds });
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <Box p={3}>
                <Box textAlign="center" mb={3}>
                    <Typography variant="h5">Tạo mới đợt giảm giá</Typography>
                </Box>
                <Box display="flex" justifyContent="space-around" mb={3}>
                    <Box>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Mã"
                                variant="outlined"
                                size="small"
                                onChange={(e) =>
                                    setItem({ ...item, saleCode: e.target.value })
                                }
                            />
                            <TextField
                                label="Tên đợt giảm giá"
                                variant="outlined"
                                size="small"
                                onChange={(e) =>
                                    setItem({ ...item, name: e.target.value })
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
                                    endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Ngày bắt đầu"
                                type="date"
                                onChange={(e) =>
                                    setItem({ ...item, startDay: e.target.value })
                                }
                                InputLabelProps={{ shrink: true }} size="small"
                            />
                            <TextField
                                label="Ngày kết thúc"
                                type="date"
                                onChange={(e) =>
                                    setItem({ ...item, endDay: e.target.value })
                                }
                                InputLabelProps={{ shrink: true }} size="small"
                            />
                            <TextField
                                label="Mô tả"
                                variant="outlined"
                                size="small"
                                onChange={(e) =>
                                    setItem({ ...item, description: e.target.value })
                                }
                            />
                        </Box>
                        {/* <Box mt={3}>
                        <Typography>Trạng thái</Typography>
                        <RadioGroup
                            row
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Đang diễn ra" />
                            <FormControlLabel value={false} control={<Radio />} label="Đã kết thúc" />
                        </RadioGroup>
                    </Box> */}
                    </Box>
                    <Box flex={1} ml={3}
                        sx={{
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 300px)',
                            bgcolor: '#fff',
                            p: 2,
                            "&::-webkit-scrollbar": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#888",
                                borderRadius: "10px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "#555",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "#f1f1f1",
                            },
                        }}
                    >
                        <DataGrid
                            rows={detail}
                            columns={columns}
                            pageSize={5}
                            initialState={{ pagination: { paginationModel } }}
                            rowsPerPageOptions={[5, 10]}
                            checkboxSelection
                            autoHeight
                            onRowSelectionModelChange={(newSelection) =>
                                handleSelectionChange(newSelection)
                            }
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
                                minHeight: 500,
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

export default CreateSaleDialog