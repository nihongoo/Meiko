const apiURL = {
    category: {
        base: 'https://localhost:7265/Category/Category/',
        all: 'https://localhost:7265/Category/Get-All-Category/',
        create: 'https://localhost:7265/Category/Create-Category/',
        edit: 'https://localhost:7265/Category/Edit-Category/',
        delete: 'https://localhost:7265/Category/Delete-Category',
        search: 'https://localhost:7265/Category/Search'
    },
    brand: {
        base: 'https://localhost:7265/Brand/Brand/',
        all: 'https://localhost:7265/Brand/Get-All-Brand/',
        create: 'https://localhost:7265/Brand/Create-Brand/',
        edit: 'https://localhost:7265/Brand/Edit-Brand/',
        delete: 'https://localhost:7265/Brand/Delete-Brand',
        search: 'https://localhost:7265/Brand/Search'
    },
    target: {
        base: 'https://localhost:7265/TagetCustomers/TagetCustomers/',
        all: 'https://localhost:7265/TagetCustomers/Get-All-TagetCustomers/',
        create: 'https://localhost:7265/TagetCustomers/Create-TagetCustomers/',
        edit: 'https://localhost:7265/TagetCustomers/Edit-TagetCustomers/',
        delete: 'https://localhost:7265/TagetCustomers/Delete-TagetCustomers',
        search: 'https://localhost:7265/TagetCustomers/Search'
    },
    meterial: {
        base: 'https://localhost:7265/Meterial/Meterial/',
        all: 'https://localhost:7265/Meterial/Get-All-Meterial/',
        create: 'https://localhost:7265/Meterial/Create-Meterial/',
        edit: 'https://localhost:7265/Meterial/Edit-Meterial/',
        delete: 'https://localhost:7265/Meterial/Delete-Meterial',
        search: 'https://localhost:7265/Meterial/Search'
    },
    color: {
        base: 'https://localhost:7265/Color/Color/',
        all: 'https://localhost:7265/Color/Get-All-Color/',
        create: 'https://localhost:7265/Color/Create-Color/',
        edit: 'https://localhost:7265/Color/Edit-Color/',
        delete: 'https://localhost:7265/Color/Delete-Color',
        search: 'https://localhost:7265/Color/Search'
    },
    size: {
        base: 'https://localhost:7265/Size/Size/',
        all: 'https://localhost:7265/Size/Get-All-Size/',
        create: 'https://localhost:7265/Size/Create-Size/',
        edit: 'https://localhost:7265/Size/Edit-Size/',
        delete: 'https://localhost:7265/Size/Delete-Size',
        search: 'https://localhost:7265/Size/Search'
    },
    product: {
        base: 'https://localhost:7265/Product/Product/',
        all: 'https://localhost:7265/Product/Get-All-Product/',
        create: 'https://localhost:7265/Product/Create-Product/',
        delete: 'https://localhost:7265/Product/Delete-Product',
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