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

    const apiKey = "97f81af44199486f994b1c4eae5fb437";

    const getCoordinatesFromAddress = async (address) => {
        try {
            const centralCities = {
                "Hà Nội": "Hà Nội",
                "Hồ Chí Minh": "TP Hồ Chí Minh",
                "Đà Nẵng": "Đà Nẵng",
                "Cần Thơ": "Cần Thơ",
                "Hải Phòng": "Hải Phòng",
                "Bình Dương": "Bình Dương",
            };
            let addressQuery;
            if (centralCities[address.city]) {
                addressQuery = `${address.addressDetail}, ${address.ward}, ${address.district}, ${centralCities[address.city]}`;
            } else {
                addressQuery = `${address.addressDetail}, ${address.ward}, ${address.district}, ${address.city}`;
            }
            const encodedAddress = encodeURIComponent(addressQuery);
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${apiKey}`);
            const data = await response.json();
    
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                if (result.geometry && result.geometry.lat && result.geometry.lng) {
                    const district = result.components.district || ''; 
                    const city = result.components.city || result.components.state || ''; 
                    return {
                        lat: result.geometry.lat,
                        lng: result.geometry.lng,
                        district: district,
                        city: city
                    };
                } else {
                    throw new Error("Không tìm thấy tọa độ hợp lệ từ địa chỉ.");
                }
            } else {
                throw new Error("Không tìm thấy địa chỉ trong kết quả OpenCage.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy tọa độ từ OpenCage API:", error);
            return null;
        }
    };
    const calculateDistance = (store, user) => {
        const R = 6371;
        const dLat = (user.lat - store.lat) * Math.PI / 180;
        const dLon = (user.lng - store.lng) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(store.lat * Math.PI / 180) * Math.cos(user.lat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c;
        distance *= 0.55; 
    
        return distance;
    };
    const calculateShippingFee = async (address) => {
        setLoading(true);
        const userLocation = await getCoordinatesFromAddress(address);

        if (userLocation) {
            const storeLocation = { lat: 21.0285, lng: 105.8542 };

            const shippingDistance = calculateDistance(storeLocation, userLocation);

            if (shippingDistance < 12) {
                setShippingFee(0); 
                setLoading(false);
                return 0; 
            }

            const feePerKm = 1000; 
            let fee = shippingDistance * feePerKm;

            fee = fee < 10000 ? 10000 : fee;

            const roundedFee = Math.round(fee); 

            setShippingFee(roundedFee); 
            setLoading(false);
            return roundedFee;
        } else {
            setShippingFee(0); 
            setLoading(false);
            return 0;
        }
    };

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

    const handleSelectChange = (event, address) => {
        setSelectedAddressId(address.id);
        setSelectedAddress(address);
        calculateShippingFee(address);
        onSelectAddress(address);
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
