
import Home from '../pages/home/home'
import SoldOffline from '../pages/sold-offline/soldOffline'
import ManageBill from '../pages/manage-bill/manageBill'
import ManageProduct from '../pages/manage-product/manageProduct'
import ManageCategory from '../pages/manage-category/manageCategory'
import ManageBrand from '../pages/manage-brand/manageBrand'
import ManageMeterial from '../pages/manage-meterial/manageMeterial'
import ManageTarget from '../pages/manage-target/manageTarget'
import RetuenProduct from '../pages/return-product/returnProduct'
import ManageVoucher from '../pages/manage-voucher/manageVoucher'
import ManageSale from '../pages/manage-sale/manageSale'
import Account from '../pages/account/account'
import ManageCustomer from '../pages/manage-customer/manageCustomer'

import Login from '../component/Layout/loginLayout/login'

const privateRoutes = [
    {path: '/', component: Home, layout: 'admin'},
    { path: '/soldoffline', component: SoldOffline, layout: 'admin' },
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
]
const publicRoutes = [
    {path:'/login',component:Login, layout:'login'},

]

export {privateRoutes, publicRoutes}


