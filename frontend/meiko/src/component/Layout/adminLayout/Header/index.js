function Header({ setCollapsed, collapsed }) {
    return (
        <header
            className="border-bottom"
            style={{ height: 60, width: '100%' }}
        >
            <div className="h-100 d-flex align-items-center bg-body-secondary">
                <button
                    className='sb-button m-2 btn border border-dark'
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <i class="fa-solid fa-bars"></i>
                </button>
                aaaaa
            </div>
        </header>
    );
}

export default Header;