import { Sidebar as SbToggle, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import logo from '../../../../Asset/Export_Image';
import { Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import CachedIcon from '@mui/icons-material/Cached';

function SideBar({ collapsed }) {
    return (
        <Box
            className="border-end"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
            }}
        >
            {/* Logo Section */}
            <Box
                sx={{
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img alt="Logo" className='p-3' style={{ width: '100%' }} src={logo} />
            </Box>

            {/* Menu Section */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#555",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "#f1f1f1",
                    },
                }}
            >
                <SbToggle collapsed={collapsed} collapsedWidth="60px">
                    <Menu>
                        <MenuItem
                            icon={<DashboardIcon />}
                            component={<Link className='p-2' to="/" />}
                        >
                            Thống kê
                        </MenuItem>
                        <MenuItem
                            icon={<StoreIcon />}
                            component={<Link className='p-2' to="/soldoffline" />}
                        >
                            Bán hàng tại quầy
                        </MenuItem>
                        <MenuItem
                            icon={<ReceiptIcon />}
                            component={<Link className='p-2' to="/managebill" />}
                        >
                            Quản lý đơn hàng
                        </MenuItem>
                        <SubMenu
                            label="Quản lý sản phẩm"
                            icon={<CategoryIcon />}
                            style={{
                                padding: '0.5rem'
                            }}
                        >
                            <MenuItem component={<Link to="/manageproduct" />}>
                                Sản phẩm
                            </MenuItem>
                            <MenuItem component={<Link to="/managecategory" />}>
                                Loại
                            </MenuItem>
                            <MenuItem component={<Link to="/managebrand" />}>
                                Thương hiệu
                            </MenuItem>
                            <MenuItem component={<Link to="/managemeterial" />}>
                                Chất liệu
                            </MenuItem>
                            <MenuItem component={<Link to="/managetarget" />}>
                                Đối tượng sử dụng
                            </MenuItem>
                        </SubMenu>
                        <MenuItem
                            icon={<CachedIcon />}
                            component={<Link className='p-2' to="/returnproduct" />}
                        >
                            Trả hàng
                        </MenuItem>
                        <SubMenu style={{ padding: '0.5rem' }} label="Giảm giá" icon={<LocalOfferIcon />}>
                            <MenuItem component={<Link to="/managevoucher" />}>
                                Phiếu giảm giá
                            </MenuItem>
                            <MenuItem component={<Link to="/managesale" />}>
                                Đợt giảm giá
                            </MenuItem>
                        </SubMenu>
                        <SubMenu style={{ padding: '0.5rem' }} label="Tài khoản" icon={<AccountCircleIcon />}>
                            <MenuItem component={<Link to="/account" />}>
                                Nhân viên
                            </MenuItem>
                            <MenuItem component={<Link to="/managecustomer" />}>
                                Khách hàng
                            </MenuItem>
                        </SubMenu>
                    </Menu>
                </SbToggle>
            </Box>
        </Box>
    );
}

export default SideBar;