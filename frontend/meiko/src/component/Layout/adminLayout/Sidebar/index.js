import { Sidebar as SbToggle, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import logo, { icon } from '../../../../Asset/Export_Image';
import { useState, useEffect } from 'react';

function SideBar({ collapsed }) {
    const [showIcon, setShowIcon] = useState(false);

    useEffect(() => {
        if (collapsed) {
            // Nếu sidebar đang thu gọn
            setShowIcon(true);
        } else {
            // Nếu sidebar đang mở
            setShowIcon(false);
        }
    }, [collapsed]);

    return (
        <div className='border' style={{ height: '100vh', backgroundColor: '#f3f3f3' }}>
            <SbToggle
                collapsed={collapsed}
                collapsedWidth='60px'
            >
                <Menu>
                    <MenuItem
                        style={{ height: '60px' }}
                        component={
                            <Link to='/'></Link>
                        }
                    >
                        <div>
                            {showIcon ? (
                                <img alt='Icon' style={{ width: '100%', height:'100%' }} src={icon}></img>
                            ) : (
                                <img alt='Logo' style={{ width: '100%' }} src={logo}></img>
                            )}
                        </div>
                    </MenuItem>
                    <MenuItem
                        component={
                            <Link to='/'></Link>
                        }
                    >Thống kê</MenuItem>
                    <MenuItem
                        component={
                            <Link to='/soldoffline'></Link>
                        }
                    >Bán hàng tại quầy</MenuItem>
                    <MenuItem
                        component={
                            <Link to='/managebill'></Link>
                        }
                    >Quản lý đơn hàng</MenuItem>
                    <SubMenu label="Quản lý sản phẩm">
                        <MenuItem
                            component={
                                <Link to='/manageproduct'></Link>
                            }
                        >Sản phẩm</MenuItem>
                        <MenuItem
                            component={
                                <Link to='/managecategory'></Link>
                            }
                        >Loại</MenuItem>
                        <MenuItem
                            component={
                                <Link to='/managebrand'></Link>
                            }
                        >Thương hiệu</MenuItem>
                        <MenuItem
                            component={
                                <Link to='/managemeterial'></Link>
                            }
                        >Chất liệu</MenuItem>
                        <MenuItem
                            component={
                                <Link to='/managetarget'></Link>
                            }
                        >Đối tượng sử dụng</MenuItem>
                    </SubMenu>
                    <MenuItem
                        component={
                            <Link to='/returnproduct'></Link>
                        }
                    >Trả hàng</MenuItem>
                    <SubMenu label="Giảm giá">
                        <MenuItem
                            component={
                                <Link to='/managevoucher'></Link>
                            }
                        >Phiếu giảm giá</MenuItem>
                        <MenuItem
                            component={
                                <Link to='/managesale'></Link>
                            }
                        >Đợt giảm giá</MenuItem>
                    </SubMenu>
                    <SubMenu label="Tài khoản">
                        <MenuItem
                            component={
                                <Link to='/account'></Link>
                            }
                        >Nhân viên</MenuItem>
                        <MenuItem
                            component={
                                <Link to='/managecustomer'></Link>
                            }
                        >Khách hàng</MenuItem>
                    </SubMenu>
                </Menu>
            </SbToggle>
        </div>
    );
}

export default SideBar;