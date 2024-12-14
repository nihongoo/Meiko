import React, { useState } from "react";
import { Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './Order.module.css';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-material-ui/material-ui.css';

function Order({
    selectedItems, 
    total, 
    voucherDetailIdd, 
    coupon, 
    productDetailsInfo, 
    shippingFee, 
    setLoading, 
    selectedAddress, 
    voucherId 
}) {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const navigate = useNavigate();

    // Format tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Xử lý thay đổi hình thức thanh toán
    const handlePaymentChange = (option) => {
        setSelectedPayment(selectedPayment === option ? null : option);
    };

    // Tạo mã hóa đơn
    const generateBillCode = () => {
        const timestamp = new Date().getTime();
        const randomSuffix = Math.floor(Math.random() * 10000);
        return `BILL${timestamp}${randomSuffix}`;
    };

    // Xử lý đặt hàng
    const handlePlaceOrder = async () => {
        if (!selectedPayment) {
            alert("Vui lòng chọn hình thức thanh toán.");
            return;
        }
        if (!selectedAddress) {
            alert("Vui lòng nhập địa chỉ giao hàng.");
            return;
        }

        if (selectedPayment === "Online") {
            const result = await Swal.fire({
                title: 'Xác nhận thanh toán online',
                text: "Khi thanh toán online bạn không thể sửa số lượng hoặc địa chỉ của đơn hàng, bạn chắc chắn chứ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy bỏ',
            });
    
            if (!result.isConfirmed) {
                return;
            }
        }

        setLoading(true);

        try {
            setLoading(true);
    
            const generateBillCode = () => {
                const timestamp = new Date().getTime();
                const randomSuffix = Math.floor(Math.random() * 10000);
                return `BILL${timestamp}${randomSuffix}`;
            };
            const billCode = generateBillCode();
    
            const createBillResponse = await fetch("https://localhost:7172/api/Bills/create-bill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    billCode: billCode,
                    isShipping: true,
                    total: 0,
                    status: 1,
                    paymentAmount: 0,
                    shippingFee: shippingFee,
                    cartId: localStorage.getItem("cartId"),
                    customerId: localStorage.getItem("customerId"),
                    voucherId: voucherId,
                    staffId: null
                }),
            });
    
            const createBillData = await createBillResponse.json();
            const billId = createBillData.id;
            console.log(billId);
    
            if (!billId) {
                setLoading(false);
                alert("Không thể tạo hóa đơn. Vui lòng thử lại.");
                return;
            }

            // Cập nhật trạng thái hóa đơn và địa chỉ giao hàng
            await updateBillStatus(createBillData.id);
            await addAddressToBill(createBillData.id);
            
            // Cập nhật trạng thái voucher nếu có
            if (voucherDetailIdd) await updateVoucherStatus(voucherDetailIdd);

            setLoading(false);

            // Lưu mã hóa đơn vào localStorage
            localStorage.setItem("billCode", billCode);

            // Xử lý thanh toán online
            if (selectedPayment === "Online") {
                const paymentResponse = await createOnlinePayment(createBillData.id);
                if (paymentResponse.checkoutUrl) {
                    // Chuyển hướng đến trang thanh toán của PayOS
                    window.location.href = paymentResponse.checkoutUrl;
                } else {
                    alert("Có lỗi xảy ra khi tạo thanh toán.");
                }
            } else {
                resetForm();
                navigate("/order-success");
                window.dispatchEvent(new Event('cartUpdated'));
            }
        } catch (error) {
            setLoading(false);
            console.error("Error placing order:", error);
            alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
        }
    };

    // Tạo hóa đơn
    const createBill = async (billCode) => {
        const response = await fetch("https://localhost:7172/api/Bills/create-bill", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                billCode,
                isShipping: true,
                total: 0,
                status: 1,
                paymentAmount: 0,
                shippingFee,
                cartId: localStorage.getItem("cartId"),
                customerId: localStorage.getItem("customerId"),
                voucherId,
                staffId: null
            }),
        });
        return await response.json();
    };

    // Cập nhật trạng thái hóa đơn
    const updateBillStatus = async (billId) => {
        await fetch(`https://localhost:7172/api/Bills/change-status-from-bill/${billId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                statusType: 1,
                note: "Bill Status",
                staffWhoCreatedThis: localStorage.getItem("customerId"),
            }),
        });
    };

    // Thêm địa chỉ vào hóa đơn
    const addAddressToBill = async (billId) => {
        await fetch("https://localhost:7172/api/Bills/add-address-to-bill", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                billId,
                recipientName: selectedAddress.recipientName,
                phoneNumber: selectedAddress.phoneNumber,
                addressDetail: selectedAddress.addressDetail,
                city: selectedAddress.city,
                district: selectedAddress.district,
                ward: selectedAddress.ward,
                status: 1,
            }),
        });
    };

    // Cập nhật trạng thái voucher
    const updateVoucherStatus = async (voucherDetailIdd) => {
        await fetch(`https://localhost:7172/api/Voucher/UpdateVoucherStatus/${voucherDetailIdd}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });
    };

    // Tạo thanh toán online
    const createOnlinePayment = async (billId) => {
        const response = await fetch(`https://localhost:7172/api/Bills/CreatePaymentWithPayOS/${billId}?descrtiption=Thanh%20toán%20đơn%20hàng`, {
            method: 'POST',
        });
        return await response.json();
    };

    // Xác nhận thanh toán online
    const confirmOnlinePayment = async (billId) => {
        const response = await fetch(`https://localhost:7172/api/Bills/confirm-payment/${billId}`, {
            method: 'GET',
        });
        return await response.json();
    };

    // Reset form sau khi đặt hàng
    const resetForm = () => {
        setSelectedPayment(null);
    };

    return (
        <div className={styles.orderContainer}>
            <div className={styles.reviewSection}>
                <h1 className={styles.title}>ĐƠN HÀNG CỦA BẠN</h1>
                <hr className={styles.titleSeparator} />
                {selectedItems.map((item, index) => (
                    <div key={item.id} className={styles.productItem}>
                        <span className={styles.itemName}>
                            {index + 1}. {productDetailsInfo[index]} (x{item.quantity})
                        </span>
                        <span className={styles.itemPrice}>
                            {formatCurrency(
                                (item.productDetails.sale_products.length > 0
                                    ? item.productDetails.sale_products[0].discountedPrice
                                    : item.productDetails.price) * item.quantity
                            )}
                        </span>
                    </div>
                ))}
                <hr className={styles.separator} />
                {coupon && (
                    <div className={styles.productItem}>
                        <span className={styles.itemName}>Mã giảm giá:</span>
                        <span className={styles.itemPrice}>{coupon.voucherCode} - {coupon.value}% giảm</span>
                    </div>
                )}
                <hr className={styles.separator} />
                <div className={styles.totalSection}>
                    <div className={styles.totalRow}>
                        <span className={styles.itemName}>Tổng tiền</span>
                        <span className={styles.totalPrice}>{formatCurrency(total)}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span className={styles.itemName}>Phí giao hàng</span>
                        <span className={styles.totalPrice}>{formatCurrency(shippingFee)}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span className={styles.itemName}>Tổng thanh toán</span>
                        <span className={styles.totalPrice}>{formatCurrency(total + shippingFee)}</span>
                    </div>
                </div>
                <hr className={styles.separator} />
                <span className={styles.paymentLabel}>Hình thức thanh toán</span>
                <div className={styles.paymentOptions}>
                    <Checkbox
                        checked={selectedPayment === "COD"}
                        onChange={() => handlePaymentChange("COD")}
                    />
                    <span className={styles.paymentOption}>Thanh toán khi nhận hàng</span>
                </div>
                <div className={styles.paymentOptions}>
                    <Checkbox
                        checked={selectedPayment === "Online"}
                        onChange={() => handlePaymentChange("Online")}
                    />
                    <span className={styles.paymentOption}>Thanh toán online</span>
                </div>
                <button onClick={handlePlaceOrder} className={styles.orderButton}>Đặt hàng</button>
            </div>
        </div>
    );
}

export default Order;
