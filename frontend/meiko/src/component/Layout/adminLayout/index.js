import React, { useState } from 'react';
import Header from './Header'
import SideBar from './Sidebar'

function AdminLayout({ children }) {

    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className='d-flex'>
            <div>
                <SideBar collapsed={collapsed} />
            </div>
            <div style={{width:'100vw'}}>
                <Header setCollapsed={setCollapsed} collapsed={collapsed}/>
                <div className='content'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;