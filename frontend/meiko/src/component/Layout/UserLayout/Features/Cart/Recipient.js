import React, { useState, useEffect } from "react";
import RecipientModal from "./RecipientModal"; // Modal tạo mới hoặc cập nhật
import { Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './Recipient.module.css';

function Recipient({ setShippingFee, onSelectAddress }) {
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const customerId = localStorage.getItem("customerId");
    const [isHovered, setIsHovered] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOpenModal = (address = null) => {
        setSelectedAddress(address);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAddress(null);
    };

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetch(`https://localhost:7172/api/Address/${customerId}`);
                if (response.ok) {
                    const data = await response.json();
                    setAddresses(data);
                } else {
                    console.error('Failed to fetch addresses');
                }
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
    }, [customerId]);

    // Hàm tính tiền ship
    const calculateShippingFee = async (toCity, toDistrict, toWard) => {
        const fromCity = "Hà Nội";
        const fromDistrict = "Quận Nam Từ Liêm";
        try {
            const response = await fetch('https://localhost:7172/api/Shipping/calculate-shipping-fee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fromCityName: fromCity,
                    fromDistrictName: fromDistrict,
                    toCityName: toCity,
                    toDistrictName: toDistrict,
                    toWardName: toWard,
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                setShippingFee(data.fee); 
                if (data.fee !== null) {
                    setShippingFee(data.fee); 
                } else {
                    console.error('API trả về phí vận chuyển là null');
                }
            } else {
                console.error('API không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        } finally {
            setLoading(false); 
        }
    };
    
    const handleSelectChange = (event, address) => {
        setSelectedAddressId(address.id);
        setSelectedAddress(address);
        onSelectAddress(address);
    
        // Gọi API tính phí vận chuyển khi chọn địa chỉ
        if (address) {
            calculateShippingFee(
                address.city, 
                address.district, 
                address.ward
            );
        }
    };
    

    const handleUpdateAddress = async (updatedAddress) => {
        try {
            const response = await fetch(`https://localhost:7172/api/Address/${updatedAddress.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAddress),
            });
            if (response.ok) {
                const data = await response.json();
                setAddresses((prevAddresses) =>
                    prevAddresses.map((address) =>
                        address.id === updatedAddress.id ? data : address
                    )
                );
                setSelectedAddress(null);
            } else {
                console.error('Failed to update address');
            }
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            const response = await fetch(`https://localhost:7172/api/Address/${addressId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setAddresses((prevAddresses) =>
                    prevAddresses.filter((address) => address.id !== addressId)
                );
            } else {
                console.error('Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleAddNewAddress = (newAddress) => {
        setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    };

    return (
        <div className={styles.recipientContainer}>
            <h1 className={styles.title}>Thông tin người nhận</h1>
            <hr className={styles.separator} />
            <div className={styles.formGroup}>
                <div className={styles.formRow}>
                    <label className={styles.label}>Tên người nhận:</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={selectedAddress ? selectedAddress.recipientName : ''}
                        readOnly
                    />
                </div>
                <div className={styles.formRow}>
                    <label className={styles.label}>Số điện thoại:</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={selectedAddress ? selectedAddress.phoneNumber : ''}
                        readOnly
                    />
                </div>
            </div>
            <div className={styles.formGroup}>
                <div className={styles.formRow}>
                    <label className={styles.label}>Email:</label>
                    <input
                        type="email"
                        className={styles.input}
                        value={selectedAddress ? selectedAddress.email : ''}
                        readOnly
                    />
                </div>
            </div>

            {/* Thêm chọn địa chỉ */}
            <div className={styles.addressSection}>
                <span className={styles.addressTitle}>Địa chỉ nhận hàng</span>
                <button className={styles.addAddressButton} onClick={() => handleOpenModal()}>+ Thêm địa chỉ nhận hàng mới</button>
                <RecipientModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    selectedAddress={selectedAddress}
                    onUpdate={handleUpdateAddress}
                    onAddNew={handleAddNewAddress}
                />
            </div>
            <div
                className={`${styles.scrollableAddresses} ${isHovered ? styles.active : ""}`}
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
            >
                {addresses.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span>Chưa có địa chỉ nào</span>
                    </div>
                ) : (
                    addresses.map((address) => (
                        <div key={address.id} className={styles.addressGroup}>
                            <div className={styles.checkboxGroup}>
                                <Checkbox
                                    className={styles.checkbox}
                                    checked={selectedAddressId === address.id}
                                    onChange={(event) => handleSelectChange(event, address)}
                                />
                                <div className={styles.addressDetail}>
                                    <span className={styles.addressLine}>Địa chỉ: {address.addressDetail}</span>
                                    <span className={styles.addressLine}>{address.ward}, {address.district}, {address.city}</span>
                                </div>
                            </div>
                            <div className={styles.actionButtons}>
                                <button className={styles.updateButton} onClick={() => handleOpenModal(address)}>Cập nhật</button>
                                <button 
                                    className={styles.deleteButton} 
                                    onClick={() => handleDeleteAddress(address.id)} >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Ghi chú hóa đơn */}
            <div className={styles.formRoww}>
                <label className={styles.label}>Ghi chú hóa đơn *</label>
                <textarea className={styles.inputTextarea}></textarea>
            </div>
        </div>
    );
}

export default Recipient;
