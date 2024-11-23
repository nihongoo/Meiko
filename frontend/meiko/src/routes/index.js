import Home from '../pages/home/home'
import ManageBill from '../pages/manage-bill/manageBill'
import ManageCategory from '../pages/manage-category/manageCategory'
import ManageBrand from '../pages/manage-brand/manageBrand'
import ManageMeterial from '../pages/manage-meterial/manageMeterial' 
import ManageTarget from '../pages/manage-target/manageTarget' 
import ManageVoucher from '../pages/manage-voucher/manageVoucher' 
import ManageSale from '../pages/manage-sale/manageSale'  
import Account from '../pages/account/account'
import ManageCustomer from '../pages/manage-customer/manageCustomer' 
import HomeUser from '../component/Layout/UserLayout/Pages/HomeUser'
import Shop from '../component/Layout/UserLayout/Pages/Shop'
import ProductDetail from '../component/Layout/UserLayout/Pages/ProductDetail'

const privateRoutes = [
    {path: '/', component: Home, layout: 'admin'},
    { path: '/managebill', component: ManageBill, layout: 'admin' },
    { path: '/managecategory', component: ManageCategory, layout: 'admin' },
    { path: '/managebrand', component: ManageBrand, layout: 'admin' },
    { path: '/managemeterial', component: ManageMeterial, layout: 'admin' },
    { path: '/managetarget', component: ManageTarget, layout: 'admin' },
    { path: '/managevoucher', component: ManageVoucher, layout: 'admin' },
    { path: '/managesale', component: ManageSale, layout: 'admin' },
    { path: '/account', component: Account, layout: 'admin' },
    { path: '/managecustomer', component: ManageCustomer, layout: 'admin' },
]
const publicRoutes = [
    {path: '/', component: Home, layout: 'admin'},
    {path: '/homeUser', component: HomeUser, layout: 'user'},
    {path: '/shop', component: Shop, layout: 'user'}
    {path: '/productdetail', component: ProductDetail, layout: 'user'},
]

export {privateRoutes, publicRoutes }


