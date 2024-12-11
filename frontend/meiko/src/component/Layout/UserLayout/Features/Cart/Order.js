import React, { useState } from "react";
import { Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './Order.module.css';

function Order({ selectedItems, total, voucherDetailIdd, coupon, productDetailsInfo, shippingFee, setLoading, selectedAddress, voucherId }) {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const navigate = useNavigate();
    const handlePaymentChange = (option) => {
        setSelectedPayment(selectedPayment === option ? null : option);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handlePlaceOrder = async () => {
        if (!selectedPayment) {
            alert("Vui lòng chọn hình thức thanh toán.");
            return;
        }
        if (!selectedAddress) {
            alert("Vui lòng nhập địa chỉ giao hàng.");
            return;
        }
    
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
            console.log("Bill Id:", billId);

            const changeStatusFromBillResponse = await fetch(`https://localhost:7172/api/Bills/change-status-from-bill/${billId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    statusType: 1,
                    note: "Bill Status",
                    staffWhoCreatedThis: localStorage.getItem("customerId")
                }),
            });
        
            if (!changeStatusFromBillResponse.ok) {
                console.error("API Error:", changeStatusFromBillResponse.status, changeStatusFromBillResponse.statusText);
                alert("Không thể cập nhật trạng thái hóa đơn.");
                return;
            }
            const changeStatusFromBillData = await changeStatusFromBillResponse.json();
            if (changeStatusFromBillData) {
                console.log("Cập nhật trạng thái hóa đơn thành công.");
            } else {
                alert("Không thể cập nhật trạng thái hóa đơn.");
            }
            
            const addAddressResponse = await fetch("https://localhost:7172/api/Bills/add-address-to-bill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    billId: billId,
                    recipientName: selectedAddress.recipientName,
                    phoneNumber: selectedAddress.phoneNumber,
                    addressDetail: selectedAddress.addressDetail,
                    city: selectedAddress.city,
                    district: selectedAddress.district,
                    ward: selectedAddress.ward,
                    status: 1
                }),
            });
            const addAddressData = await addAddressResponse.json();
            if (addAddressData) {
                console.log("Địa chỉ đã được cập nhật vào hóa đơn.");
            } else {
                alert("Không thể cập nhật địa chỉ vào hóa đơn.");
            }

            if (voucherDetailIdd) {
                const updateVoucherResponse = await fetch(`https://localhost:7172/api/Voucher/UpdateVoucherStatus/${voucherDetailIdd}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const updateVoucherData = await updateVoucherResponse.text();
                console.log("Update Voucher Response:", updateVoucherData);
                if (updateVoucherData) {
                    console.log("Voucher đã được cập nhật trạng thái.");
                } else {
                    alert("Không thể cập nhật trạng thái voucher.");
                }
            }
    
            setLoading(false);
            alert("Đặt hàng thành công!");
            localStorage.setItem("billCode", billCode);
            resetForm();
            navigate("/order-success");
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            setLoading(false); 
            console.error("Error placing order:", error);
            alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
        }
    };

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
