import React from 'react'
import {Outlet} from "react-router-dom";

const LayoutAdmin = () => {
    return (
        <div>
            <h1>Sidebar Navbar with dropdown, center logo and icon</h1>
            <h1>Header</h1>
            <hr/>
            <Outlet/>
        </div>
    )
}
export default LayoutAdmin
