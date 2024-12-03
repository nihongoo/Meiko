import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Fade, Autocomplete, CircularProgress, Checkbox, FormControlLabel } from "@mui/material";
import { AddLocationAlt } from "@mui/icons-material";
import { toast } from "react-toastify";
import styles from "./RecipientModal.module.css";
import "react-toastify/dist/ReactToastify.css";

function RecipientModal({ open, onClose, selectedAddress, onUpdate, onAddNew, existingAddresses = [] }) { // Default empty array for existingAddresses
    const [formData, setFormData] = useState({
        recipientName: "",
        phoneNumber: "",
        email: "",
        addressDetail: "",
        city: "",
        district: "",
        ward: "",
        status: 1, 
        customerId: localStorage.getItem("customerId") || "",
    });

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    if (open) {
        fetchCities();
        if (selectedAddress) {
            setFormData({
                ...selectedAddress,
                customerId: localStorage.getItem("customerId") || "", 
            });
            // Set districts and wards based on selectedAddress
            const selectedCityData = cities.find((city) => city.name === selectedAddress.city);
            setDistricts(selectedCityData ? selectedCityData.districts : []);
            const selectedDistrictData = selectedCityData?.districts.find((district) => district.name === selectedAddress.district);
            setWards(selectedDistrictData ? selectedDistrictData.wards : []);
        } else {
            resetForm();
        }
    } else {
        resetForm();
    }
}, [open, selectedAddress]);


    const fetchCities = async () => {
        try {
            const response = await fetch("https://provinces.open-api.vn/api/?depth=3");
            const data = await response.json();
            if (Array.isArray(data)) {
                setCities(data);
            } else {
                console.error("Invalid city data format:", data);
                setCities([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thành phố:", error);
            toast.error("Không thể tải dữ liệu thành phố. Vui lòng thử lại.");
            setCities([]);
        }
    };

    const resetForm = () => {
        setFormData({
            recipientName: "",
            phoneNumber: "",
            email: "",
            addressDetail: "",
            city: "",
            district: "",
            ward: "",
            status: 1,
            customerId: localStorage.getItem("customerId") || "",
        });
        setDistricts([]);
        setWards([]);
    };

    const handleCityChange = (event, newValue) => {
        setFormData({
            ...formData,
            city: newValue,
            district: "",
            ward: "",
        });
        const selectedCityData = cities.find((city) => city.name === newValue);
        setDistricts(selectedCityData ? selectedCityData.districts : []);
        setWards([]);
    };

    const handleDistrictChange = (event, newValue) => {
        setFormData({
            ...formData,
            district: newValue,
            ward: "",
        });
    
        const selectedDistrictData = districts.find((district) => district.name === newValue);
        setWards(selectedDistrictData ? selectedDistrictData.wards : []);
    };

    const handleWardChange = (event, newValue) => {
        setFormData({
            ...formData,
            ward: newValue,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleStatusChange = (event) => {
        setFormData({ ...formData, status: event.target.checked ? 2 : 1 });
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^(0[3|5|7|8|9])\d{8}$/;
        return phoneRegex.test(phoneNumber);
    };

    const validateForm = () => {
        if (
            !formData.recipientName ||
            !formData.phoneNumber ||
            !formData.email ||
            !formData.city ||
            !formData.district ||
            !formData.ward ||
            !formData.addressDetail
        ) {
            toast.error("Vui lòng điền đầy đủ thông tin.");
            return false;
        }
        if (!validatePhoneNumber(formData.phoneNumber)) {
            toast.error("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        const endpoint = selectedAddress
            ? `https://localhost:7172/api/Address/update/${selectedAddress.id}`
            : `https://localhost:7172/api/Address/create?customerId=${formData.customerId}`;
    
        const method = selectedAddress ? "PUT" : "POST";
    
        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            setLoading(false);
            if (response.ok) {
                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    const result = await response.json();
                    toast.success(selectedAddress ? "Địa chỉ đã được cập nhật!" : "Địa chỉ đã được thêm thành công!");
                } else {
                    toast.success(selectedAddress ? "Địa chỉ đã được cập nhật!" : "Địa chỉ đã được thêm thành công!");
                }
    
                onClose();
                window.location.reload();
            } else {
                const errorText = await response.text();
                toast.error(`Đã có lỗi xảy ra: ${errorText}. Vui lòng thử lại.`);
            }
        } catch (error) {
            setLoading(false);
            console.error("Lỗi khi gửi dữ liệu:", error);
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
        }
    };
    

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Fade in={open}>
                <Box className={styles.modalBox}>
                    <div className={styles.modalHeader}>
                        <AddLocationAlt className={styles.modalIcon} />
                        <h2 className={styles.modalTitle}>
                            {selectedAddress ? "Cập Nhật Địa Chỉ Nhận Hàng" : "Thêm Địa Chỉ Nhận Hàng"}
                        </h2>
                    </div>
                    <div className={styles.modalContent}>
                        <TextField
                            label="Họ tên"
                            name="recipientName"
                            value={formData.recipientName}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className={styles.inputField}
                        />
                        <TextField
                            label="Số điện thoại"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className={styles.inputField}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className={styles.inputField}
                        />
                        <Autocomplete
                            options={(cities || []).map((city) => city.name)}
                            value={formData.city}
                            onChange={handleCityChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Thành phố"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className={styles.inputField}
                                />
                            )}
                        />
                        <Autocomplete
                            options={(districts || []).map((district) => district.name)}
                            value={formData.district}
                            onChange={handleDistrictChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Quận/Huyện"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className={styles.inputField}
                                    disabled={!formData.city}
                                />
                            )}
                        />
                        <Autocomplete
                            options={(wards || []).map((ward) => ward.name)}
                            value={formData.ward}
                            onChange={handleWardChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Phường/Xã"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className={styles.inputField}
                                    disabled={!formData.district}
                                />
                            )}
                        />
                        <TextField
                            label="Địa chỉ chi tiết"
                            name="addressDetail"
                            value={formData.addressDetail}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.modalActions}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : selectedAddress ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
}

export default RecipientModal;
