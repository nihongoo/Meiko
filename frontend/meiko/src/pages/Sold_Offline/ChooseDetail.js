import { Box, Button, Dialog, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import apiURL from "../../Routes/API";
import { toast } from "react-toastify";

function ChooseDetail({ open, onClose, item, reloadList, bill }) {
    const [quantity, setQuantity] = useState(1);
    const handleIncrease = () => {
        setQuantity((prev) => Math.min(prev + 1, item.quantity));
    };

    const handleDecrease = () => {
        setQuantity((prev) => Math.max(prev - 1, 1));
    };
    const handleConfirm = async () => {
        const postItem = {
            quantity: quantity,
            status: 1,
            billId: bill.id,
            productDetailId: item.id
        }
        try {
            const res = await fetch(apiURL.bill.addToBill, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postItem)
            })
            if (res.ok) {
                toast.success('Thêm sản phẩm thành công')
                reloadList()
            }
            else {
                toast.error('Thêm sản phẩm thất bại')
            }
        } catch (error) {

        }
        onClose()
    }
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Box padding={3}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{item.name}</Typography>
                    <IconButton onClick={onClose} color="error">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Product details */}
                <Box mt={2} display="flex" justifyContent="space-around">
                    <Typography>{'Loại: ' + item.category}</Typography>
                    <Typography>{'Thương hiệu: ' + item.brand}</Typography>
                </Box>

                {/* Price details */}
                {/* <Typography variant="body2" color="textSecondary" sx={{ textDecoration: "line-through", mt: 2 }}>
                    100000VND
                </Typography> */}
                <Typography variant="h6" color="error" sx={{ mt: 1 }}>
                    {item.price + 'VND'}
                </Typography>

                {/* Quantity control */}
                <Box display={'flex'} alignItems={'center'}>
                    <Typography variant="h6" color="error">{'Số lượng: ' + item.quantity}</Typography>
                    <Box display="flex" alignItems="center" border={1} borderRadius="50px" borderColor="grey.300" px={2} mx={2}>
                        <Button onClick={handleDecrease} size="small">-</Button>
                        <Typography mx={1}>{quantity}</Typography>
                        <Button onClick={handleIncrease} size="small">+</Button>
                    </Box>
                </Box>

                {/* Confirmation button */}
                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button variant="outlined" color="success" onClick={handleConfirm}>
                        Xác nhận
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}

export default ChooseDetail;
