import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ChooseProduct from "./ChooseProduct";

function ListProduct() {
    const [open, setOpen] = useState(false)
  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
      >
        <Typography variant="h5" fontWeight="bold" sx={{ mb: { xs: 1, sm: 0 } }}>
          Danh sách sản phẩm
        </Typography>
        <Button 
        variant="outlined" 
        color="success"
        onClick={()=>{setOpen(true)}}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {/* Product Item */}
      <Box
        display="flex"
        alignItems="center"
        p={2}
        border={1}
        borderRadius={2}
        borderColor="grey.300"
        mb={2}
        flexWrap="wrap"
      >
        {/* Checkbox */}
        <Checkbox sx={{ mx: { xs: 0, sm: 2 } }} />

        {/* Product Image */}
        <Box
          component="img"
          src="https://i.pinimg.com/736x/5f/5a/35/5f5a35f62906e1eb06aab42af1897838.jpg"
          alt="product"
          sx={{
            width: { xs: "100px", sm: "150px" },
            borderRadius: 2,
            mx: 2,
            mb: { xs: 2, sm: 0 },
          }}
        />

        {/* Product Details */}
        <Box
          flex={1}
          ml={2}
          sx={{
            textAlign: { xs: "center", sm: "left" },
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Typography fontWeight="bold" color="text.primary">
            Cn mel ngứa đích
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ textDecoration: "line-through" }}
          >
            100000VND
          </Typography>
          <Typography color="error" fontWeight="bold">
            99000VND
          </Typography>
          <Box
            display="flex"
            justifyContent={{ xs: "center", sm: "flex-start" }}
            mt={1}
          >
            <Typography color="text.secondary">Size: 40</Typography>
            <Typography color="text.secondary" ml={2}>
              Màu: Xám
            </Typography>
          </Box>
        </Box>

        {/* Quantity Controls */}
        <Box
          display="flex"
          alignItems="center"
          border={1}
          borderRadius="50px"
          borderColor="grey.300"
          px={2}
          mx={2}
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          <Button size="small">-</Button>
          <Typography mx={1}>3</Typography>
          <Button size="small">+</Button>
        </Box>

        {/* Total Price */}
        <Typography
          color="error"
          fontWeight="bold"
          mx={3}
          sx={{
            mb: { xs: 2, sm: 0 },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          99000VND
        </Typography>

        {/* Delete Button */}
        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
      <ChooseProduct 
      open={open}
      onClose={()=>{setOpen(false)}}
      />
    </Box>
  );
}

export default ListProduct;
