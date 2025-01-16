import React, { useContext, useEffect, useState } from "react";
import {
    Dialog,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Grid,
    Box,
    Typography,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import apiURL from "../../routes/API";
import useFetchData from "../../customHook/useFetchData";
import moment from 'moment'
import { toast } from "react-toastify";
import NotePrevStatus from "./NotePrevStatus";
import { useNavigate } from "react-router-dom";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';

function StateBill({ open, onClose, item, print, setItem, reloadBill }) {
    const paginationModel = { page: 0, pageSize: 5 };
    const [currentStatus, setCurrentStatus] = useState(item?.status);
    const { data: Detail } = useFetchData(`${apiURL.bill.list}?id=${item?.id}`);
    const { data: hist, refetch } = useFetchData(`${apiURL.bill.statusHis}${item?.id}`)
    const { data: payHis, refetch: reloadPaydata } = useFetchData(`${apiURL.payHistory.byBillId}${item?.id}`, (r) => {
        return r.map((item) => ({
            ...item,
            createdDate: moment(item.createdDate).format('DD-MM-YYYY HH:mm'),
            amount: item.amount + ' VND',
        }))
    })
    const { data: listRefund } = useFetchData(`${apiURL.bill.listRefund}?id=${item?.id}`, (r) => {
        return r.map((item) => ({
            ...item,
            amountRefund: new Intl.NumberFormat('vi-VN').format(item.amountRefund) + ' VND',
            createTime: moment(item.createTime).format('DD-MM-YYYY HH:mm'),
            status: item?.status === 1 ? 'Chờ xử lý' : item?.status === 2 ? 'Chấp nhận hoàn trả' : 'Từ chối hoàn trả'
        }));
    })
    useEffect(() => {
        setCurrentStatus(item?.status);
    }, [item]);

    const getNextSteps = (billType, currentStatus) => {
        switch (billType) {
            case 'POS':
                return [
                    { from: 'Tạo hóa đơn', to: 'Chờ xử lý' },
                    { from: 'Chờ xử lý', to: 'Đã hủy' },
                    { from: 'Chờ xử lý', to: 'Hoàn thành' }
                ];

            case 'COD':
                return [
                    { from: 'Tạo hóa đơn', to: 'Chờ xử lý' },
                    { from: 'Chờ xử lý', to: 'Đang chuẩn bị hàng' || 'Chờ có hàng' },
                    { from: 'Chờ có hàng', to: 'Đang chuẩn bị hàng' || 'Đã hủy' },
                    { from: 'Đang chuẩn bị hàng', to: 'Đang giao hàng' },
                    { from: 'Đang giao hàng', to: 'Đã giao tới' || 'Đã hủy' },
                    { from: 'Đã giao tới', to: 'Đã thanh toán' },
                    { from: 'Đã thanh toán', to: 'Hoàn thành' }
                ];
            case 'Online':
                return [
                    { from: 'Tạo hóa đơn', to: 'Đã thanh toán' },
                    { from: 'Đã thanh toán', to: 'Chờ xử lý' },
                    { from: 'Chờ xử lý', to: 'Đang chuẩn bị hàng' || 'Chờ có hàng' },
                    { from: 'Chờ có hàng', to: 'Đang chuẩn bị hàng' || 'Đã hủy' },
                    { from: 'Đang chuẩn bị hàng', to: 'Đang giao hàng' },
                    { from: 'Đang giao hàng', to: 'Đã giao tới' || 'Đã hủy' },
                    { from: 'Đã giao tới', to: 'Hoàn thành' }
                ];
        }
    };

    const sortedStatusHistories = hist
        ? hist.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate))
        : [];
    const initialStep = {
        label: "Tạo hoá đơn",
        description: moment(item?.createTime).format('DD-MM-YYYY HH:mm')
    };
    const steps = [
        initialStep,
        ...sortedStatusHistories.map(history => ({
            label: history.statusType,
            description: moment(history.createdDate).format('DD-MM-YYYY HH:mm')
        }))
    ];
    const totalPaid = item?.paymentHistories?.reduce((acc, item) => acc + item.amount, 0) || 0;
    const [prev, setPrev] = useState(false)
    const [note, setNote] = useState('')
    const storedTabs = localStorage.getItem('tabs');
    const navigate = useNavigate();
    const isValidNextStatus = () => {
        const nextSteps = getNextSteps(item?.billType, item?.status);
        const currentStep = nextSteps?.find(step => step.from === item?.status);
        return !!currentStep; // Returns true if valid next step exists
    };
    const nextStepBtn = [
        'Tạo hoá đơn',
        'Chờ xử lý',
        'Đang chuẩn bị hàng',
        'Đang giao hàng',
        'Đã giao tới',
    ]
    const closeBtn = [
        'Chờ xử lý',
        'Chờ có hàng',
        'Đang giao hàng',
    ]
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo'));
    const refundColumns = [
        { field: "name", headerName: "Tên sản phẩm", flex: 1 },
        { field: "price", headerName: "Giá", flex: 1 },
        { field: "quantity", headerName: "Số lượng", flex: 1 },
        { field: "note", headerName: "Ghi chú", flex: 1 },
    ];
    const paymentColumns = [
        { field: "amount", headerName: "Số tiền", flex: 1 },
        { field: "createdDate", headerName: "Thời gian", flex: 1 },
        { field: "paymentMethod", headerName: "PTTT", flex: 1 },
        { field: "status", headerName: "Trạng thái", flex: 1 },
    ];
    const getStatusTypeValue = (status) => {
        const statusMapping = {
            "Tạo hoá đơn": 0,
            "Chờ thanh toán": 1,
            "Chờ xử lý": 2,
            "Đang chuẩn bị hàng": 3,
            "Đang giao hàng": 4,
            "Đã giao tới": 5,
            "Hoàn thành": 6,
            "Chờ có hàng": 7,
            "Hoàn trả": 8,
            "Đã hủy": 9,
            "Đã thanh toán": 10,
        };
        return statusMapping[status];
    };

    const handleNext = async () => {
        try {
            const nextSteps = getNextSteps(item.billType, currentStatus);
            const currentStep = nextSteps.find(step => step.from === currentStatus);

            if (!currentStep) {
                throw new Error("Không thể chuyển trạng thái tiếp theo");
            }
            if (item.billType === "COD" &&
                currentStatus === "Đã giao tới" &&
                currentStep.to === "Đã thanh toán") {
                const paymentResponse = await fetch(`${apiURL.bill.payForCustomer}${item.id}?paymentAmount=${item.payAmount}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!paymentResponse.ok) {
                    throw new Error("Không thể tạo lịch sử thanh toán COD");
                }
                await reloadPaydata();
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            const payload = {
                statusType: getStatusTypeValue(currentStep.to),
                note: `Chuyển từ ${currentStep.from} sang ${currentStep.to}`,
                staffWhoCreatedThis: staffInfo.id
            };
            console.log(payload);


            const response = await fetch(`${apiURL.bill.changeStatus}${item.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const msg = await response.json();
                const firstError = Object.entries(msg.errors)[0];
                if (firstError) {
                    const [field, messages] = firstError;
                    toast.error(messages[0]);
                    console.log(field);
                }
                return;
            }

            setCurrentStatus(currentStep.to);
            reloadBill();
            refetch();
            toast.success(`Đã chuyển sang trạng thái ${currentStep.to}`);

        } catch (error) {
            console.error("Error details:", error);
            toast.error(error.message);
        }
    };
    
    const handleClose = async () => {
        try {
            // Define status transitions for close button
            const closeTransitions = {
                'COD': {
                    'Chờ xử lý': { nextStatus: 7, statusName: 'Chờ có hàng' },  // 2 = ChoCoHang
                    'Chờ có hàng': { nextStatus: 9, statusName: 'Đã hủy' }, // 3 = DangChuanBiHang
                    'Đang giao hàng': { nextStatus: 9, statusName: 'Đã hủy' } // 9 = DaHuy
                },
                'Online': {
                    'Chờ xử lý': { nextStatus: 7, statusName: 'Chờ có hàng' },  // 2 = ChoCoHang
                    'Chờ có hàng': { nextStatus: 9, statusName: 'Đã hủy' }, // 3 = DangChuanBiHang
                    'Đang giao hàng': { nextStatus: 9, statusName: 'Đã hủy' } // 9 = DaHuy
                },
                'POS': {
                    'Chờ xử lý': { nextStatus: 9, statusName: 'Đã hủy' } // 9 = DaHuy
                }
            };

            const transition = closeTransitions[item.billType]?.[currentStatus];

            if (!transition) {
                toast.error('Không thể chuyển trạng thái ở bước này');
                return;
            }

            const payload = {
                statusType: transition.nextStatus,
                note: `Chuyển từ ${item.status} sang ${transition.statusName}`,
                staffWhoCreatedThis: staffInfo.id
            };

            const response = await fetch(`${apiURL.bill.changeStatus}${item.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Lỗi khi chuyển trạng thái');
            }

            // Close tab if POS bill is cancelled
            if (item.billType === 'POS' && transition.statusName === 'Đã hủy') {
                const storedTabs = JSON.parse(localStorage.getItem('tabs') || '[]');
                const storedBills = JSON.parse(localStorage.getItem('bills') || '[]');

                const billIndex = storedBills.findIndex(b => b.id === item.id);

                if (billIndex !== -1) {
                    // Remove bill and tab
                    const newTabs = storedTabs.filter((_, index) => index !== billIndex);
                    const newBills = storedBills.filter((_, index) => index !== billIndex);

                    localStorage.setItem('tabs', JSON.stringify(newTabs));
                    localStorage.setItem('bills', JSON.stringify(newBills));
                }
            }

            setCurrentStatus(transition.statusName);
            await reloadBill();
            await refetch();
            onClose();
            toast.success(`Đã chuyển sang ${transition.statusName}`);

        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Lỗi khi chuyển trạng thái");
        }
    };
    const calculatePaymentAmount = (item) => {
        const rawAmount = item.total || "0";
        const numericAmount = parseFloat(rawAmount.replace(/[^\d.]/g, ""));
        return numericAmount;
    };

    const handlePrev = async () => {
        try {
            if (note.length < 30) {
                toast.error("Ghi chú phải có tối thiểu 30 ký tự.");
                return;
            }

            const statusMapping = {
                "Tạo hoá đơn": 0,
                "Chờ thanh toán": 1,
                "Chờ xử lý": 2,
                "Đang chuẩn bị hàng": 3,
                "Đang giao hàng": 4,
                "Đã giao tới": 5,
                "Hoàn thành": 6,
                "Chờ có hàng": 7,
                "Hoàn trả": 8,
                "Đã hủy": 9,
                "Đã thanh toán": 10,
            };
            const lastStatus = sortedStatusHistories[sortedStatusHistories.length - 1];
            const currentStatus = statusMapping[lastStatus.statusType];
            const prevStatus = currentStatus - 1;

            if (prevStatus < 0) {
                throw new Error("Không thể quay lại trạng thái trước đó");
            }

            const statusType = Object.keys(statusMapping).find(
                (key) => statusMapping[key] === prevStatus
            );

            if (!statusType) {
                throw new Error("Trạng thái trước đó không hợp lệ");
            }

            const payload = {
                statusType: prevStatus,
                note: note,
                staffWhoCreatedThis: staffInfo.id,
            };

            const response = await fetch(`${apiURL.bill.prevStatus}${item.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                reloadBill();
                refetch();
                toast.success(`Trạng thái đã thay đổi thành "${statusType}"`);
            } else {
                toast.error("Không thể thay đổi trạng thái");
            }

        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái:", error);
            toast.error("Không thể thay đổi trạng thái");
        }
    };
    const handleAccept = async (id) => {
        try {
            const accept = {
                id: id,
                staff: staffInfo.id
            }
            const res = await fetch(`${apiURL.bill.accept}${accept.id}/accept?staff=${accept.staff}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (res.ok) {
                onClose()
                reloadBill()
                toast.success('Đã chấp nhận hoàn trả đơn hàng')
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
    const handleReject = async (id) => {
        try {
            const accept = {
                id: id,
                staff: staffInfo.id
            }
            const res = await fetch(`${apiURL.bill.accept}${accept.id}/reject?staff=${accept.staff}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (res.ok) {
                onClose()
                reloadBill()
                toast.success('Đã từ chối hoàn trả đơn hàng')
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
    const openBill = async (billId) => {
        if (!billId) {
            console.log('Không có id hóa đơn');
            return;
        }
        try {
            const currentBills = JSON.parse(localStorage.getItem('bills')) || [];
            const currentTabs = JSON.parse(localStorage.getItem('tabs')) || [];

            // Kiểm tra nếu billId đã tồn tại
            const billExists = currentBills.some(bill => bill.id === billId);

            if (!billExists) {
                // Thêm bill mới nếu chưa tồn tại
                const updatedBills = [...currentBills, { id: billId }];
                localStorage.setItem('bills', JSON.stringify(updatedBills));

                const newTabs = [...currentTabs, `Hóa đơn ${item?.billCode}`];
                localStorage.setItem('tabs', JSON.stringify(newTabs));
            } else {
                console.log(`Hóa đơn với ID ${billId} đã tồn tại`);
            }

            // Điều hướng tới trang
            navigate('/soldoffline');
        } catch (error) {
            console.error('Lỗi khi mở hóa đơn: ', error);
            toast.error('Không thể mở hóa đơn');
        }
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth >
            <NotePrevStatus
                item={note}
                setItem={setNote}
                open={prev}
                onClose={() => { setPrev(false) }}
                onSave={handlePrev}
            >
            </NotePrevStatus>
            <Box display="flex" sx={{
                height: '100%',
                width: '100%'
            }}>
                {/* Stepper Section */}
                <Box
                    bgcolor={'#f8f8f8'}
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minWidth: 256
                    }}
                >
                    {/* Stepper Section */}
                    <Box display="flex">
                        <Box flex={1}
                            sx={{
                                minHeight: '519px',
                            }}
                        >
                            <Stepper
                                nonLinear
                                orientation="vertical"
                                sx={{
                                    overflowY: 'auto',
                                    maxHeight: 'calc(100vh - 300px)',
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
                                {steps.map((step, index) => (
                                    <Step key={index} active={true} completed={true}>
                                        <StepLabel>{step.label}</StepLabel>
                                        <StepContent>
                                            <Typography>{step.description}</Typography>
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            ml={2}
                            flex={1}
                        >
                            <Button
                                variant="contained"
                                onClick={() => { setPrev(true) }}
                                disabled={item?.billType === 'POS' || !nextStepBtn.includes(item?.status) || steps[steps.length - 1]?.label === 'Chờ xử lý'}
                                sx={{ mb: 1 }}
                            >
                                <KeyboardArrowUpIcon />
                            </Button>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={item?.billType === 'POS' || !isValidNextStatus() || currentStatus === 'Hoàn thành'}
                                >
                                    <KeyboardArrowDownIcon />
                                </Button>
                                {closeBtn.includes(currentStatus) && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleClose}
                                    >
                                        <CloseIcon />
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>


                    {/* Summary Section */}
                    <Box mt={2} pt={2} borderTop={`1px solid rgba(0, 0, 0, 0.12)`}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">Tổng tiền hàng:</Typography>
                                <Typography variant="body1">Phí vận chuyển:</Typography>
                                <Typography variant="body1">Tổng thanh toán:</Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                                <Typography variant="body1">{item?.total || '0'}</Typography>
                                <Typography variant="body1">{item?.shippingFee || '0'}VND</Typography>
                                <Typography variant="body1">{totalPaid || '0'}VND</Typography>
                            </Grid>
                        </Grid>
                        <Box className='justify-content-between d-flex'>
                            {steps[steps.length - 1]?.label !== 'Hoàn thành' && item?.billType === 'POS' && (
                                <Button onClick={() => openBill(item?.id)}>
                                    Tiếp tục bán
                                </Button>
                            )}
                            <Button variant="outlined" onClick={() => { print(item) }}>
                                In
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Main Content Section */}
                <Box sx={{ flex: 2, p: 2 }}>
                    {/* Bill Info Section */}
                    <Box mb={2} textAlign="center">
                        <Typography variant="h5">{`Đơn hàng - ${item?.billCode || 'N/A'}`}</Typography>
                    </Box>

                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography>{`Mã hóa đơn: ${item?.billCode || 'N/A'}`}</Typography>
                            <Typography>{`Tên khách hàng: ${item?.customerName || 'N/A'}`}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>{`Loại hóa đơn: ${item?.billType || 'N/A'}`}</Typography>
                            <Typography>{`Trạng thái: ${item?.status || 'N/A'}`}</Typography>
                        </Grid>
                    </Grid>

                    {/* Overflow Section for Payment History and Product List */}
                    <Box sx={{
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
                    }}>
                        {/* Payment History */}
                        <Box mb={2}>
                            <Typography variant="h6" gutterBottom>
                                Lịch sử thanh toán
                            </Typography>
                            <DataGrid
                                rows={payHis}
                                columns={paymentColumns}
                                autoHeight
                                disableSelectionOnClick
                                initialState={{ pagination: { paginationModel } }}
                                pageSize={5}
                                pageSizeOptions={[5, 10]}
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: 'none',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        borderBottom: 'none',
                                    },
                                    backgroundColor: '#fff',
                                    minHeight: 250,
                                }}
                            />
                        </Box>

                        {/* Product List */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Danh sách sản phẩm
                            </Typography>
                            <Box flexWrap="wrap" gap={2}>
                                {Detail && Detail.map((item) => (
                                    <Box
                                        mb={2}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flex: 1,
                                            gap: 2,
                                            p: 1,
                                            border: "1px solid rgba(0, 0, 0, 0.12)",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <img
                                            width={100}
                                            src={item?.imgUrl}
                                            alt="Product"
                                        />
                                        <Box>
                                            <Typography>{item?.name}</Typography>
                                            <Typography>Số lượng:{item?.quantity}</Typography>
                                            <Typography>Màu: {item?.color}</Typography>
                                            <Typography>Size: {item?.size}</Typography>
                                            <Typography>Giá: {item?.price}VND</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        {listRefund && listRefund.length > 0 ? (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Yêu cầu trả hàng
                                </Typography>
                                {listRefund.map((refund, index) => (
                                    <div key={refund.id}>
                                        <Box>
                                            <Grid container spacing={2} mb={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography>{`Tổng hoàn trả: ${refund?.amountRefund || 'N/A'}`}</Typography>
                                                    <Typography>{`Thời gian tạo yêu cầu: ${refund?.createTime || 'N/A'}`}</Typography>
                                                    <Typography>{`Trạng thái: ${refund?.status || 'N/A'}`}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    {refund.status === 'Chờ xử lý' && (
                                                        <>
                                                            <Button onClick={() => handleAccept(refund.id)} className="me-3">Chấp nhận</Button>
                                                            <Button onClick={() => handleReject(refund.id)}>Từ chối</Button>
                                                        </>
                                                    )}                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <DataGrid
                                            rows={refund.refundItems.map((item, i) => ({
                                                ...item,
                                                id: item.id,
                                                quantity: item.quantity === 0 ? i : item.quantity,
                                            }))}
                                            columns={refundColumns}
                                            autoHeight
                                            disableSelectionOnClick
                                            initialState={{ pagination: { paginationModel } }}
                                            pageSize={5}
                                            pageSizeOptions={[5, 10]}
                                            sx={{
                                                border: 'none',
                                                '& .MuiDataGrid-cell': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiDataGrid-columnHeaders': {
                                                    borderBottom: 'none',
                                                },
                                                backgroundColor: '#fff',
                                                minHeight: 250,
                                            }}
                                        />
                                    </div>
                                ))}
                            </Box>
                        ) : (
                            <></>
                        )}
                    </Box>
                </Box>
            </Box>
        </Dialog >
    );
}

export default StateBill;