import React from "react";
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
import Header from "../Header/index";

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
  return (
    <div>
      <Header />
      <AccountScreenWrapper className="page-py-spacing" style={{ paddingTop: "220px" }}>
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <UserDashboardWrapper>
            <UserMenu />
            <UserContent>
              <Title titleText={"Thông Tin Tài Khoản"} />
              <h4 className="title-sm">Thông Tin Liên Hệ</h4>
              <form>
                <div className="form-wrapper">
                  <FormElement className="form-elem">
                    <label className="form-label font-semibold text-base">Họ Tên</label>
                    <div className="form-input-wrapper flex items-center">
                      <Input
                        type="text"
                        className="form-elem-control text-outerspace font-semibold"
                        value="Richard Doe"
                        readOnly
                      />
                    </div>
                  </FormElement>
                  <FormElement className="form-elem">
                    <label className="form-label font-semibold text-base">Địa Chỉ Email</label>
                    <div className="form-input-wrapper flex items-center">
                      <Input
                        type="email"
                        className="form-elem-control text-outerspace font-semibold"
                        value="richard@gmail.com"
                        readOnly
                      />
                    </div>
                  </FormElement>
                  <FormElement className="form-elem">
                    <label className="form-label font-semibold text-base">Số Điện Thoại</label>
                    <div className="form-input-wrapper flex items-center">
                      <Input
                        type="text"
                        className="form-elem-control text-outerspace font-semibold"
                        value="+9686 6864 3434"
                        readOnly
                      />
                    </div>
                  </FormElement>
                  <FormElement className="form-elem">
                    <label className="form-label font-semibold text-base">Mật Khẩu</label>
                    <div className="form-input-wrapper flex items-center">
                      <Input
                        type="password"
                        className="form-elem-control text-outerspace font-semibold"
                        value="Pass Key"
                        readOnly
                      />
                    </div>
                  </FormElement>
                </div>
                <BaseLinkGreen to="/account/add">Thay đổi</BaseLinkGreen>
              </form>
              <div>
                <h4 className="title-sm">Địa Chỉ Của Tôi</h4>
                <BaseLinkGreen to="/AddressScreen">Thêm Địa Chỉ</BaseLinkGreen>
                <div className="address-list">
                  <div className="address-item">
                    <p className="text-outerspace text-lg font-semibold address-title">
                      Richard Doe
                    </p>
                    <p className="text-gray text-base font-medium address-description">
                      1/4 Watson Street Flat, East Coastal Road, Ohio City
                    </p>
                    <ul className="address-tags">
                      <li>Nhà</li>
                      <li>Địa Chỉ Thanh Toán Mặc Định</li>
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
