import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ChooseProduct from "./ChooseProduct";
import useFetchData from "../../customHook/useFetchData";
import apiURL from "../../routes/API";
import { toast } from "react-toastify";

function ListProduct({ bill }) {
  const [open, setOpen] = useState(false);
  const { data: Detail, refetch: refetchData } = useFetchData(`${apiURL.bill.list}?id=${bill.id}`);
  const listBill = Detail.map(item => ({
    ...item,
    totalPrice: item.price * item.quantity,
  }));

  const handleDeleteDetail = async (id) => {
    try {
      const res = await fetch(`${apiURL.bill.deleteDetail}${id}`, { method: 'DELETE' })
      const result = await res.json()

      if (res.ok) {
        refetchData()
        toast.success('Xóa thành công')
      }
      else {
        refetchData()
        toast.error(`Xóa thất bại ${result.msg}`)
      }
    } catch (error) {
      refetchData()
      toast.error('Lỗi: ' + error)
    }
  }
  let totalSum = 0;
  for (let item of listBill) {
    totalSum += item.totalPrice;
  }
  console.log(listBill);

  return (
    <Box minHeight={300} maxHeight={630}>
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
          onClick={() => {
            setOpen(true);
          }}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {/* Product List */}
      <Box
        maxHeight="calc(630px - 50px)" // Adjust height to exclude the header
        overflow="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px", // Độ rộng scrollbar
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888", // Màu thanh cuộn
            borderRadius: "10px", // Bo tròn
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555", // Màu khi hover
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // Nền thanh cuộn
          },
        }}
      >
        {listBill && listBill.length > 0 ? (
          listBill.map((item, index) => (
            <Box
              key={item.id || index}
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
              {/* <Checkbox sx={{ mx: { xs: 0, sm: 2 } }} /> */}

              {/* Product Image */}
              <Box
                component="img"
                src={item.imgUrl || "https://i.pinimg.com/736x/5f/5a/35/5f5a35f62906e1eb06aab42af1897838.jpg"}
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
                  {item.name || "Tên sản phẩm"}
                </Typography>
                <Typography color="error" fontWeight="bold">
                  {item.price ? `${item.price} VND` : `${item.price} VND`}
                </Typography>
                <Box
                  display="flex"
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                  mt={1}
                >
                  <Typography color="text.secondary">Size: {item.size}</Typography>
                  <Typography color="text.secondary" ml={2}>
                    Màu: {item.color}
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
                <Typography mx={1}>{item.quantity}</Typography>
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
                {item.totalPrice ? `${item.totalPrice} VND` : "0 VND"}
              </Typography>

              {/* Delete Button */}
              <IconButton color="error" onClick={() => handleDeleteDetail(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", width: "100%" }}
          >
            Không có sản phẩm nào.
          </Typography>
        )}
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Typography color="error" fontWeight="bold" sx={{ marginRight: 4 }}>
          {totalSum}
        </Typography>
      </Box>

      {/* Add Product Dialog */}
      <ChooseProduct
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        reloadList={refetchData}
        bill={bill}
      />
    </Box>
  );
}

export default ListProduct;
