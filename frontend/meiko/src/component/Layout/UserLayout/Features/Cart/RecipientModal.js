import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Fade, Autocomplete, CircularProgress } from "@mui/material";
import { AddLocationAlt } from "@mui/icons-material";
import { toast } from "react-toastify";
import styles from "./RecipientModal.module.css";
import "react-toastify/dist/ReactToastify.css";

function RecipientModal({ open, onClose, selectedAddress, onUpdate, onAddNew, existingAddresses = [] }) {
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

    // Lấy dữ liệu các tỉnh
    useEffect(() => {
        if (open) {
            fetchProvinces();
            if (selectedAddress) {
                // Nếu có địa chỉ đã chọn, điền thông tin vào form
                setFormData({
                    ...selectedAddress,
                    customerId: localStorage.getItem("customerId") || "",
                });
                fetchDistricts(selectedAddress.city); // Gọi API để lấy quận
                fetchWards(selectedAddress.district); // Gọi API để lấy phường
            } else {
                resetForm();
            }
        } else {
            resetForm();
        }
    }, [open, selectedAddress]);

    // Lấy dữ liệu các tỉnh
    const fetchProvinces = async () => {
        try {
            const response = await fetch("https://localhost:7172/api/Shipping/provinces");
            if (response.ok) {
                const data = await response.json();
                setCities(data);
            } else {
                console.error("Failed to fetch provinces");
            }
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    // Lấy các quận theo provinceId
    const fetchDistricts = async (provinceId) => {
        try {
            const response = await fetch(`https://localhost:7172/api/Shipping/districts?provinceId=${provinceId}`);
            if (response.ok) {
                const data = await response.json();
                setDistricts(data);
            } else {
                console.error("Failed to fetch districts");
            }
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    // Lấy các phường theo districtId
    const fetchWards = async (districtId) => {
        try {
            const response = await fetch(`https://localhost:7172/api/Shipping/wards?districtId=${districtId}`);
            if (response.ok) {
                const data = await response.json();
                setWards(data);
            } else {
                console.error("Failed to fetch wards");
            }
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    // Reset form
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

    // Xử lý khi chọn thành phố
    const handleCityChange = (event, newValue) => {
        setFormData({
            ...formData,
            city: newValue,
            district: "",
            ward: "",
        });
        const selectedCity = cities.find((city) => city.provinceName === newValue);
        if (selectedCity) {
            fetchDistricts(selectedCity.provinceID); // Gọi API để lấy quận
        }
    };

    // Xử lý khi chọn quận
    const handleDistrictChange = (event, newValue) => {
        setFormData({
            ...formData,
            district: newValue,
            ward: "",
        });
        const selectedDistrict = districts.find((district) => district.districtName === newValue);
        if (selectedDistrict) {
            fetchWards(selectedDistrict.districtID); // Gọi API để lấy phường
        }
    };

    // Xử lý khi chọn phường
    const handleWardChange = (event, newValue) => {
        setFormData({
            ...formData,
            ward: newValue,
        });
    };

    // Xử lý thay đổi các trường khác
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Kiểm tra số điện thoại hợp lệ
    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^(0[3|5|7|8|9])\d{8}$/;
        return phoneRegex.test(phoneNumber);
    };

    // Kiểm tra form hợp lệ
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

    // Gửi dữ liệu
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
                toast.success(selectedAddress ? "Địa chỉ đã được cập nhật!" : "Địa chỉ đã được thêm thành công!");
                onClose();
                onUpdate(); // Update address list without reloading the page
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
                            options={(cities || []).map((city) => city.provinceName)}
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
                            options={(districts || []).map((district) => district.districtName)}
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
                            options={(wards || []).map((ward) => ward.wardName)}
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
