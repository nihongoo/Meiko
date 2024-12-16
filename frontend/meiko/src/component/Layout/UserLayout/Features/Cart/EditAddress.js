import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

const EditAddress = ({ newAddress, setNewAddress, handleAddressChange, setIsEditingAddress }) => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  // Initialize formState with newAddress or an empty object if not provided
  const initialFormData = {
    recipientName: "",
    phoneNumber: "",
    addressDetail: "",
    city: "",
    district: "",
    ward: "",
  };
  
  const [formState, setFormState] = useState(newAddress || initialFormData);

  // Fetch provinces (cities)
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

  // Fetch districts
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

  // Fetch wards
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

  // Fetch data on component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Fetch districts when city is selected
  useEffect(() => {
    if (formState.city) {
      const selectedCity = cities.find(city => city.provinceName === formState.city);
      if (selectedCity) {
        fetchDistricts(selectedCity.provinceID);
      }
    }
  }, [formState.city, cities]);

  // Fetch wards when district is selected
  useEffect(() => {
    if (formState.district) {
      const selectedDistrict = districts.find(district => district.districtName === formState.district);
      if (selectedDistrict) {
        fetchWards(selectedDistrict.districtID);
      }
    }
  }, [formState.district, districts]);

  // Update formState and newAddress when fields change
  const handleChange = (field, value) => {
    setFormState({ ...formState, [field]: value });
    setNewAddress({ ...formState, [field]: value });  // Sync formState to newAddress
  };

  // When user selects a city, update city in formState and newAddress
  const handleCityChange = async (newCity) => {
    setFormState({ ...formState, city: newCity, district: "", ward: "" });
    setNewAddress({ ...formState, city: newCity, district: "", ward: "" }); // Update newAddress
    if (newCity) {
      const selectedCity = cities.find((city) => city.provinceName === newCity);
      if (selectedCity) {
        await fetchDistricts(selectedCity.provinceID);
      }
    }
  };

  // When user selects a district, update district in formState and newAddress
  const handleDistrictChange = async (newDistrict) => {
    setFormState({ ...formState, district: newDistrict, ward: "" });
    setNewAddress({ ...formState, district: newDistrict, ward: "" }); // Update newAddress
    if (newDistrict) {
      const selectedDistrict = districts.find((district) => district.districtName === newDistrict);
      if (selectedDistrict) {
        await fetchWards(selectedDistrict.districtID);
      }
    }
  };

  return (
    <div>
      <div>
        <label>Người nhận:</label>
        <TextField
          value={formState.recipientName}
          onChange={(e) => handleChange("recipientName", e.target.value)}
          label="Người nhận"
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </div>

      <div>
        <label>Số điện thoại:</label>
        <TextField
          value={formState.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          label="Số điện thoại"
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </div>

      <div>
        <label>Địa chỉ:</label>
        <TextField
          value={formState.addressDetail}
          onChange={(e) => handleChange("addressDetail", e.target.value)}
          label="Địa chỉ chi tiết"
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </div>

      <div>
        <label>Thành phố:</label>
        <Autocomplete
          options={cities.map((city) => city.provinceName)}
          value={formState.city}
          onChange={(event, newValue) => handleCityChange(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Chọn thành phố" variant="outlined" fullWidth margin="normal" />
          )}
        />
      </div>

      <div>
        <label>Quận/Huyện:</label>
        <Autocomplete
          options={districts.map((district) => district.districtName)}
          value={formState.district}
          onChange={(event, newValue) => handleDistrictChange(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Chọn quận/huyện" variant="outlined" fullWidth margin="normal" />
          )}
        />
      </div>

      <div>
        <label>Xã/Phường:</label>
        <Autocomplete
          options={wards.map((ward) => ward.wardName)}
          value={formState.ward}
          onChange={(event, newValue) => handleChange("ward", newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Chọn xã/phường" variant="outlined" fullWidth margin="normal" />
          )}
        />
      </div>

      <button onClick={handleAddressChange} className="btn btn-success mt-3">
        Cập nhật địa chỉ
      </button>
      <button onClick={() => setIsEditingAddress(false)} className="btn btn-link mt-3">
        Hủy
      </button>
    </div>
  );
};

export default EditAddress;
