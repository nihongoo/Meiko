import styled from "styled-components";
import { Container } from "../styles/styles";
import Breadcrumb from "../Features/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../styles/user";
import UserMenu from "../Features/User/UserMenu";
import Title from "../Features/common/Title";
import { FormElement, Input, Textarea } from "../styles/form";
import { BaseButtonGreen, BaseButtonWhitesmoke } from "../styles/button";
import { defaultTheme } from "../styles/themes/default";

const AddressScreenWrapper = styled.main`
  padding: 20px 0;
  
  .form-elem-control {
    padding-left: 16px;
    border: 1px solid ${defaultTheme.color_platinum};
    margin-top: 8px;

    &:focus {
      border-color: ${defaultTheme.color_silver};
    }
  }

  .form-wrapper {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 1fr;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .form-btns {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .form-check-elem {
    margin-top: 10px;
    display: flex;
    align-items: center;

    input {
      margin-right: 10px;
    }
  }

  .form-label {
    font-size: 14px;
    font-weight: 600;
    color: ${defaultTheme.color_outersace};
  }

  .checkmark {
    width: 16px;
    height: 16px;
    background-color: ${defaultTheme.color_lightgray};
    border-radius: 4px;
    margin-right: 10px;
    display: inline-block;
    text-align: center;
    line-height: 16px;
    font-size: 12px;
    color: ${defaultTheme.color_white};
  }

  .checkmark input:checked + & {
    background-color: ${defaultTheme.color_sea_green};
  }

  .btn-cancel {
    background-color: ${defaultTheme.color_whitesmoke};
    color: ${defaultTheme.color_outersace};
    border: 1px solid ${defaultTheme.color_platinum};
    padding: 10px 20px;
    font-size: 14px;
  }
`;

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Tài khoản", link: "/account" },
  { label: "Thêm địa chỉ", link: "/account/add" },
];

const AddressScreen = () => {
  return (
    <div>
    <AddressScreenWrapper style={{ paddingTop: "220px" }}>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <Title titleText={"Tài khoản của tôi"} />
            <h4 className="title-sm">Thêm địa chỉ</h4>
            <form>
              <div className="form-wrapper">
                <FormElement>
                  <label className="form-label">Họ và tên*</label>
                  <Input type="text" className="form-elem-control" placeholder="Họ và tên" />
                </FormElement>

                <FormElement>
                  <label className="form-label">Họ*</label>
                  <Input type="text" className="form-elem-control" placeholder="Họ" />
                </FormElement>

                <FormElement>
                  <label className="form-label">Quốc gia / Vùng</label>
                  <Input type="text" className="form-elem-control" placeholder="Quốc gia / Vùng" />
                </FormElement>

                <FormElement>
                  <label className="form-label">Tên công ty*</label>
                  <Input type="text" className="form-elem-control" placeholder="Công ty (tuỳ chọn)" />
                </FormElement>

                <FormElement>
                  <label className="form-label">Địa chỉ*</label>
                  <Input type="text" className="form-elem-control" placeholder="Địa chỉ đường phố" />
                </FormElement>

                <FormElement>
                  <label className="form-label">Apt, Suite, Unit*</label>
                  <Input type="text" className="form-elem-control" placeholder="Apt, Suite, Unit (tuỳ chọn)" />
                </FormElement>

                <FormElement>
                  <label className="form-label">Thành phố*</label>
                  <Input type="text" className="form-elem-control" placeholder="Thành phố" />
                </FormElement>

                <FormElement>
                  <label className="form-label">Tỉnh / Thành phố*</label>
                  <select className="form-elem-control">
                    <option value="">Tỉnh 1</option>
                    <option value="">Tỉnh 2</option>
                  </select>
                </FormElement>

                <FormElement>
                  <label className="form-label">Số điện thoại*</label>
                  <Input type="text" className="form-elem-control" placeholder="Số điện thoại" />
                </FormElement>

                <FormElement>
                  <label className="form-label">Mã bưu điện*</label>
                  <Input type="text" className="form-elem-control" placeholder="Mã bưu điện" />
                </FormElement>

                <FormElement>
                  <label className="form-label">Hướng dẫn giao hàng</label>
                  <Textarea className="form-elem-control" placeholder="Hướng dẫn giao hàng" />
                </FormElement>
              </div>

              <div className="form-check-elem">
                <input type="checkbox" />
                <span className="checkmark">✔</span>
                <span>Đặt làm địa chỉ giao hàng mặc định</span>
              </div>
              <div className="form-btns">
                <BaseButtonGreen type="submit">Lưu</BaseButtonGreen>
                <BaseButtonWhitesmoke type="button" className="btn-cancel">Hủy</BaseButtonWhitesmoke>
              </div>
            </form>
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </AddressScreenWrapper>
    </div>
  );
};

export default AddressScreen;
