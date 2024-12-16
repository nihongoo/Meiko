import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "../styles/styles";
import Breadcrumb from "../Features/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../styles/user";
import UserMenu from "../Features/User/UserMenu";
import Title from "../Features/common/Title";
import { FormElement, Input } from "../styles/form";
import { BaseLinkGreen } from "../styles/button";
import { Link } from "react-router-dom";
import { breakpoints, defaultTheme } from "../styles/themes/default";

const AccountScreenWrapper = styled.main`
  .address-list {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    @media (max-width: ${breakpoints.lg}) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .address-item {
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px;
    background-color: ${defaultTheme.color_whitesmoke};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

    p {
      margin: 0;
    }

    .address-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      li {
        height: auto;
        border-radius: 8px;
        padding: 4px 10px;
        background-color: ${defaultTheme.color_lightgray};
        font-size: 14px;
      }
    }
  }

  .address-btns {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;

    .btn-separator {
      width: 1px;
      height: 20px;
      background: ${defaultTheme.color_platinum};
      margin: 0 8px;
    }
  }

  .address-title {
    font-size: 18px;
    font-weight: bold;
    color: ${defaultTheme.color_outersace};
  }

  .address-description {
    font-size: 14px;
    color: ${defaultTheme.color_gray};
    margin-top: 8px;
  }

  .address-tags {
    margin-top: 10px;
    list-style-type: none;
    padding-left: 0;
  }

  .address-tags li {
    background-color: ${defaultTheme.color_lightgray};
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 12px;
  }

  .address-btns a {
    font-size: 14px;
    color: ${defaultTheme.color_outersace};
    text-decoration: none;
    font-weight: bold;
  }
`;


const breadcrumbItems = [
  {
    label: "Trang Chủ",
    link: "/",
  },
  { label: "Tài Khoản", link: "/account" },
];

const AccountUser = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [gender, setGender] = useState("");

  const fetchCustomerData = async () => {
    try {
      const userId = localStorage.getItem("customerId");
      const response = await fetch(`https://localhost:7172/api/Customer/Get/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch customer data");
      const data = await response.json();
      setUserData(data);
      setGender(data.sex ? "male" : "female");
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        birthDay: data.birthDay || "",
      });
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";  
    const dateObj = new Date(date); 
    const day = String(dateObj.getDate()).padStart(2, '0'); 
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Hàm gọi API update thông tin
  const updateCustomerData = async () => {
    try {
      const userId = localStorage.getItem("customerId");
      const response = await fetch(`https://localhost:7172/api/Customer/Update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, sex: gender === "male", id: userId, status: 1 }),
      });
      if (!response.ok) throw new Error("Failed to update customer data");
      const updatedData = await response.json();
      setUserData(updatedData);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating customer data:", error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AccountScreenWrapper className="page-py-spacing" style={{ paddingTop: "140px" }}>
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <UserDashboardWrapper>
            <UserMenu />
            <UserContent>
              <Title titleText={"Thông Tin Tài Khoản"} />
              <h4 className="title-sm">Thông Tin Liên Hệ</h4>
              <form style={{ paddingBottom: "30px" }}>
                <div className="form-wrapper">
                  <FormElement className="form-elem">
                    <label className="form-label font-semibold text-base">Họ Tên</label>
                    <div className="form-input-wrapper flex items-center">
                      <Input
                        type="text"
                        name="name"
                        className="form-elem-control text-outerspace font-semibold"
                        value={formData.name}
                        onChange={handleInputChange}
                        readOnly={!editMode}
                      />
                    </div>
                  </FormElement>
                  <FormElement className="form-elem">
                    <label className="form-label font-semibold text-base">Địa Chỉ Email</label>
                    <div className="form-input-wrapper flex items-center">
                      <Input
                        type="email"
                        name="email"
                        className="form-elem-control text-outerspace font-semibold"
                        value={formData.email}
                        onChange={handleInputChange}
                        readOnly={!editMode}
                      />
                    </div>
                  </FormElement>
                  <FormElement className="form-elem">
                    <label className="form-label font-semibold text-base">Số Điện Thoại</label>
                    <div className="form-input-wrapper flex items-center">
                      <Input
                        type="text"
                        name="phoneNumber"
                        className="form-elem-control text-outerspace font-semibold"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        readOnly={!editMode}
                      />
                    </div>
                  </FormElement>
                  <FormElement className="form-elem">
                    <label className="form-label font-semibold text-base">Ngày sinh</label>
                    <div className="form-input-wrapper flex items-center">
                      {editMode ? (
                        <Input
                          type="date"
                          name="birthDay"
                          className="form-elem-control text-outerspace font-semibold"
                          value={formData.birthDay}
                          onChange={handleInputChange}
                          readOnly={!editMode}
                        />
                      ) : (
                        <Input
                          type="text"
                          className="form-elem-control text-outerspace font-semibold"
                          value={formatDate(formData.birthDay)}
                          readOnly
                        />
                      )}
                    </div>
                  </FormElement>
                  <FormElement className="form-elem">
                    <label className="form-label font-semibold text-base">Giới Tính</label>
                    <div className="form-input-wrapper flex items-center">
                      {!editMode ? (
                        <Input
                          type="text"
                          className="form-elem-control text-outerspace font-semibold"
                          value={gender === "male" ? "Nam" : "Nữ"}
                          readOnly
                        />
                      ) : (
                        <select
                          value={gender}
                          onChange={handleInputChange}
                          className="form-elem-control text-outerspace font-semibold"
                        >
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                        </select>
                      )}
                    </div>
                  </FormElement>
                </div>
                {editMode ? (
                  <>
                    <BaseLinkGreen as="button" onClick={updateCustomerData}>
                      Lưu
                    </BaseLinkGreen>
                    <BaseLinkGreen as="button" onClick={() => setEditMode(false)} style={{marginLeft:"15px"}}>
                      Hủy
                    </BaseLinkGreen>
                  </>
                ) : (
                  <BaseLinkGreen as="button" onClick={() => setEditMode(true)}>
                    Chỉnh Sửa
                  </BaseLinkGreen>
                )}
              </form>
              <hr />
              {/* Phần Địa Chỉ */}
              <div>
                <h4 className="title-sm" style={{ paddingTop: "30px" }}>
                  Địa Chỉ Của Tôi
                </h4>
                <div style={{ paddingTop: "20px" }}>
                  <BaseLinkGreen to="/AddressScreen">Thêm Địa Chỉ</BaseLinkGreen>
                </div>
                <div className="address-list">
                  {userData.addresses && userData.addresses.length > 0 ? (
                    userData.addresses.map((address, index) => (
                      <div key={index} className="address-item">
                        <p className="text-outerspace text-lg font-semibold address-title">
                          {address.recipientName}
                        </p>
                        <p className="text-gray text-base font-medium address-description">
                          {address.detail}, {address.ward}, {address.district}, {address.city}
                        </p>
                        <ul className="address-tags">
                          <li>{address.type}</li>
                          {address.isDefault && <li>Địa Chỉ Thanh Toán Mặc Định</li>}
                        </ul>
                        <div className="address-btns">
                          <Link to="/" className="text-base text-outerspace font-semibold">
                            Xóa
                          </Link>
                          <div className="btn-separator"></div>
                          <Link to="/" className="text-base text-outerspace font-semibold">
                            Chỉnh Sửa
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Không có địa chỉ nào được lưu.</p>
                  )}
                </div>
              </div>
            </UserContent>
          </UserDashboardWrapper>
        </Container>
      </AccountScreenWrapper>
    </div>
  );
};


export default AccountUser;
