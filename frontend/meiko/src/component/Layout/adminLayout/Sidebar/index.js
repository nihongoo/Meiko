import { Sidebar as SbToggle, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../../Asset/Export_Image';
import { Avatar, Box, Button, Dialog, Popover, DialogTitle, Typography, TextField, InputAdornment } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CachedIcon from '@mui/icons-material/Cached';
import { useState } from 'react';
import useFetchData from '../../../../customHook/useFetchData'
import apiURL from '../../../../routes/API';
import moment from 'moment'


function SideBar({ collapsed }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const userId = localStorage.getItem('userId')
    const [showInfo, setShowInfo] = useState(false)
    const { data: aStaff } = useFetchData(`${apiURL.staff.getbyid}?id=${userId}`)
    localStorage.setItem('staffInfo', JSON.stringify(aStaff))
    const nav = useNavigate()
    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const userName = localStorage.getItem('username')
    const handleLogout = () => {
        localStorage.clear();
        nav('/SignIn');
    };

    const isPopoverOpen = Boolean(anchorEl);
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
            <Box p={1} display="flex" alignItems="center" position="relative">
                {/* Avatar Button */}
                <div className='d-flex align-items-center'>

                    <Avatar
                        onClick={handleAvatarClick}
                        sx={{ cursor: 'pointer', bgcolor: 'primary.main' }}
                        {...stringAvatar(userName)}
                    >

                    </Avatar>
                    <div className='ms-3'>
                        <h5 className='mb-0'
                            style={{
                                maxWidth: '150px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >{userName}</h5>
                    </div>
                </div>

                {/* Popover for Logout Button */}
                <Popover
                    open={isPopoverOpen}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                >
                    <Box
                        p={2}
                        display="flex"
                        flexDirection="column"
                        gap={1} // Tạo khoảng cách giữa các nút
                    >
                        <Button variant="contained" color="primary" onClick={() => { setShowInfo(true) }}>
                            Thông tin tài khoản
                        </Button>
                        <Button variant="contained" color="primary">
                            Đổi mật khẩu
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleLogout()}>
                            Đăng xuất
                        </Button>
                    </Box>
                </Popover>
            </Box>
            <StaffInfo
                open={showInfo}
                onClose={() => { setShowInfo(false) }}
                item={aStaff}
            >
            </StaffInfo>
            <ChangePassword />
        </Box>
    );
}

function StaffInfo({ open, onClose, item }) {
    const detailsData = [
        { label: "Họ và tên:", value: item.staffName },
        { label: "Mã nhân viên:", value: item.staffCode },
        { label: "Email:", value: item.email },
        { label: "Số điện thoại:", value: item.phoneNumber },
        { label: "Ngày vào làm:", value: moment(item.dateJoin).format('DD-MM-YYYY HH:mm') },
        { label: "Địa chỉ:", value: item.address },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Thông tin tài khoản</DialogTitle>
            <Box p={2}>
                {detailsData.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center">
                        <Box flex={1}>
                            <Typography variant="body2" component="p" className="m-0 p-0">
                                {item.label}
                            </Typography>
                        </Box>
                        <Box flex={1}>
                            <TextField
                                size="small"
                                variant="outlined"
                                fullWidth
                                disabled
                                value={item.value}
                                margin="dense" // Tạo khoảng cách giữa các TextField
                            />
                        </Box>
                    </div>
                ))}
                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button variant="outlined" color="error" onClick={onClose}>
                        Thoát
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}

function ChangePassword() {
    return (
      <Dialog open={false} maxWidth="sm" fullWidth>
        <Box p={3}>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>Đổi mật khẩu</Typography>
          </Box>
  
          <Box mb={3}>
            <Typography variant="body1" gutterBottom>Email</Typography>
            <TextField
              placeholder="Hãy nhập email mà bạn đã đăng ký"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Gửi mã
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
  
          <Box mb={3}>
            <Typography variant="body1" gutterBottom>Mã xác minh</Typography>
            <TextField
              placeholder="Hãy nhập mã xác minh được gửi về email"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Xác nhận mã
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
  
          <Box mb={3}>
            <Typography variant="body1" gutterBottom>Mật khẩu mới</Typography>
            <TextField
              placeholder="Hãy nhập mật khẩu mới"
              variant="outlined"
              fullWidth
              size="small"
              type="password"
            />
          </Box>
  
          <Box mb={3}>
            <Typography variant="body1" gutterBottom>Nhập lại mật khẩu mới</Typography>
            <TextField
              placeholder="Hãy nhập lại mật khẩu mới"
              variant="outlined"
              fullWidth
              size="small"
              type="password"
            />
          </Box>
  
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" color="error">
              Hủy
            </Button>
            <Button variant="outlined" color="success">
              Cập nhật mật khẩu
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  }


function stringAvatar(name) {
    const initials = name.split(' ').map(word => word[0]).join('');
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: initials.length === 1 ? initials : initials.substring(0, 2),
    };
}
function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export default SideBar;