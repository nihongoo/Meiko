import React, { useState } from 'react';
import Header from './Header'
import SideBar from './SideBar'

function AdminLayout({ children }) {

    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className='d-flex'>
            <div className='bg-light'>
                <SideBar collapsed={collapsed} />
            </div>
            <div style={{ width: '100vw' }}>
                <Header setCollapsed={setCollapsed} collapsed={collapsed} />
                <div
                    style={{
                        height: '100vh',
                        overflowY: 'auto'
                    }}
                    className='m-0 bg-body-secondary p-0'
                >
                    <div className='content p-4'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;