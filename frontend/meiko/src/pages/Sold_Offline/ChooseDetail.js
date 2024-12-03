import { Box, Button, Dialog, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

function ChooseDetail({ open, onClose, item }) {
    const [quantity, setQuantity] = useState(3);

    const handleIncrease = () => {
        setQuantity((prev) => Math.min(prev + 1, 100));
    };

    const handleDecrease = () => {
        setQuantity((prev) => Math.max(prev - 1, 1));
    };
    const handleConfirm = () =>{
        onClose()
    }
console.log(item);

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
                    <Typography>{'Loại: '+item.categories.name}</Typography>
                    <Typography>{'Thương hiệu: '+item.brands.name}</Typography>
                </Box>

                {/* Price details */}
                {/* <Typography variant="body2" color="textSecondary" sx={{ textDecoration: "line-through", mt: 2 }}>
                    100000VND
                </Typography> */}
                <Typography variant="h6" color="error" sx={{ mt: 1 }}>
                    {item.price+'VND'}
                </Typography>

                {/* Quantity control */}
                <Box display={'flex'} alignItems={'center'}>
                    <Typography variant="h6" color="error">Số lượng: 100</Typography>
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
