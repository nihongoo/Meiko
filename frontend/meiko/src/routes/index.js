import Home from '../pages/Home/Index'
import SoldOfline from '../pages/Sold_Offline/SoldOfline'
import ManageBill from '../pages/Manage_Bill/ManageBill'
import ManageProduct from '../pages/Manage_Product/ManageProduct'
import ManageCategory from '../pages/Manage_Category/ManageCategory'
import ManageBrand from '../pages/Manage_Brand/ManageBrand'
import ManageMeterial from '../pages/Manage_Meterial/ManageMeterial'
import ManageTarget from '../pages/Manage_Target/ManageTarget'
import ReturnProduct from '../pages/Return_Product/ReturnProduct'
import ManageVoucher from '../pages/Manage_Voucher/ManageVoucher'
import ManageSale from '../pages/Manage_Sale/ManageSale'
import Account from '../pages/account/account'
import ManageCustomer from '../pages/Manage_Customer/ManageCustomer'
import CreateLG from '../pages/Manage_Product/CreateLG'
import HomeUser from '../component/Layout/UserLayout/Pages/HomeUser'
import Shop from '../component/Layout/UserLayout/Pages/Shop'
import ProductDetail from '../component/Layout/UserLayout/Pages/ProductDetail'
import SignIn from '../component/Layout/loginLayout/Account/Login/Index'
import SignUp from '../component/Layout/loginLayout/Account/Register/index'
import ForgotPassword from '../component/Layout/loginLayout/Account/forgotPassword/index'
import ShopCart from '../component/Layout/UserLayout/Pages/ShopCart'
import ListProductDetail from '../pages/Product_Detail/ListProductDetail'
import Checkout from '../component/Layout/UserLayout/Pages/Checkout'
import AccountUser from '../component/Layout/UserLayout/Pages/AccountUser'
import AddressScreen from '../component/Layout/UserLayout/Pages/AddressScreen'
import OrderListScreen from '../component/Layout/UserLayout/Pages/OrderListScreen'
import OrderDetailScreen from '../component/Layout/UserLayout/Pages/OrderDetailScreen'

const publicRoutes = [
    { path: '/', component: Home , layout: 'admin'},
    { path: '/SignIn', component: SignIn, layout: 'login'},
    { path: '/signup', component: SignUp, layout: 'login'},
    { path: '/forgot-password', component: ForgotPassword, layout: 'login'},
    { path: '/soldoffline', component: SoldOfline, layout: 'admin' },
    { path: '/managebill', component: ManageBill, layout: 'admin' },
    { path: '/manageproduct', component: ManageProduct, layout: 'admin' },
    { path: '/manageproduct/add', component: CreateLG, layout: 'admin' },
    { path: '/managecategory', component: ManageCategory, layout: 'admin' },
    { path: '/managebrand', component: ManageBrand, layout: 'admin' },
    { path: '/managemeterial', component: ManageMeterial, layout: 'admin' },
    { path: '/managetarget', component: ManageTarget, layout: 'admin' },
    { path: '/returnproduct', component: ReturnProduct, layout: 'admin' },
    { path: '/managevoucher', component: ManageVoucher, layout: 'admin' },
    { path: '/managesale', component: ManageSale, layout: 'admin' },
    { path: '/account', component: Account, layout: 'admin' },
    { path: '/managecustomer', component: ManageCustomer, layout: 'admin' },
    { path: '/homeUser', component: HomeUser, layout: 'user'},
    { path: '/shop', component: Shop, layout: 'user'},
    { path: '/productdetail/:productId', component: ProductDetail, layout: 'user'},
    { path: '/ShopCart', component: ShopCart, layout: 'user'},
    { path: '/listproductdetail/:id', component: ListProductDetail, layout: 'admin' },
    { path: '/checkout', component: Checkout, layout: 'user'},
    { path: '/accountUser', component: AccountUser, layout: 'user'},
    { path: '/addressScreen', component: AddressScreen, layout: 'user'},
    { path: '/orderlistscreen', component: OrderListScreen, layout: 'user'},
    { path: '/orderdetailscreen', component: OrderDetailScreen, layout: 'user'},
]
const privateRoutes = [
    {path: '/', component: Home, layout: 'admin'},
]

export { publicRoutes, privateRoutes }