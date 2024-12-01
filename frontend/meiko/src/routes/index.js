import Home from '../Pages/Home/Index'
import SoldOfline from '../Pages/Sold_Offline/SoldOfline'
import ManageBill from '../Pages/Manage_Bill/ManageBill'
import ManageProduct from '../Pages/Manage_Product/ManageProduct'
import ManageCategory from '../Pages/Manage_Category/ManageCategory'
import ManageBrand from '../Pages/Manage_Brand/ManageBrand'
import ManageMeterial from '../Pages/Manage_Meterial/ManageMeterial'
import ManageTarget from '../Pages/Manage_Target/ManageTarget'
import ReturnProduct from '../Pages/Return_Product/ReturnProduct'
import ManageVoucher from '../Pages/Manage_Voucher/ManageVoucher'
import ManageSale from '../Pages/Manage_Sale/ManageSale'
import Account from '../Pages/Account/account'
import ManageCustomer from '../Pages/Manage_Customer/ManageCustomer'
import CreateLG from '../Pages/Manage_Product/CreateLG'
import ListProductDetail from '../Pages/Product_Detail/ListProductDetail'

import Login from '../component/Layout/LoginLayout/Account/Login/Index'
import Register from '../component/Layout/LoginLayout/Account/Register/index'
import ForgotPassWord from '../component/Layout/LoginLayout/Account/forgotPassword/index'
import HomeUser from '../component/Layout/UserLayout/Pages/HomeUser'
import ProductDetail from '../component/Layout/UserLayout/Pages/ProductDetail'
import Shop from '../component/Layout/UserLayout/Pages/Shop'
import Cart from '../component/Layout/UserLayout/Pages/ShopCart'
const publicProutes = [
    { path: '/', component: Home , layout: 'admin'},
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
    { path: '/listproductdetail/:id', component: ListProductDetail, layout: 'admin' },
//User routes
    {path:'/SignIn', component: Login, layout:'user'},
    {path:'/SignUp', component: Register, layout:'user'},
    {path:'/forgot-password', component: ForgotPassWord, layout:'user'},
    {path:'/homeUser', component: HomeUser, layout:'user'},
    {path:'/productdetail/:productId', component: ProductDetail, layout:'user'},
    {path:'/Shop', component: Shop, layout:'user'},
    {path:'/Cart', component: Cart, layout:'user'},
]

const privateRoutes = []

export { publicProutes, privateRoutes }