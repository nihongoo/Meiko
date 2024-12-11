const apiURL = {
    category: {
        base: 'https://localhost:7172/api/Category/',
        all: 'https://localhost:7172/api/Category/get-all',
        getbyid :'https://localhost:7172/api/Category/Get/{id}',
        create: 'https://localhost:7172/api/Category/add-category',
        edit: 'https://localhost:7172/api/Category/Update/',
        delete: 'https://localhost:7172/api/Category/Delete/',
        search: 'https://localhost:7265/Category/Search'
    },
    brand: {
        base: 'https://localhost:7172/api/Brand/',
        all: 'https://localhost:7172/api/Brand/get-all',
        getbyid :'https://localhost:7172/api/Brand/Get/{id}',
        create: 'https://localhost:7172/api/Brand/add-brand',
        edit: 'https://localhost:7172/api/Brand/Update/',
        delete: 'https://localhost:7172/api/Brand/Delete/',
        search: 'https://localhost:7265/Brand/Search'
    },
    target: {
        base: 'https://localhost:7172/api/Target/',
        all: 'https://localhost:7172/api/Target/get-all',
        getbyid :'https://localhost:7172/api/Target/Get/{id}',
        create: 'https://localhost:7172/api/Target/add-target',
        edit: 'https://localhost:7172/api/Target/Update/',
        delete: 'https://localhost:7172/api/Target/Delete/',
        search: 'https://localhost:7265/TagetCustomers/Search'
    },
    meterial: {
        base: 'https://localhost:7172/api/Material/',
        all: 'https://localhost:7172/api/Material/get-all',
        getbyid :'https://localhost:7172/api/Material/Get/{id}',
        create: 'https://localhost:7172/api/Material/add-material',
        edit: 'https://localhost:7172/api/Material/Update/',
        delete: 'https://localhost:7172/api/Material/Delete/',
        search: 'https://localhost:7265/Meterial/Search'
    },
    color: {
        base: 'https://localhost:7172/api/Color/',
        all: 'https://localhost:7172/api/Color/get-all',
        getbyid :'https://localhost:7172/api/Color/Get/{id}',
        create: 'https://localhost:7172/api/Color/add-color',
        edit: 'https://localhost:7172/api/Color/Update/{id}',
        delete: 'https://localhost:7172/api/Color/Delete/{id}',
        search: 'https://localhost:7265/Color/Search'
    },
    size: {
        base: 'https://localhost:7172/api/Size/',
        all: 'https://localhost:7172/api/Size/get-all',
        getbyid :'https://localhost:7172/api/Size/Get/{id}',
        create: 'https://localhost:7172/api/Size/add-size',
        edit: 'https://localhost:7172/api/Size/Update/{id}',
        delete: 'https://localhost:7172/api/Size/Delete/{id}',
        search: 'https://localhost:7265/Size/Search'
    },
    product: {
        all: 'https://localhost:7172/api/Product/Get-All',
        getbyid :'https://localhost:7172/api/Product/Get/',
        create: 'https://localhost:7172/api/Product/Create',
        edit: 'https://localhost:7172/api/Product/Update/',
        delete: 'https://localhost:7172/api/Product/Delete/',
        search: 'https://localhost:7265/Product/Search/',
    },
    productDetail: {
        all: 'https://localhost:7172/api/ProductDetail/Product/',
        edit: 'https://localhost:7172/api/ProductDetail/Update/',
        base: 'https://localhost:7172/api/ProductDetail/Get-All',
        soldOff: 'https://localhost:7172/api/ProductDetail/SoldOff'

    },
    image: {
        base: 'https://localhost:7172/api/Images',
        getImg: 'https://localhost:7172/api/Images/Get/',
        create: 'https://localhost:7172/api/Images/Create',
    },
    user: {
        login: 'https://localhost:7265/login/',
        signup: 'https://localhost:7265/signup/',
        all: 'https://localhost:7172/api/Customer/Get-All',
        edit: 'https://localhost:7172/api/Customer/Update/',
        search: 'https://localhost:7265/Account/Search/',//old
    },
    staff: {
        create: 'https://localhost:7172/api/Account/register-staff',
        all: 'https://localhost:7172/api/Staff/Get-All',
        edit: 'https://localhost:7172/api/Staff/Update/',
        search: 'https://localhost:7265/Staff/Search/',
        delete: 'https://localhost:7265/Staff/Delete-Staff/',
        getbyid: 'https://localhost:7172/api/Staff/Get-By-AccID',
        getByStaffId: 'https://localhost:7172/api/Staff/Get/'
    },
    account:{
        base: 'https://localhost:7172/api/Account/Account/',
        create_customer: 'https://localhost:7172/api/Account/register-customer/',
        create_staff: 'https://localhost:7172/api/Account/register-staff/',
        login: 'https://localhost:7172/api/Account/login/',
        forgot_password: 'https://localhost:7172/api/Account/forgot-password/',
        verify_otp: 'https://localhost:7172/api/Account/verify-otp/',
        verify:'https://localhost:7172/api/Account/verify',
    },
    cartDetails:{
        base: 'https://localhost:7172/api/CartDetails/',
        getall: 'https://localhost:7172/CartDetails/get-all-cartdetail-by/{cartid}',
        create: 'https://localhost:7172/api/CartDetails/add-to-cart',
        update: 'https://localhost:7172/api/CartDetails/change-stock-only/{cartdetailid}',
        delete: 'https://localhost:7172/api/CartDetails/remove-from-cart/{cartdetailid}',
        deleteAll: 'https://localhost:7172/api/CartDetails/clear-cart/{cartid}'
    },
    cart:{
        getId:'https://localhost:7172/api/Carts/{customerid}'
    },
    bill:{
        create:'https://localhost:7172/api/Bills/create-bill',
        delete:'https://localhost:7172/api/Bills/delete-bill/',
        list: 'https://localhost:7172/api/Bills/List-Bill-Detail',
        addToBill: 'https://localhost:7172/api/Bills/add-to-bill',
        deleteDetail: 'https://localhost:7172/api/Bills/Delete-Bill-Detail?id=',
        billId:'https://localhost:7172/api/Bills/get-bill-by-id/',
        all:'https://localhost:7172/api/Bills/get-bills',
        filter: 'https://localhost:7172/api/Bills/Filter',
        search: 'https://localhost:7172/api/Bills/Search',
        pay: 'https://localhost:7172/api/Bills/pay-for-bill/',
        changeStatus: 'https://localhost:7172/api/Bills/change-status-from-bill/',
        changeQuantity: 'https://localhost:7172/api/Bills/add-quantity-to/',
    },
    voucher:{
        create: 'https://localhost:7172/api/Voucher/Create',
        all: 'https://localhost:7172/api/Voucher/GetAll',
        delete: 'https://localhost:7172/api/Voucher/Delete/',
        filter: 'https://localhost:7172/api/Voucher/Filter'
    },
    sale: {
        all: 'https://localhost:7172/api/Sales/Get-All',
        create: 'https://localhost:7172/api/Sales/Create',
        delete: 'https://localhost:7172/api/Sales/Delete/',
        filter: 'https://localhost:7172/api/Sales/Filter'
    },
    payHistory:{
        byBillId: 'https://localhost:7172/api/Bills/get-paymentHistories-by-billId/'
    }
    
};
export default apiURL;