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
import ListProductDetail from '../Pages/Product_Detail/ListProductDetail'


const publicProutes = [
    { path: '/', component: Home , layout: 'admin'},
    { path: '/login', component: SignIn, layout: 'login'},
    { path: '/signup', component: SignUp, layout: 'login'},
    { path: '/forgotpassword', component: ForgotPassword, layout: 'login'},
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
]
const privateRoutes = [
    {path: '/', component: Home, layout: 'admin'},
    { path: '/listproductdetail/:id', component: ListProductDetail, layout: 'admin' },
]

export { publicProutes, privateRoutes }