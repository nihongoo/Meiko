const apiURL = {
    category: {
        base: 'https://localhost:7172/api/Category/',
        all: 'https://localhost:7172/api/Category/get-all',
        create: 'https://localhost:7172/api/Category/add-category',
        edit: 'https://localhost:7172/api/Category/',
        delete: 'https://localhost:7172/api/Category/',
        search: 'https://localhost:7265/Category/Search'//chưa có search
    },
    brand: {
        base: 'https://localhost:7172/api/Brand/',
        all: 'https://localhost:7172/api/Brand/get-all',
        create: 'https://localhost:7172/api/Brand/add-Brand',
        edit: 'https://localhost:7172/api/Brand/',
        delete: 'https://localhost:7172/api/Brand/',
        search: 'https://localhost:7265/Brand/Search'
    },
    target: {
        base: 'https://localhost:7172/api/Target/',
        all: 'https://localhost:7172/api/Target/get-all',
        create: 'https://localhost:7172/api/Target/add-Target',
        edit: 'https://localhost:7172/api/Target/',
        delete: 'https://localhost:7172/api/Target/',
        search: 'https://localhost:7265/TagetCustomers/Search'
    },
    meterial: {
        base: 'https://localhost:7172/api/Material/',
        all: 'https://localhost:7172/api/Material/get-all',
        create: 'https://localhost:7172/api/Material/add-Material',
        edit: 'https://localhost:7172/api/Material/',
        delete: 'https://localhost:7172/api/Material/',
        search: 'https://localhost:7265/Meterial/Search'
    },
    color: {
        base: 'https://localhost:7172/api/Color/',
        all: 'https://localhost:7172/api/Color/get-all',
        create: 'https://localhost:7172/api/Color/add-Color',
        edit: 'https://localhost:7172/api/Color/',
        delete: 'https://localhost:7172/api/Color/',
        search: 'https://localhost:7265/Color/Search'
    },
    size: {
        base: 'https://localhost:7172/api/Size/',
        all: 'https://localhost:7172/api/Size/get-all',
        create: 'https://localhost:7172/api/Size/add-Size',
        edit: 'https://localhost:7172/api/Size/',
        delete: 'https://localhost:7172/api/Size/',
        search: 'https://localhost:7265/Size/Search'
    },
    product: {
        all: 'https://localhost:7172/api/Product/',
        create: 'https://localhost:7172/api/Product/',
        edit: 'https://localhost:7172/api/Product/',
        delete: 'https://localhost:7172/api/Product/',
        search: 'https://localhost:7265/Product/Search/',
    },
    user: {
        login: 'https://localhost:7265/login/',
        signup: 'https://localhost:7265/signup/',
        all: 'https://localhost:7265/Account/All-User/',
        search: 'https://localhost:7265/Account/Search/',
    },
    staff: {
        create: 'https://localhost:7265/Create-New-Staff/',
        all: 'https://localhost:7265/Staff/Get-All-Staff/',
        search: 'https://localhost:7265/Staff/Search/',
        delete: 'https://localhost:7265/Staff/Delete-Staff/',
    },
    account:{
        base: 'https://localhost:7172/api/Account/Account/',
        create_customer: 'https://localhost:7172/api/Account/register-customer/',
        create_staff: 'https://localhost:7172/api/Account/register-staff/',
        login: 'https://localhost:7172/api/Account/login/',
        forgot_password: 'https://localhost:7172/api/Account/forgot-password/',
        verify_otp: 'https://localhost:7172/api/Account/verify-otp/'
    },
    
};
export default apiURL;