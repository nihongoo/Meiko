const apiURL = {
    category: {
        base: 'https://localhost:7172/api/Category/',

        GetAll: 'https://localhost:7172/api/Category/get-all',
        GetById: 'https://localhost:7172/api/Category/get/{id}',
        Create: 'https://localhost:7172/api/Category/create',
        Update: 'https://localhost:7172/api/Category/update/{id}',
    },
    brand:{
        base: 'https://localhost:7172/api/Brand/',
        GetAll: 'https://localhost:7172/api/Brand/get-all',
        GetById: 'https://localhost:7172/api/Brand/get/{id}',
        Create: 'https://localhost:7172/api/Brand/create',
        Update: 'https://localhost:7172/api/Brand/update/{id}',
        Delete: 'https://localhost:7172/api/Brand/delete/{id}'
    },
    color:{
        base: 'https://localhost:7172/api/Color/',
        GetAll: 'https://localhost:7172/api/Color/get-all',
        GetById: 'https://localhost:7172/api/Color/get/{id}',
        Create: 'https://localhost:7172/api/Color/create',
        Update: 'https://localhost:7172/api/Color/update/{id}',
        Delete: 'https://localhost:7172/api/Color/delete/{id}'
    },
    material:{
        base: 'https://localhost:7172/api/Material/',
        GetAll: 'https://localhost:7172/api/Material/get-all',
        GetById: 'https://localhost:7172/api/Material/get/{id}',
        Create: 'https://localhost:7172/api/Material/create',
        Update: 'https://localhost:7172/api/Material/update/{id}',
        Delete: 'https://localhost:7172/api/Material/delete/{id}'
    },
    size:{
        base: 'https://localhost:7172/api/Size/',
        GetAll: 'https://localhost:7172/api/Size/get-all',
        GetById: 'https://localhost:7172/api/Size/get/{id}',
        Create: 'https://localhost:7172/api/Size/create',
        Update: 'https://localhost:7172/api/Size/update/{id}',
        Delete: 'https://localhost:7172/api/Size/delete/{id}'
    },
    account:{
        base: 'https://localhost:7172/api/Account/Account/',
        create_customer: 'https://localhost:7172/api/Account/register-customer/',
        create_staff: 'https://localhost:7172/api/Account/register-staff/',
        login: 'https://localhost:7172/api/Account/login/',
        forgot_password: 'https://localhost:7172/api/Account/forgot-password/',
        verify_otp: 'https://localhost:7172/api/Account/verify-otp/'
    },
    product:{
        base: 'https://localhost:7172/api/Product/',
        GetAll: 'https://localhost:7172/api/Product/Get-All',
        GetById: 'https://localhost:7172/api/Product/Get/{id}',
        Create: 'https://localhost:7172/api/Product/Create',
        Update: 'https://localhost:7172/api/Product/Update/{id}',
    },
    productDetails:{
        base: 'https://localhost:7172/api/ProductDetail',
        GetAll: 'https://localhost:7172/api/ProductDetail/Get-All',
        GetById: 'https://localhost:7172/api/ProductDetail/Get/{id}',
        Create: 'https://localhost:7172/api/ProductDetail/Create',
        Update: 'https://localhost:7172/api/ProductDetail/Update/{id}',
        Delete: 'https://localhost:7172/api/ProductDetail/Delete/{id}'
    }
}

export default apiURL
    

