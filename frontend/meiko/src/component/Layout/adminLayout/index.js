import React, { useState } from 'react';
import Header from './Header/index'
import SideBar from './Sidebar/index';

function AdminLayout({ children }) {

    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className='d-flex' style={{ height: '100vh', overflow: 'hidden' }}>
            <div className='bg-light' style={{ width: collapsed ? '60px' : '250px', transition: 'width 0.3s' }}>
                <SideBar collapsed={collapsed} />
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'auto',
                    overflowY: 'hidden',
                    transition: 'margin-left 0.3s',
                }}
            >
                <Header setCollapsed={setCollapsed} collapsed={collapsed} />
                <div
                    style={{
                        height: '100vh',
                        overflowY: 'auto',
                        overflowX: 'auto',
                    }}
                    className='m-0 bg-body-secondary p-0 pb-4'
                >
                    <div className='content p-4 mb-4'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;