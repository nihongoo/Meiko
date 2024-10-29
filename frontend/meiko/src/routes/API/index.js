const apiURL = {
    category: {
        base: 'https://localhost:7265/Category/Category/',
        all: 'https://localhost:7265/Category/Get-All-Category/',
        create: 'https://localhost:7265/Category/Create-Category/',
        edit: 'https://localhost:7265/Category/Edit-Category/',
        delete: 'https://localhost:7265/Category/Delete-Category',
        search: 'https://localhost:7265/Category/Search'
    },
    account:{
        base: 'https://localhost:7172/api/Account/Account/',
        create_customer: 'https://localhost:7172/api/Account/register-customer/',
        create_staff: 'https://localhost:7172/api/Account/register-staff/',
        login: 'https://localhost:7172/api/Account/login/',
        forgot_password: 'https://localhost:7172/api/Account/forgot-password/',
        verify_otp: 'https://localhost:7172/api/Account/verify-otp/'
    }
}

export default apiURL